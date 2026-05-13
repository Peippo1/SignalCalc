import { evaluate } from 'mathjs';

export const OPERATORS = new Set(['+', '-', '*', '/', '^']);
export const MEMORY_KEYS = new Set(['MC', 'MR', 'M+', 'M-']);
export const MAX_EXPRESSION_LENGTH = 120;

export const isSafeExpression = (value) => {
  if (typeof value !== 'string') return false;
  const expression = value.replace(/\s/g, '');
  if (!expression || expression.length > MAX_EXPRESSION_LENGTH) return false;

  for (let index = 0; index < expression.length;) {
    const char = expression[index];

    if (/[0-9.]/.test(char) || OPERATORS.has(char) || char === '(' || char === ')' || char === '%') {
      index += 1;
      continue;
    }

    if (expression.startsWith('sqrt', index)) {
      index += 4;
      continue;
    }

    return false;
  }

  return true;
};

export const normalizeStoredExpression = (value) => (isSafeExpression(value) ? value : '0');

export const normalizeStoredTheme = (value) => (value === 'dark' || value === 'contrast' ? value : 'dark');

export const normalizeStoredMemory = (value) => {
  if (value === null || value === '') return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

export const normalizeStoredHistory = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => (
      item
      && isSafeExpression(item.expression)
      && isSafeExpression(item.result)
    ))
    .slice(0, 5);
};

export const safeEvaluate = (value) => {
  if (!isSafeExpression(value)) {
    throw new Error('Unsafe expression');
  }

  return evaluate(value);
};

export const getLastNumberBounds = (value) => {
  let end = value.length;
  let start = end;
  while (start > 0 && /[0-9.]/.test(value[start - 1])) {
    start -= 1;
  }
  if (start > 0 && value[start - 1] === '-' && (start - 1 === 0 || OPERATORS.has(value[start - 2]) || value[start - 2] === '(')) {
    start -= 1;
  }
  return { start, end };
};
