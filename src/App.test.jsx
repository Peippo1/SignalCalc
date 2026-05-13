import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from './App';

const press = async (label) => {
  const button = await screen.findByRole('button', { name: `press ${label}` });
  await userEvent.click(button);
};

beforeEach(() => {
  Object.assign(navigator, {
    clipboard: {
      writeText: vi.fn().mockResolvedValue(),
    },
  });
  window.localStorage.clear();
});

test('calculates an expression, shows result, and logs history', async () => {
  render(<App />);

  await press('7');
  await press('+');
  await press('3');
  await press('=');

  expect(screen.getByLabelText(/result/i)).toHaveTextContent('10');
  expect(screen.getByText(/7\+3/)).toBeInTheDocument();
  expect(screen.getByText('= 10')).toBeInTheDocument();
});

test('clears the display', async () => {
  render(<App />);

  await press('9');
  await press('C');

  expect(screen.getByLabelText(/result/i)).toHaveTextContent('0');
  expect(screen.getByLabelText(/expression/i)).toHaveTextContent('0');
});

test('supports keyboard input and backspace', async () => {
  render(<App />);

  const container = screen.getByRole('application');

  fireEvent.keyDown(container, { key: '5' });
  fireEvent.keyDown(container, { key: '.' });
  fireEvent.keyDown(container, { key: '5' });
  fireEvent.keyDown(container, { key: '+' });
  fireEvent.keyDown(container, { key: '2' });
  fireEvent.keyDown(container, { key: 'Enter' });
  expect(screen.getByLabelText(/result/i)).toHaveTextContent('7.5');

  fireEvent.keyDown(container, { key: 'Backspace' });
  fireEvent.keyDown(container, { key: 'Backspace' });
  fireEvent.keyDown(container, { key: 'Escape' });

  expect(screen.getByLabelText(/result/i)).toHaveTextContent('0');
});

test('memory keys store and recall values', async () => {
  render(<App />);

  await press('2');
  await press('+');
  await press('3');
  await press('=');
  await press('M+');
  await press('C');
  await press('MR');

  expect(screen.getByLabelText(/expression/i)).toHaveTextContent('5');
});

test('toggle sign updates the last number', async () => {
  render(<App />);

  await press('5');
  await press('±');

  expect(screen.getByLabelText(/expression/i)).toHaveTextContent('-5');
});

test('supports square root and percent', async () => {
  render(<App />);

  await press('9');
  await press('√');
  await press('=');
  expect(screen.getByLabelText(/result/i)).toHaveTextContent('3');

  await press('5');
  await press('0');
  await press('%');
  await press('=');
  expect(screen.getByLabelText(/result/i)).toHaveTextContent('0.5');
});

test('inserts last answer with Ans key', async () => {
  render(<App />);

  await press('3');
  await press('+');
  await press('2');
  await press('=');

  await press('Ans');
  await press('+');
  await press('5');
  await press('=');

  expect(screen.getByLabelText(/result/i)).toHaveTextContent('10');
});

test('ignores unsafe expressions restored from storage', () => {
  window.localStorage.setItem('calc-expression', 'import("fs")');
  window.localStorage.setItem('calc-result', '__proto__');

  render(<App />);

  expect(screen.getByLabelText(/expression/i)).toHaveTextContent('0');
  expect(screen.getByLabelText(/result/i)).toHaveTextContent('0');
});

test('filters unsafe history restored from storage', () => {
  window.localStorage.setItem('calc-history', JSON.stringify([
    { expression: '2+2', result: '4' },
    { expression: 'constructor.constructor("alert(1)")()', result: '0' },
  ]));

  render(<App />);

  expect(screen.getByText(/2\+2/)).toBeInTheDocument();
  expect(screen.queryByText(/constructor/)).not.toBeInTheDocument();
});

test('does not store non-finite results', async () => {
  render(<App />);

  await press('1');
  await press('/');
  await press('0');
  await press('=');

  expect(screen.getByRole('alert')).toHaveTextContent('Could not evaluate');
  expect(screen.getByLabelText(/result/i)).toHaveTextContent('0');
  expect(screen.queryByText(/1\/0/)).not.toBeInTheDocument();
});

test('clearing after an evaluation resets the next expression', async () => {
  render(<App />);

  await press('2');
  await press('+');
  await press('3');
  await press('=');
  await press('C');
  await press('4');

  expect(screen.getByLabelText(/expression/i)).toHaveTextContent('4');
});
