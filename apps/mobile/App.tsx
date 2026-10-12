import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { missingConfig, supabase, type Todo } from "./src/lib/supabase";
import { colors, radius, space } from "./src/theme";

type Status = "loading" | "ready" | "error";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <TodoScreen />
    </SafeAreaProvider>
  );
}

function TodoScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(missingConfig ? "error" : "loading");
  const [error, setError] = useState<string | null>(missingConfig);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("todos")
      .select("id, title, done, created_at")
      .order("created_at", { ascending: false });
    if (error) {
      setError("We couldn't load your list. Check your connection and try again.");
      setStatus("error");
      return;
    }
    setTodos(data ?? []);
    setError(null);
    setStatus("ready");
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function retry() {
    setStatus("loading");
    await load();
  }

  async function refresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function addTodo() {
    const trimmed = title.trim();
    if (!supabase || !trimmed || saving) return;
    setSaving(true);
    const { data, error } = await supabase
      .from("todos")
      .insert({ title: trimmed })
      .select("id, title, done, created_at")
      .single();
    setSaving(false);
    if (error || !data) {
      setError("That one didn't save. Try again.");
      return;
    }
    setTodos((current) => [data, ...current]);
    setTitle("");
    setError(null);
  }

  async function toggleTodo(todo: Todo) {
    if (!supabase) return;
    setTodos((current) => current.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t)));
    const { error } = await supabase.from("todos").update({ done: !todo.done }).eq("id", todo.id);
    if (error) {
      setTodos((current) => current.map((t) => (t.id === todo.id ? { ...t, done: todo.done } : t)));
      setError("We couldn't update that item. Try again.");
    }
  }

  async function deleteTodo(todo: Todo) {
    if (!supabase) return;
    const previous = todos;
    setTodos((current) => current.filter((t) => t.id !== todo.id));
    const { error } = await supabase.from("todos").delete().eq("id", todo.id);
    if (error) {
      setTodos(previous);
      setError("We couldn't remove that item. Try again.");
    }
  }

  const remaining = todos.filter((t) => !t.done).length;
  const canAdd = Boolean(supabase) && !saving && title.trim().length > 0;

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.wordmark} accessibilityRole="header">
          Tally
        </Text>
        {status === "ready" && todos.length > 0 && (
          <Text style={styles.count}>
            <Text style={styles.countStrong}>{remaining}</Text> of {todos.length} left
          </Text>
        )}
      </View>

      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {error && (
          <View style={styles.notice} accessibilityRole="alert" testID="notice-error">
            <Text style={styles.noticeText}>{error}</Text>
            {supabase && status === "error" && (
              <Pressable onPress={() => void retry()} hitSlop={8} accessibilityRole="button">
                <Text style={styles.noticeAction}>Try again</Text>
              </Pressable>
            )}
          </View>
        )}

        {status === "loading" && (
          <View style={styles.state} testID="state-loading">
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.stateText}>Loading your list…</Text>
          </View>
        )}

        {status === "ready" && (
          <FlatList
            data={todos}
            keyExtractor={(todo) => todo.id}
            contentContainerStyle={todos.length === 0 ? styles.listEmpty : styles.list}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => void refresh()} tintColor={colors.accent} />
            }
            ListEmptyComponent={
              <View style={styles.state} testID="state-empty">
                <Text style={styles.stateTitle}>Nothing on the list.</Text>
                <Text style={styles.stateText}>Add the first thing below.</Text>
              </View>
            }
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Pressable
                  style={styles.rowMain}
                  onPress={() => void toggleTodo(item)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: item.done }}
                  accessibilityLabel={item.title}
                >
                  <View style={[styles.check, item.done && styles.checkOn]}>
                    {item.done && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                  <Text style={[styles.rowTitle, item.done && styles.rowTitleDone]}>{item.title}</Text>
                </Pressable>
                <Pressable
                  onPress={() => void deleteTodo(item)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete "${item.title}"`}
                >
                  <Text style={styles.delete}>Delete</Text>
                </Pressable>
              </View>
            )}
          />
        )}

        {status === "error" && <View style={styles.fill} />}

        <SafeAreaView edges={["bottom"]} style={styles.composer}>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="What needs doing?"
            placeholderTextColor={colors.inkSoft}
            maxLength={200}
            returnKeyType="done"
            onSubmitEditing={() => void addTodo()}
            editable={Boolean(supabase)}
            accessibilityLabel="New item"
          />
          <Pressable
            style={[styles.addButton, !canAdd && styles.addButtonDisabled]}
            onPress={() => void addTodo()}
            disabled={!canAdd}
            accessibilityRole="button"
          >
            <Text style={styles.addButtonText}>{saving ? "Adding…" : "Add"}</Text>
          </Pressable>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.header },
  header: {
    paddingHorizontal: space.gutter,
    paddingTop: space.sm,
    paddingBottom: space.lg,
    backgroundColor: colors.header,
  },
  wordmark: { color: colors.headerInk, fontSize: 34, fontWeight: "800", letterSpacing: -0.5 },
  count: { marginTop: 2, color: colors.headerSoft, fontSize: 15 },
  countStrong: { color: colors.headerInk, fontWeight: "700" },
  body: { flex: 1, backgroundColor: colors.background },
  fill: { flex: 1 },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    margin: space.gutter,
    marginBottom: 0,
    padding: space.md,
    borderRadius: radius.md,
    backgroundColor: colors.dangerTint,
  },
  noticeText: { flex: 1, color: colors.danger, fontSize: 15 },
  noticeAction: { color: colors.danger, fontSize: 15, fontWeight: "700" },
  state: { flex: 1, alignItems: "center", justifyContent: "center", gap: space.sm, padding: space.xl },
  stateTitle: { color: colors.ink, fontSize: 20, fontWeight: "700" },
  stateText: { color: colors.inkSoft, fontSize: 15 },
  list: { margin: space.gutter, borderRadius: radius.lg, backgroundColor: colors.card, overflow: "hidden" },
  listEmpty: { flexGrow: 1 },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: 56, backgroundColor: colors.line },
  row: { flexDirection: "row", alignItems: "center", paddingRight: space.gutter, backgroundColor: colors.card },
  rowMain: { flex: 1, flexDirection: "row", alignItems: "center", gap: space.md, paddingVertical: 14, paddingLeft: space.gutter },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  checkOn: { borderColor: colors.accent, backgroundColor: colors.accent },
  checkMark: { color: colors.accentInk, fontSize: 14, fontWeight: "800" },
  rowTitle: { flex: 1, color: colors.ink, fontSize: 17 },
  rowTitleDone: { color: colors.inkSoft, textDecorationLine: "line-through" },
  delete: { color: colors.inkSoft, fontSize: 15 },
  composer: {
    flexDirection: "row",
    gap: space.sm,
    paddingHorizontal: space.gutter,
    paddingTop: space.md,
    paddingBottom: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    backgroundColor: colors.card,
  },
  input: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    color: colors.ink,
    fontSize: 17,
  },
  addButton: {
    minHeight: 44,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
  },
  addButtonDisabled: { opacity: 0.45 },
  addButtonText: { color: colors.accentInk, fontSize: 17, fontWeight: "700" },
});
