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

const createParser = (input) => {
  const expression = input.replace(/\s/g, '');
  let index = 0;

  const peek = () => expression[index];
  const consume = (token) => {
    if (expression[index] !== token) return false;
    index += 1;
    return true;
  };

  const parseNumber = () => {
    const start = index;
    let hasDigit = false;
    let hasDecimal = false;

    while (index < expression.length) {
      const char = expression[index];
      if (/[0-9]/.test(char)) {
        hasDigit = true;
        index += 1;
      } else if (char === '.' && !hasDecimal) {
        hasDecimal = true;
        index += 1;
      } else {
        break;
      }
    }

    if (!hasDigit) {
      throw new Error('Expected number');
    }

    return Number(expression.slice(start, index));
  };

  const parseExpression = () => {
    let value = parseTerm();

    while (index < expression.length) {
      if (consume('+')) {
        value += parseTerm();
      } else if (consume('-')) {
        value -= parseTerm();
      } else {
        break;
      }
    }

    return value;
  };

  const parseTerm = () => {
    let value = parsePower();

    while (index < expression.length) {
      const next = peek();
      if (consume('*')) {
        value *= parsePower();
      } else if (consume('/')) {
        value /= parsePower();
      } else if (next === '(' || expression.startsWith('sqrt', index)) {
        value *= parsePower();
      } else {
        break;
      }
    }

    return value;
  };

  const parsePower = () => {
    const base = parsePostfix();

    if (consume('^')) {
      return base ** parsePower();
    }

    return base;
  };

  const parsePostfix = () => {
    let value = parseUnary();

    while (consume('%')) {
      value /= 100;
    }

    return value;
  };

  const parseUnary = () => {
    if (consume('+')) return parseUnary();
    if (consume('-')) return -parseUnary();
    return parsePrimary();
  };

  const parsePrimary = () => {
    if (expression.startsWith('sqrt', index)) {
      index += 4;
      if (!consume('(')) throw new Error('Expected opening parenthesis');
      const value = parseExpression();
      if (!consume(')')) throw new Error('Expected closing parenthesis');
      if (value < 0) throw new Error('Square root requires a non-negative value');
      return Math.sqrt(value);
    }

    if (consume('(')) {
      const value = parseExpression();
      if (!consume(')')) throw new Error('Expected closing parenthesis');
      return value;
    }

    return parseNumber();
  };

  return {
    parse() {
      const value = parseExpression();
      if (index !== expression.length) {
        throw new Error('Unexpected token');
      }
      return value;
    },
  };
};

export const safeEvaluate = (value) => {
  if (!isSafeExpression(value)) {
    throw new Error('Unsafe expression');
  }

  return createParser(value).parse();
};

export const evaluateCalculatorExpression = (value) => {
  const evaluated = safeEvaluate(value);
  const numeric = typeof evaluated === 'number' ? evaluated : Number(evaluated);

  if (!Number.isFinite(numeric)) {
    throw new Error('Result is not finite');
  }

  const result = Object.is(numeric, -0) ? '0' : String(numeric);
  if (!isSafeExpression(result)) {
    throw new Error('Result is outside calculator range');
  }

  return result;
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
