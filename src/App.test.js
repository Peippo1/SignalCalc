import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const press = async (label) => {
  const button = await screen.findByRole('button', { name: `press ${label}` });
  await userEvent.click(button);
};

beforeEach(() => {
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn().mockResolvedValue(),
    },
  });
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
