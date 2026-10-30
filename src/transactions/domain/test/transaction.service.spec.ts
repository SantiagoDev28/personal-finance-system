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

  it('should update an existing transaction', () => {
    const originalDate = new Date('2026-09-02T00:00:00.000Z');
    const updatedDate = '2026-10-03T00:00:00.000Z';

    service.create({
      id: '6',
      amount: 18000,
      description: 'Almuerzo',
      category: 'Alimentación',
      method: TransactionMethod.CASH,
      type: TransactionType.EXPENSE,
      date: originalDate,
    });
    service.create({
      id: '7',
      amount: 100000,
      description: 'Salario',
      category: 'Salario',
      method: TransactionMethod.TRANSFER,
      type: TransactionType.INCOME,
      date: originalDate,
    });

    const result = service.update('6', {
      amount: 22000,
      description: 'Cena',
      category: 'Restaurante',
      method: TransactionMethod.DEBIT_CARD,
      type: TransactionType.EXPENSE,
      date: updatedDate,
    });

    expect(result).toEqual({
      id: '6',
      amount: 22000,
      description: 'Cena',
      category: 'Restaurante',
      method: TransactionMethod.DEBIT_CARD,
      type: TransactionType.EXPENSE,
      date: new Date(updatedDate),
    });
    expect(service.findById('6')).toEqual(result);
    expect(service.findAll()).toHaveLength(2);
    expect(service.findById('7')).toEqual({
      id: '7',
      amount: 100000,
      description: 'Salario',
      category: 'Salario',
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
      category: 'Alimentación',
      method: TransactionMethod.CASH,
      type: TransactionType.EXPENSE,
      date,
    });

    const result = service.update('8', { amount: 22000 });

    expect(result).toEqual({
      id: '8',
      amount: 22000,
      description: 'Almuerzo',
      category: 'Alimentación',
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
      category: 'Alimentación',
      method: TransactionMethod.CASH,
      type: TransactionType.EXPENSE,
      date,
    });

    expect(() =>
      service.update('9', {
        amount: 0,
        description: 'Cena',
        category: 'Restaurante',
        method: TransactionMethod.DEBIT_CARD,
      }),
    ).toThrow('Amount must be greater than 0');

    expect(service.findById('9')).toEqual({
      id: '9',
      amount: 18000,
      description: 'Almuerzo',
      category: 'Alimentación',
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
      category: 'Salario',
      method: TransactionMethod.TRANSFER,
      type: TransactionType.INCOME,
      date,
    });
    service.create({
      id: '11',
      amount: 18000,
      description: 'Almuerzo',
      category: 'Alimentación',
      method: TransactionMethod.CASH,
      type: TransactionType.EXPENSE,
      date,
    });

    expect(service.delete('11')).toEqual({
      message: 'Transaction with id 11 deleted successfully',
    });
    expect(service.findAll()).toEqual([
      {
        id: '10',
        amount: 100000,
        description: 'Salario',
        category: 'Salario',
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
});
