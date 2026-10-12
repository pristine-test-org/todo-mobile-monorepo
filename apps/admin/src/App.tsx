import { useCallback, useEffect, useState, type FormEvent } from "react";
import { missingConfig, supabase, type Todo } from "./lib/supabase.ts";

type Status = "loading" | "ready" | "error";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(missingConfig ? "error" : "loading");
  const [error, setError] = useState<string | null>(missingConfig);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) return;
    setStatus("loading");
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
    // Fetching on mount is the point of this effect; load() sets state once the request settles.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function addTodo(event: FormEvent) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!supabase || !trimmed) return;
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

  const open = todos.filter((t) => !t.done).length;
  const finished = todos.length - open;
  const stats = [
    { key: "total", label: "Total", value: todos.length },
    { key: "open", label: "Open", value: open },
    { key: "done", label: "Done", value: finished },
  ];

  return (
    <div className="console">
      <aside className="rail">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">T</span>
          <div>
            <h1 className="wordmark">Tally Admin</h1>
            <p className="brand-sub">Shared list</p>
          </div>
        </div>
        <dl className="stats" aria-label="List totals">
          {stats.map((stat) => (
            <div key={stat.key} className="stat" data-stat={stat.key}>
              <dt>{stat.label}</dt>
              <dd>{status === "ready" ? stat.value : "–"}</dd>
            </div>
          ))}
        </dl>
      </aside>

      <main className="workspace">
        <header className="toolbar">
          <h2 className="section-title">Items</h2>
          <form className="composer" onSubmit={addTodo}>
            <label className="sr-only" htmlFor="new-todo">
              New item
            </label>
            <input
              id="new-todo"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="New item title"
              maxLength={200}
              autoComplete="off"
              disabled={!supabase}
            />
            <button type="submit" disabled={!supabase || saving || !title.trim()}>
              {saving ? "Creating…" : "Create item"}
            </button>
          </form>
        </header>

        {error && (
          <div className="notice" role="alert" data-state="error">
            <p>{error}</p>
            {supabase && status === "error" && (
              <button type="button" className="quiet" onClick={() => void load()}>
                Retry
              </button>
            )}
          </div>
        )}

        {status === "loading" && (
          <p className="state" data-state="loading" aria-live="polite">
            Loading items…
          </p>
        )}

        {status === "ready" && todos.length === 0 && (
          <div className="state" data-state="empty">
            <p className="state-title">No items yet.</p>
            <p>Create one above and it shows up in every Tally app.</p>
          </div>
        )}

        {status === "ready" && todos.length > 0 && (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" className="col-status">Done</th>
                  <th scope="col">Title</th>
                  <th scope="col" className="col-date">Created</th>
                  <th scope="col" className="col-actions">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {todos.map((todo) => (
                  <tr key={todo.id} className="row" data-done={todo.done}>
                    <td className="col-status">
                      <input
                        type="checkbox"
                        checked={todo.done}
                        onChange={() => void toggleTodo(todo)}
                        aria-label={`Mark "${todo.title}" ${todo.done ? "open" : "done"}`}
                      />
                    </td>
                    <td className="col-title">{todo.title}</td>
                    <td className="col-date">
                      <time dateTime={todo.created_at}>{formatDate(todo.created_at)}</time>
                    </td>
                    <td className="col-actions">
                      <button
                        type="button"
                        className="remove"
                        onClick={() => void deleteTodo(todo)}
                        aria-label={`Delete "${todo.title}"`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

const dateFormat = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

function formatDate(value: string) {
  return dateFormat.format(new Date(value));
}
