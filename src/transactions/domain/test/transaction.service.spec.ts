import { TransactionService } from '../transaction.service';
import { TransactionMemory } from '../transaction.memory';
import { TransactionMethod, TransactionType } from '../transaction.enum';

describe('TransactionsService', () => {
  let service: TransactionService;
  let memory: TransactionMemory;

  beforeEach(() => {
    memory = new TransactionMemory();
    service = new TransactionService(memory);
  });

  it('should list transactions', () => {
    service.create({
      id: '1',
      amount: 500,
      description: 'Test',
      category: 'Test',
      method: TransactionMethod.CASH,
      type: TransactionType.INCOME,
      date: new Date('2026-09-02T00:00:00.000Z'),
    });
    expect(service.findAll()).toEqual([
      {
        id: '1',
        amount: 500,
        description: 'Test',
        category: 'Test',
        method: TransactionMethod.CASH,
        type: TransactionType.INCOME,
        date: new Date('2026-09-02T00:00:00.000Z'),
      },
    ]);
  });

  it('should save a transaction', () => {
    const result = service.create({
      id: '2',
      amount: 1000,
      description: 'Test',
      category: 'Test',
      method: TransactionMethod.CASH,
      type: TransactionType.INCOME,
      date: new Date('2026-09-02T00:00:00.000Z'),
    });

    expect(result).toEqual({
      id: '2',
      amount: 1000,
      description: 'Test',
      category: 'Test',
      method: TransactionMethod.CASH,
      type: TransactionType.INCOME,
      date: new Date('2026-09-02T00:00:00.000Z'),
    });
  });

  it('should find a transaction by id', () => {
    service.create({
      id: '3',
      amount: 800,
      description: 'Test',
      category: 'Test',
      method: TransactionMethod.CASH,
      type: TransactionType.INCOME,
      date: new Date('2026-09-02T00:00:00.000Z'),
    });

    expect(service.findById('3')).toEqual({
      id: '3',
      amount: 800,
      description: 'Test',
      category: 'Test',
      method: TransactionMethod.CASH,
      type: TransactionType.INCOME,
      date: new Date('2026-09-02T00:00:00.000Z'),
    });
  });

  it('should throw when the transaction does not exist', () => {
    expect(() => service.findById('99')).toThrow(
      'Transaction with id 99 not found',
    );
  });

  it('should report zero income, expense and balance when the list is empty', () => {
    expect(service.resume()).toEqual({ income: 0, expense: 0, balance: 0 });
  });

  it('should subtract an expense from income', () => {
    const date = new Date('2026-09-02T00:00:00.000Z');

    service.create({
      id: '4',
      amount: 100000,
      description: 'Salario',
      category: 'Salario',
      method: TransactionMethod.TRANSFER,
      type: TransactionType.INCOME,
      date,
    });
    service.create({
      id: '5',
      amount: 18000,
      description: 'Almuerzo',
      category: 'Alimentación',
      method: TransactionMethod.CASH,
      type: TransactionType.EXPENSE,
      date,
    });

    expect(service.resume()).toEqual({
      income: 100000,
      expense: 18000,
      balance: 82000,
    });
    expect(service.findById('5').amount).toBe(18000);
  });
});
