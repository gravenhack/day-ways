import { CalculatorState, Operator } from '../types';

export const initialState: CalculatorState = {
  displayValue: '0',
  previousValue: null,
  operator: null,
  waitingForOperand: false,
};

export const calculate = (
  left: string,
  right: string,
  op: Operator
): string => {
  const l = parseFloat(left);
  const r = parseFloat(right);
  
  if (isNaN(l) || isNaN(r)) return 'Error';

  let result = 0;
  switch (op) {
    case '+': result = l + r; break;
    case '-': result = l - r; break;
    case '*': result = l * r; break;
    case '/': 
        if (r === 0) return 'Error';
        result = l / r; 
        break;
    default: return right;
  }

  // Handle floating point precision issues (e.g. 0.1 + 0.2)
  const precision = 10000000000;
  return String(Math.round(result * precision) / precision);
};

export const formatDisplay = (value: string): string => {
  if (value === 'Error') return 'Error';
  // Add commas for thousands
  const parts = value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join('.');
};
