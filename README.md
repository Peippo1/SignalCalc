# Signal Calculator

Accessible, keyboard-first calculator built with React 18. Includes memory keys, history tape, sign toggle, parentheses/powers/square root/percent support, copy-to-clipboard, high-contrast theme, and local persistence.

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
npm start
```
Visit `http://localhost:3000` and interact via keyboard or mouse.

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
- `npm start` — run dev server
- `npm test` — run tests once (`CI=true npm test -- --watch=false`)
- `npm run build` — production build

## Testing
Jest + Testing Library cover calculation, clearing, keyboard flows, memory recall, and sign toggling. Add more cases as you extend advanced math or UI behaviors.

## Accessibility & UX notes
- Visible focus states on all interactive elements; calculator gains focus on load.
- Expression/result are announced via polite live regions; copy action provides confirmation.
- High-contrast mode available via header toggle.
- Responsive layout adapts to mobile with larger hit targets.

## Tech stack
- React 18, mathjs, Create React App tooling
- CSS variables for theming and responsive grid layout

## Future ideas
- Persist history/memory across sessions
- Add advanced functions (sqrt, power), tape export, or programmable shortcuts
- Add auditory feedback cues for error states
