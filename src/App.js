import { useEffect, useMemo, useRef, useState } from 'react';
import { evaluate } from 'mathjs';
import './App.css';

const OPERATORS = new Set(['+', '-', '*', '/']);
const MEMORY_KEYS = new Set(['MC', 'MR', 'M+', 'M-']);
const BUTTONS = [
  'MC',
  'MR',
  'M+',
  'M-',
  'C',
  '⌫',
  '(',
  ')',
  '7',
  '8',
  '9',
  '/',
  '4',
  '5',
  '6',
  '*',
  '1',
  '2',
  '3',
  '-',
  '±',
  '0',
  '.',
  '+',
  '=',
];

const getLastNumberBounds = (value) => {
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

const App = () => {
  const [expression, setExpression] = useState('0');
  const [result, setResult] = useState('0');
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [memory, setMemory] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [copyStatus, setCopyStatus] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    wrapperRef.current?.focus();
  }, []);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  const displayExpression = useMemo(() => (error ? 'Error' : expression), [expression, error]);

  const lastNumberHasDecimal = (value) => {
    const { start, end } = getLastNumberBounds(value);
    const lastNumber = value.slice(start, end);
    return lastNumber.includes('.');
  };

  const handleMemory = (type, currentResult) => {
    if (type === 'MC') {
      setMemory(null);
      return;
    }
    if (type === 'MR') {
      if (memory === null) return;
      setExpression((prev) => (prev === '0' ? String(memory) : prev + String(memory)));
      return;
    }

    const numeric = Number(currentResult);
    if (Number.isNaN(numeric)) return;

    if (type === 'M+') setMemory((prev) => (prev === null ? numeric : prev + numeric));
    if (type === 'M-') setMemory((prev) => (prev === null ? -numeric : prev - numeric));
  };

  const handleInput = (value) => {
    setError('');
    setCopyStatus('');

    if (MEMORY_KEYS.has(value)) {
      handleMemory(value, result);
      return;
    }

    if (value === 'theme') {
      setTheme((prev) => (prev === 'dark' ? 'contrast' : 'dark'));
      return;
    }

    if (value === 'C') {
      setExpression('0');
      setResult('0');
      return;
    }

    if (value === '⌫' || value === 'BACKSPACE') {
      setExpression((prev) => {
        if (prev.length <= 1) return '0';
        return prev.slice(0, -1);
      });
      return;
    }

    if (value === '=') {
      if (!expression || OPERATORS.has(expression.at(-1)) || expression.at(-1) === '(') {
        setError('Incomplete expression');
        return;
      }

      try {
        const evaluated = evaluate(expression);
        const evaluatedStr = String(evaluated);
        setResult(evaluatedStr);
        setExpression(evaluatedStr);
        setHistory((prev) => [{ expression, result: evaluatedStr }, ...prev].slice(0, 5));
      } catch (err) {
        setError('Could not evaluate');
      }
      return;
    }

    if (value === '±') {
      setExpression((prev) => {
        if (!prev) return prev;
        const { start, end } = getLastNumberBounds(prev);
        const currentNumber = prev.slice(start, end);
        if (!currentNumber) return prev;
        const toggled = currentNumber.startsWith('-') ? currentNumber.slice(1) : `-${currentNumber}`;
        const next = `${prev.slice(0, start)}${toggled}${prev.slice(end)}`;
        return next || '0';
      });
      return;
    }

    if (value === '(') {
      setExpression((prev) => (prev === '0' ? '(' : prev + '('));
      return;
    }

    if (value === ')') {
      setExpression((prev) => {
        const open = (prev.match(/\(/g) || []).length;
        const close = (prev.match(/\)/g) || []).length;
        if (open <= close) return prev;
        if (OPERATORS.has(prev.at(-1)) || prev.at(-1) === '(') return prev;
        return prev + ')';
      });
      return;
    }

    setExpression((prev) => {
      const previous = prev === '0' && !OPERATORS.has(value) ? '' : prev;
      const lastChar = previous.at(-1);

      if (value === '.' && lastNumberHasDecimal(previous)) {
        return previous;
      }

      if (OPERATORS.has(value)) {
        if (!previous || previous === '(') return previous;
        if (OPERATORS.has(lastChar)) {
          return previous.slice(0, -1) + value;
        }
      }

      return previous + value;
    });
  };

  const handleKeyDown = (event) => {
    const key = event.key;
    const lower = key.toLowerCase();

    if (event.altKey) {
      if (lower === 'c') handleInput('MC');
      if (lower === 'r') handleInput('MR');
      if (key === '+') handleInput('M+');
      if (key === '-') handleInput('M-');
      return;
    }

    if (/[0-9]/.test(key) || OPERATORS.has(key) || key === '.' || key === '(' || key === ')') {
      event.preventDefault();
      handleInput(key);
      return;
    }

    if (key === 'Enter' || key === '=') {
      event.preventDefault();
      handleInput('=');
      return;
    }

    if (key === 'Backspace') {
      event.preventDefault();
      handleInput('BACKSPACE');
      return;
    }

    if (key === 'Escape' || key === 'Esc') {
      event.preventDefault();
      handleInput('C');
      return;
    }

    if (key === 'Delete') {
      event.preventDefault();
      handleInput('C');
    }
  };

  const copyResult = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(result);
      } else {
        const temp = document.createElement('textarea');
        temp.value = result;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      }
      setCopyStatus('Result copied');
    } catch (err) {
      setCopyStatus('Copy failed');
    }
  };

  return (
    <main className="page">
      <header className="header">
        <div>
          <p className="eyebrow">Accessible Calculator</p>
          <h1>Signal Calculator</h1>
          <p className="tagline">Keyboard first, screen-reader friendly, with history and memory keys.</p>
        </div>
        <div className="toggles">
          <button
            type="button"
            className="ghost"
            aria-pressed={theme === 'contrast'}
            onClick={() => handleInput('theme')}
          >
            {theme === 'contrast' ? 'Default Theme' : 'High Contrast'}
          </button>
        </div>
      </header>

      <div className="layout">
        <section
          className="calculator-wrapper"
          tabIndex={0}
          ref={wrapperRef}
          onKeyDown={handleKeyDown}
          aria-describedby="calculator-help"
          role="application"
        >
          <p id="calculator-help" className="sr-only">
            Use number keys or click buttons. Enter to evaluate, escape to clear, backspace to delete, alt+C to clear
            memory, alt+R to recall, alt+= for M plus, alt+- for M minus.
          </p>

          <div className="display">
            <div className="expression" aria-label="expression" role="status">
              {displayExpression}
            </div>
            <div className="result-row">
              <div className="result" aria-live="polite" aria-label="result" role="status">
                {result}
              </div>
              <div className="display-actions">
                <button type="button" className="ghost" onClick={copyResult}>
                  Copy
                </button>
                <span className="status" aria-live="polite">
                  {copyStatus}
                </span>
              </div>
            </div>
            {error ? <div className="error" role="alert">{error}</div> : null}
          </div>

          <div className="buttons-group" role="group" aria-label="calculator keys">
            {BUTTONS.map((label) => (
              <CalcButton key={label} value={label} onPress={handleInput} />
            ))}
          </div>
        </section>

        <aside className="panel history" aria-label="recent history">
          <div className="panel-head">
            <h2>History</h2>
            <p className="muted">Last 5 calculations</p>
          </div>
          {history.length === 0 ? (
            <p className="muted">Nothing yet.</p>
          ) : (
            <ol>
              {history.map((item, index) => (
                <li key={`${item.expression}-${index}`}>
                  <div className="history-expression">{item.expression}</div>
                  <div className="history-result">= {item.result}</div>
                </li>
              ))}
            </ol>
          )}
        </aside>

        <aside className="panel help" aria-label="memory and shortcuts">
          <div className="panel-head">
            <h2>Shortcuts</h2>
            <p className="muted">Keyboard & memory</p>
          </div>
          <ul>
            <li><span>Enter</span> evaluate</li>
            <li><span>Escape/Delete</span> clear</li>
            <li><span>Backspace</span> delete last</li>
            <li><span>Alt + C / R</span> MC / MR</li>
            <li><span>Alt + = / -</span> M+ / M-</li>
            <li><span>±</span> toggle sign of last number</li>
          </ul>
          <p className="muted">Use () for grouping; decimals are limited per number.</p>
        </aside>
      </div>
    </main>
  );
};

const CalcButton = ({ value, onPress }) => {
  const classes = [
    OPERATORS.has(value) ? 'operator' : '',
    value === '=' ? 'equals' : '',
    value === 'C' ? 'control' : '',
    MEMORY_KEYS.has(value) ? 'memory' : '',
    value === '⌫' ? 'control' : '',
    value === '±' ? 'control' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      onClick={() => onPress(value)}
      aria-label={`press ${value}`}
      className={classes}
    >
      {value}
    </button>
  );
};

export default App;
