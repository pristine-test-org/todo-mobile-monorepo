---
name: Tally Mobile
description: The native Tally app for iOS and Android, for now a single welcome screen
colors:
  background: "#1E2A3B"
  ink: "#FFFFFF"
  ink-soft: "#A9B4C4"
typography:
  title:
    fontFamily: "System (SF Pro on iOS, Roboto on Android)"
    fontSize: 34
    fontWeight: 800
    letterSpacing: -0.5
  body:
    fontFamily: "System"
    fontSize: 17
    fontWeight: 400
---

## Overview

Tally Mobile is the Expo app for iOS and Android. Today it is one screen: the name and a line of
text, centred on navy. The list itself lives in the web apps for now.

## Colors

- **Background** navy fills the screen; the status bar text is light.
- **Ink** white for the title, **ink-soft** for the line under it.

## Typography

- The platform's system font; no custom fonts to load. Title 34/800, body 17.

## Do's and Don'ts

**Do**
- Use native components and the system font.

**Don't**
- Add a web build or `react-native-web`.
