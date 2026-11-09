import { TransactionService } from '../../application/transaction.service';
import { TransactionMemory } from '../../infrastructure/persistence/transaction.memory';
import {
  TransactionCategory,
  TransactionMethod,
  TransactionType,
} from '../enums/transaction.enum';

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
      category: TransactionCategory.OTHER,
      method: TransactionMethod.CASH,
      type: TransactionType.INCOME,
      date: new Date('2026-09-02T00:00:00.000Z'),
    });
    expect(service.findAll({})).toEqual([
      {
        id: '1',
        amount: 500,
        description: 'Test',
        category: TransactionCategory.OTHER,
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
      category: TransactionCategory.OTHER,
      method: TransactionMethod.CASH,
      type: TransactionType.INCOME,
      date: new Date('2026-09-02T00:00:00.000Z'),
    });

    expect(result).toEqual({
      id: '2',
      amount: 1000,
      description: 'Test',
      category: TransactionCategory.OTHER,
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
      category: TransactionCategory.OTHER,
      method: TransactionMethod.CASH,
      type: TransactionType.INCOME,
      date: new Date('2026-09-02T00:00:00.000Z'),
    });

    expect(service.findById('3')).toEqual({
      id: '3',
      amount: 800,
      description: 'Test',
      category: TransactionCategory.OTHER,
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
      category: TransactionCategory.OTHER,
      method: TransactionMethod.TRANSFER,
      type: TransactionType.INCOME,
      date,
    });
    service.create({
      id: '5',
      amount: 18000,
      description: 'Almuerzo',
      category: TransactionCategory.FOOD,
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

  it('should update an existing transaction', () => {
    const originalDate = new Date('2026-09-02T00:00:00.000Z');
    const updatedDate = '2026-10-03T00:00:00.000Z';

    service.create({
      id: '6',
      amount: 18000,
      description: 'Almuerzo',
      category: TransactionCategory.FOOD,
      method: TransactionMethod.CASH,
      type: TransactionType.EXPENSE,
      date: originalDate,
    });
    service.create({
      id: '7',
      amount: 100000,
      description: 'Salario',
      category: TransactionCategory.OTHER,
      method: TransactionMethod.TRANSFER,
      type: TransactionType.INCOME,
      date: originalDate,
    });

    const result = service.update('6', {
      amount: 22000,
      description: 'Cena',
      category: TransactionCategory.ENTERTAINMENT,
      method: TransactionMethod.DEBIT_CARD,
      type: TransactionType.EXPENSE,
      date: updatedDate,
    });

    expect(result).toEqual({
      id: '6',
      amount: 22000,
      description: 'Cena',
      category: TransactionCategory.ENTERTAINMENT,
      method: TransactionMethod.DEBIT_CARD,
      type: TransactionType.EXPENSE,
      date: new Date(updatedDate),
    });
    expect(service.findById('6')).toEqual(result);
    expect(service.findAll({})).toHaveLength(2);
    expect(service.findById('7')).toEqual({
      id: '7',
      amount: 100000,
      description: 'Salario',
      category: TransactionCategory.OTHER,
      method: TransactionMethod.TRANSFER,
      type: TransactionType.INCOME,
      date: originalDate,
    });
    expect(service.resume()).toEqual({
      income: 100000,
      expense: 22000,
      balance: 78000,
    });
  });

  it('should update only the fields sent in the body', () => {
    const date = new Date('2026-09-02T00:00:00.000Z');

    service.create({
      id: '8',
      amount: 18000,
      description: 'Almuerzo',
      category: TransactionCategory.FOOD,
      method: TransactionMethod.CASH,
      type: TransactionType.EXPENSE,
      date,
    });

    const result = service.update('8', { amount: 22000 });

    expect(result).toEqual({
      id: '8',
      amount: 22000,
      description: 'Almuerzo',
      category: TransactionCategory.FOOD,
      method: TransactionMethod.CASH,
      type: TransactionType.EXPENSE,
      date,
    });
    expect(service.resume()).toEqual({
      income: 0,
      expense: 22000,
      balance: -22000,
    });
  });

  it('should throw when updating a transaction that does not exist', () => {
    expect(() => service.update('99', { amount: 1000 })).toThrow(
      'Transaction with id 99 not found',
    );
  });

  it('should keep the stored transaction when the updated amount is not greater than 0', () => {
    const date = new Date('2026-09-02T00:00:00.000Z');

    service.create({
      id: '9',
      amount: 18000,
      description: 'Almuerzo',
      category: TransactionCategory.FOOD,
      method: TransactionMethod.CASH,
      type: TransactionType.EXPENSE,
      date,
    });

    expect(() =>
      service.update('9', {
        amount: 0,
        description: 'Cena',
        category: TransactionCategory.ENTERTAINMENT,
        method: TransactionMethod.DEBIT_CARD,
      }),
    ).toThrow('Amount must be greater than 0');

    expect(service.findById('9')).toEqual({
      id: '9',
      amount: 18000,
      description: 'Almuerzo',
      category: TransactionCategory.FOOD,
      method: TransactionMethod.CASH,
      type: TransactionType.EXPENSE,
      date,
    });
  });

  it('should delete an existing transaction', () => {
    const date = new Date('2026-09-02T00:00:00.000Z');

    service.create({
      id: '10',
      amount: 100000,
      description: 'Salario',
      category: TransactionCategory.OTHER,
      method: TransactionMethod.TRANSFER,
      type: TransactionType.INCOME,
      date,
    });
    service.create({
      id: '11',
      amount: 18000,
      description: 'Almuerzo',
      category: TransactionCategory.FOOD,
      method: TransactionMethod.CASH,
      type: TransactionType.EXPENSE,
      date,
    });

    expect(service.delete('11')).toEqual({
      message: 'Transaction with id 11 deleted successfully',
    });
    expect(service.findAll({})).toEqual([
      {
        id: '10',
        amount: 100000,
        description: 'Salario',
        category: TransactionCategory.OTHER,
        method: TransactionMethod.TRANSFER,
        type: TransactionType.INCOME,
        date,
      },
    ]);
    expect(() => service.findById('11')).toThrow(
      'Transaction with id 11 not found',
    );
    expect(service.resume()).toEqual({
      income: 100000,
      expense: 0,
      balance: 100000,
    });
  });

  it('should throw when deleting a transaction that does not exist', () => {
    expect(() => service.delete('99')).toThrow(
      'Transaction with id 99 not found',
    );
  });

  it('should include a stored instant from the start of startDate through the last second of endDate', () => {
    // startDate is that calendar date at 00:00:00.000 UTC.
    // endDate as YYYY-MM-DD includes the day through its last second, 23:59:59.999 UTC.
    seedOctoberRange(service);
    const filter = { startDate: '2026-10-01', endDate: '2026-10-03' };

    expect(service.findAll(filter).map((transaction) => transaction.id)).toEqual([
      'start',
      'middle',
      'end-afternoon',
      'end-last',
    ]);
    expect(service.resume(filter)).toEqual({
      income: 13000,
      expense: 6000,
      balance: 7000,
    });
    expect(service.resume(filter)).toEqual(
      memory.calculateResume(service.findAll(filter)),
    );
    expect(service.resume()).toEqual({
      income: 13000,
      expense: 12000,
      balance: 1000,
    });
  });

  it('should keep an endDate that includes a time at that instant', () => {
    seedOctoberRange(service);
    const filter = {
      startDate: '2026-10-01',
      endDate: '2026-10-03T12:00:00.000Z',
    };

    expect(service.findAll(filter).map((transaction) => transaction.id)).toEqual([
      'start',
      'middle',
    ]);
    expect(service.resume(filter)).toEqual({
      income: 10000,
      expense: 4000,
      balance: 6000,
    });
  });

  it('should return an empty list and a zero resume when the range has no transactions', () => {
    seedOctoberRange(service);
    const filter = { startDate: '2026-11-01', endDate: '2026-11-02' };

    expect(service.findAll(filter)).toEqual([]);
    expect(service.resume(filter)).toEqual({
      income: 0,
      expense: 0,
      balance: 0,
    });
    expect(service.resume()).toEqual(
      memory.calculateResume(service.findAll({})),
    );
  });

  it('should filter the resume by type, category and date range together', () => {
    seedOctoberRange(service);
    const filter = {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.FOOD,
      startDate: '2026-10-01',
      endDate: '2026-10-03',
    };

    expect(service.findAll(filter).map((transaction) => transaction.id)).toEqual([
      'middle',
    ]);
    expect(service.resume(filter)).toEqual({
      income: 0,
      expense: 4000,
      balance: -4000,
    });
    expect(service.resume(filter)).toEqual(
      memory.calculateResume(service.findAll(filter)),
    );
  });
});

function seedOctoberRange(service: TransactionService) {
  const rows = [
    {
      id: 'before',
      amount: 1000,
      type: TransactionType.EXPENSE,
      category: TransactionCategory.FOOD,
      date: '2026-09-30T23:59:59.999Z',
    },
    {
      id: 'start',
      amount: 10000,
      type: TransactionType.INCOME,
      category: TransactionCategory.OTHER,
      date: '2026-10-01T00:00:00.000Z',
    },
    {
      id: 'middle',
      amount: 4000,
      type: TransactionType.EXPENSE,
      category: TransactionCategory.FOOD,
      date: '2026-10-02T15:00:00.000Z',
    },
    {
      id: 'end-afternoon',
      amount: 2000,
      type: TransactionType.EXPENSE,
      category: TransactionCategory.TRANSPORTATION,
      date: '2026-10-03T15:00:00.000Z',
    },
    {
      id: 'end-last',
      amount: 3000,
      type: TransactionType.INCOME,
      category: TransactionCategory.FOOD,
      date: '2026-10-03T23:59:59.999Z',
    },
    {
      id: 'after',
      amount: 5000,
      type: TransactionType.EXPENSE,
      category: TransactionCategory.FOOD,
      date: '2026-10-04T00:00:00.000Z',
    },
  ];

  for (const row of rows) {
    service.create({
      id: row.id,
      amount: row.amount,
      description: row.id,
      category: row.category,
      method: TransactionMethod.CASH,
      type: row.type,
      date: new Date(row.date),
    });
  }
}
