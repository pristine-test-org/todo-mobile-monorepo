---
name: Tally Mobile
description: The shared Tally list in your pocket, one native screen with the add bar under your thumb
colors:
  header: "#1E2A3B"
  header-ink: "#FFFFFF"
  header-soft: "#A9B4C4"
  background: "#F2F4F7"
  card: "#FFFFFF"
  ink: "#1E2A3B"
  ink-soft: "#6B7685"
  line: "#DDE2E9"
  accent: "#F0643C"
  accent-ink: "#FFFFFF"
  danger: "#C2382B"
  danger-tint: "#FCE9E6"
typography:
  display:
    fontFamily: "System (SF Pro on iOS, Roboto on Android)"
    fontSize: 34
    fontWeight: 800
    letterSpacing: -0.5
  body:
    fontFamily: "System"
    fontSize: 17
    fontWeight: 400
rounded:
  md: 10
  lg: 14
  pill: 999
spacing:
  gutter: 16
  touch-target: 44
components:
  header:
    backgroundColor: "{colors.header}"
    textColor: "{colors.header-ink}"
  list:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.lg}"
  check:
    size: 24
    activeColor: "{colors.accent}"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.pill}"
---

## Overview

Tally Mobile is the same shared list as the web apps, built as a native iOS and Android app with
Expo. One screen: a navy header with a large title, the list in a rounded white group, and the add
bar pinned to the bottom where a thumb reaches it. It should feel like a system app, not a web page
in a frame. Tokens live in `src/theme.ts`.

## Colors

- **Header** navy runs under the status bar (light status bar text) and carries the wordmark and the
  "n of m left" count.
- **Background** is the grouped-list grey behind the list; **card** is the white group and the add bar.
- **Accent** (coral) fills the Add button and finished check circles. Nothing else.
- **Danger** and its tint are only for the error banner.

## Typography

- The platform's system font everywhere; no custom fonts to load.
- Large title 34/800 for the wordmark, 17 for rows and the input, 15 for supporting text.

## Layout

- Safe-area aware: the header extends under the notch; the add bar sits above the home indicator and
  rises with the keyboard on iOS.
- Order: header → error banner (if any) → list or state → add bar.
- Pull down on the list to reload it.

## Elevation & Depth

- Flat. Hairline separators between rows (inset past the check circle) and above the add bar.

## Shapes

- The list group is `14` rounded; the banner `10`; the input and Add button are pills; checks are circles.
- Every tap target is at least `44` points tall.

## Components

- **Row:** round check (empty ring, coral when done), title, and a quiet **Delete** on the right.
  Tapping the row toggles it; done titles go ink-soft with a line through.
- **Add bar:** pill input plus the coral **Add** pill, dimmed until there is text. Return also adds.
- **States:** loading is a spinner with one line; empty is a centred title and hint; errors are a
  tinted banner with **Try again** when reloading can help.

## Do's and Don'ts

**Do**
- Use native controls and the system font.
- Keep one screen and one primary action.

**Don't**
- Add tabs, navigation or a web build.
- Use the coral for anything but adding and done.
