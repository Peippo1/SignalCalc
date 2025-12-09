<p align="center">
  <img src="./docs/finchworks-banner.png" alt="FinchWorks Studio Banner" />
</p>

# Signal Calculator

Accessible, keyboard-first calculator built with React 18. Includes memory keys, history tape, sign toggle, parentheses/powers/square root/percent support, copy-to-clipboard, high-contrast theme, and local persistence.

<p align="center">
  <img src="https://img.shields.io/badge/React-18.0.0-61dafb?logo=react&logoColor=white" alt="React 18" />
  <img src="https://img.shields.io/badge/Build-Passing-brightgreen?logo=github-actions&logoColor=white" alt="Build Status" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License" />
  <img src="https://img.shields.io/badge/PRs-Welcome-green.svg" alt="PRs Welcome" />
  <img src="https://img.shields.io/github/stars/YOUR_USERNAME/YOUR_REPO?style=social" alt="GitHub stars" />
  <img src="https://img.shields.io/badge/FinchWorks%20Studio-Crafted-blue?logo=sparkles&logoColor=white" alt="FinchWorks Studio" />
</p>

## Features
- Full keyboard control: numbers, operators (`+ - * / ^`), decimal, Enter `=` to evaluate, Backspace to delete, Escape/Delete to clear, Alt+C/MR/M+/M- for memory controls, `A` for last answer, `S` for square root.
- Memory keys: MC, MR, M+, M- operate on the current result; memory persists until cleared and is saved locally.
- History tape: last five calculations are captured with expression and result; history persists locally.
- Input helpers: sign toggle (±), parentheses, power (^), square root (√), percent (%), per-number decimal guard, operator replacement, incomplete-expression and parentheses guards, live result preview when valid.
- Accessibility: `role="application"` wrapper, polite live regions for expression/result/preview and copy status, screen-reader help text, focus outlines, ARIA labels on controls, copy confirmation.
- Theming: default dark look plus high-contrast toggle (persisted).
- Copy result: one-click copy with status feedback.

## Quick start
```bash
npm install
npm run dev
```
Visit `http://localhost:5173` and interact via keyboard or mouse.

## Screenshot

![Calculator Screenshot](./docs/screenshot.png)

## Keyboard shortcuts
- Numbers / `+ - * / ^ . ( )` : type directly
- `Enter` or `=` : evaluate
- `Backspace` : delete last character
- `Escape` or `Delete` : clear all
- `Alt + C` : memory clear (MC)
- `Alt + R` : memory recall (MR)
- `Alt + =` : memory add (M+)
- `Alt + -` : memory subtract (M-)
- `±` button: toggle sign of the last number
- `A` : insert last answer
- `S` : square root current number
- `%` : convert current number to percent

## Memory behavior
- M+ / M- operate on the current result value.
- MR inserts the stored number at the end of the expression (or replaces `0`).
- MC clears stored memory without touching the expression/result.

## Scripts
- `npm run dev` — run dev server
- `npm test` — run Vitest
- `npm run build` — production build
- `npm run preview` — preview a production build locally

## Testing
Vitest + Testing Library cover calculation, clearing, keyboard flows, memory recall, and sign toggling. Add more cases as you extend advanced math or UI behaviors.

## Accessibility & UX notes
- Visible focus states on all interactive elements; calculator gains focus on load.
- Expression/result are announced via polite live regions; copy action provides confirmation.
- High-contrast mode available via header toggle.
- Responsive layout adapts to mobile with larger hit targets.

## Tech stack
- React 18, mathjs, Vite tooling
- CSS variables for theming and responsive grid layout

## Future ideas
- Persist history/memory across sessions
- Add advanced functions (sqrt, power), tape export, or programmable shortcuts
- Add auditory feedback cues for error states

## License

MIT License

Copyright (c) 2025 Tim Finch

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

© 2025 FinchWorks Studio — Crafted with care.
