import { describe, expect, test } from 'vitest';
import {
  evaluateCalculatorExpression,
  getLastNumberBounds,
  isSafeExpression,
  normalizeStoredHistory,
  normalizeStoredMemory,
  normalizeStoredTheme,
  safeEvaluate,
} from './calculatorCore';

describe('calculator core', () => {
  test('evaluates allowed calculator expressions', () => {
    expect(safeEvaluate('sqrt(9)+2^3')).toBe(11);
    expect(evaluateCalculatorExpression('sqrt(9)+2^3')).toBe('11');
  });

  test('rejects expressions outside the calculator grammar', () => {
    expect(isSafeExpression('constructor.constructor("alert(1)")()')).toBe(false);
    expect(() => safeEvaluate('import("fs")')).toThrow('Unsafe expression');
  });

  test('rejects non-finite and non-real results', () => {
    expect(() => evaluateCalculatorExpression('1/0')).toThrow('Result is not finite');
    expect(() => evaluateCalculatorExpression('sqrt(-1)')).toThrow('Result is not finite');
  });

  test('normalizes stored state from untrusted browser storage', () => {
    expect(normalizeStoredTheme('contrast')).toBe('contrast');
    expect(normalizeStoredTheme('solarized')).toBe('dark');
    expect(normalizeStoredMemory('4.5')).toBe(4.5);
    expect(normalizeStoredMemory('NaN')).toBeNull();
  });

  test('filters unsafe stored history entries', () => {
    expect(normalizeStoredHistory([
      { expression: '2+2', result: '4' },
      { expression: '__proto__', result: '0' },
    ])).toEqual([{ expression: '2+2', result: '4' }]);
  });

  test('finds the active number range', () => {
    expect(getLastNumberBounds('12+-4.5')).toEqual({ start: 3, end: 7 });
  });
});
