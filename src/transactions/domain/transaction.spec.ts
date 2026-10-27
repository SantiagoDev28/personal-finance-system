import { Transaction } from './transaction';
import { TransactionMethod, TransactionType } from './transaction.enum';

it('creates an expense with a positive amount', () => {
  const transaction = Transaction.create({
    id: 'mov-1',
    amount: 18000,
    description: 'Almuerzo',
    category: 'Alimentación',
    method: TransactionMethod.CASH,
    type: TransactionType.EXPENSE,
    date: new Date('2026-09-02T00:00:00.000Z'),
  });
  expect(transaction.type).toBe(TransactionType.EXPENSE);
  expect(transaction.amount).toBe(18000);
  expect(transaction.method).toBe(TransactionMethod.CASH);
  expect(transaction.date).toEqual(new Date('2026-09-02T00:00:00.000Z'));
});

it('creates an income with a positive amount', () => {
  const transaction = Transaction.create({
    id: 'mov-2',
    amount: 100000,
    description: 'Salario',
    category: 'Salario',
    method: TransactionMethod.TRANSFER,
    type: TransactionType.INCOME,
    date: new Date('2026-09-02T00:00:00.000Z'),
  });
  expect(transaction.type).toBe(TransactionType.INCOME);
  expect(transaction.amount).toBe(100000);
  expect(transaction.method).toBe(TransactionMethod.TRANSFER);
});

it('throws an error if the amount is not an integer', () => {
  expect(() =>
    Transaction.create({
      id: 'mov-3',
      amount: 100000.5,
      description: 'Salario',
      category: 'Salario',
      method: TransactionMethod.TRANSFER,
      type: TransactionType.INCOME,
      date: new Date('2026-09-02T00:00:00.000Z'),
    }),
  ).toThrow('Amount must be an integer');
});

it('throws an error if the date is not a valid date', () => {
  expect(() =>
    Transaction.create({
      id: 'mov-4',
      amount: 100000,
      description: 'Salario',
      category: 'Salario',
      method: TransactionMethod.TRANSFER,
      type: TransactionType.INCOME,
      date: new Date('invalid-date'),
    }),
  ).toThrow('Date must be a valid date');
});

it('throws an error if amount is not a positive integer', () => {
  expect(() =>
    Transaction.create({
      id: 'mov-5',
      amount: 0,
      description: 'Salario',
      category: 'Salario',
      method: TransactionMethod.TRANSFER,
      type: TransactionType.INCOME,
      date: new Date('2026-09-02T00:00:00.000Z'),
    }),
  ).toThrow('Amount must be greater than 0');
});
