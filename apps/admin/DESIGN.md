---
name: Tally Admin
description: The shared Tally list as a dense table for the people who look after it
colors:
  surface: "#F4F4F5"
  panel: "#FFFFFF"
  rail: "#18181B"
  rail-ink: "#FAFAFA"
  rail-soft: "#A1A1AA"
  ink: "#18181B"
  ink-soft: "#71717A"
  line: "#E4E4E7"
  accent: "#0E7490"
  accent-hover: "#155E75"
  accent-ink: "#FFFFFF"
  danger: "#B91C1C"
  danger-tint: "#FEF2F2"
typography:
  body:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  data:
    fontFamily: "IBM Plex Mono, ui-monospace, Menlo, monospace"
    fontWeight: 500
rounded:
  sm: "4px"
spacing:
  rail: "15rem"
  gutter: "2rem"
  gutter-mobile: "1rem"
components:
  rail:
    backgroundColor: "{colors.rail}"
    textColor: "{colors.rail-ink}"
    width: "{spacing.rail}"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 0.9rem"
  table:
    backgroundColor: "{colors.panel}"
    borderColor: "{colors.line}"
    rounded: "{rounded.sm}"
  notice-error:
    backgroundColor: "{colors.danger-tint}"
    textColor: "{colors.danger}"
    rounded: "{rounded.sm}"
---

## Overview

Tally Admin is the back office for the shared list: the same items as Tally, shown as rows in a
table with when each was created. It should feel like a tidy internal tool, dense and calm, with a
dark side rail and one teal accent. Information first; nothing decorative.

## Colors

- **Rail** (near-black) holds the wordmark and the Total / Open / Done counts.
- **Surface** is the page; **panel** is the white table and state boxes.
- **Accent** (teal) is the Create item button, the brand mark, checkboxes and focus rings. Nothing else.
- **Danger** and its tint are only for the error notice and the Delete hover.
- **Line** draws the table border, header rule and row dividers.

## Typography

- **IBM Plex Sans** for everything readable: wordmark, headings, titles, buttons.
- **IBM Plex Mono** for data: counts in the rail and created dates in the table.
- Body is 14px; table headers are 12px uppercase with light tracking.

## Layout

- Two columns: a fixed `15rem` rail on the left, the workspace on the right with a `2rem` gutter.
- Workspace order: "Items" heading with the create form on the same row → notice (if any) → table or state.
- Under 760px the rail becomes a top bar (brand left, counts right), the gutter drops to `1rem`
  and the Created column hides.

## Elevation & Depth

- Flat. Borders only; no shadows. The dark rail against the light surface gives the structure.

## Shapes

- Everything uses `4px` corners: inputs, buttons, the table, notices, the brand mark.
- No icons; the favicon is three bars on a dark square.

## Components

- **Create form:** input plus the teal **Create item** button, dimmed until there is text.
- **Row:** checkbox (Done), title, created date in mono, and an outlined **Delete** on the right.
  Done rows go ink-soft with a line through the title.
- **States:** loading and empty sit in a bordered white box; errors are a tinted notice with
  **Retry** when reloading can help.

## Do's and Don'ts

**Do**
- Keep one table and one primary action.
- Show raw facts (counts, dates) in the mono face.

**Don't**
- Add charts, filters, bulk actions or extra pages.
- Use the teal for anything but the primary action and focus.
