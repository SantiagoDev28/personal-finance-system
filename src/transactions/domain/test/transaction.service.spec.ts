import { TransactionService } from '../../application/transaction.service';
import { cashResume } from '../cash-resume';
import { CardPaymentMemory } from '../../../card-payments/infrastructure/persistence/card-payment.memory';
import { TransactionMemory } from '../../infrastructure/persistence/transaction.memory';
import {
  TransactionCategory,
  Account,
  TransactionType,
} from '../enums/transaction.enum';

describe('TransactionsService', () => {
  let service: TransactionService;
  let memory: TransactionMemory;

  beforeEach(() => {
    memory = new TransactionMemory();
    service = new TransactionService(memory, new CardPaymentMemory());
  });

  it('should list transactions', async () => {
    await service.create({
      id: '1',
      amount: 500,
      description: 'Test',
      category: TransactionCategory.SALARY,
      account: Account.EFECTIVO,
      type: TransactionType.INCOME,
      date: new Date('2026-09-02T00:00:00.000Z'),
    });
    expect(await service.findAll({})).toEqual([
      {
        id: '1',
        amount: 500,
        description: 'Test',
        category: TransactionCategory.SALARY,
        account: Account.EFECTIVO,
        type: TransactionType.INCOME,
        date: new Date('2026-09-02T00:00:00.000Z'),
      },
    ]);
  });

  it('lists transactions by date and then by id', async () => {
    const day = new Date('2026-09-02T00:00:00.000Z');
    await service.create(movement('b', 100, TransactionType.EXPENSE, day));
    await service.create(movement('a', 200, TransactionType.INCOME, day));
    await service.create(
      movement(
        'later',
        300,
        TransactionType.EXPENSE,
        new Date('2026-09-03T00:00:00.000Z'),
      ),
    );

    expect(
      (await service.findAll({})).map((transaction) => transaction.id),
    ).toEqual(['a', 'b', 'later']);
  });

  it('should save a transaction', async () => {
    const result = await service.create({
      id: '2',
      amount: 1000,
      description: 'Test',
      category: TransactionCategory.SALARY,
      account: Account.EFECTIVO,
      type: TransactionType.INCOME,
      date: new Date('2026-09-02T00:00:00.000Z'),
    });

    expect(result).toEqual({
      id: '2',
      amount: 1000,
      description: 'Test',
      category: TransactionCategory.SALARY,
      account: Account.EFECTIVO,
      type: TransactionType.INCOME,
      date: new Date('2026-09-02T00:00:00.000Z'),
    });
  });

  it('rejects a repeated id', async () => {
    const transaction = {
      id: 'dup',
      amount: 1000,
      description: 'Test',
      category: TransactionCategory.SALARY,
      account: Account.EFECTIVO,
      type: TransactionType.INCOME,
      date: new Date('2026-09-02T00:00:00.000Z'),
    };

    await service.create(transaction);

    await expect(service.create(transaction)).rejects.toThrow(
      'Transaction with id dup already exists',
    );
    expect(await service.findAll({})).toHaveLength(1);
  });

  it('should find a transaction by id', async () => {
    await service.create({
      id: '3',
      amount: 800,
      description: 'Test',
      category: TransactionCategory.SALARY,
      account: Account.EFECTIVO,
      type: TransactionType.INCOME,
      date: new Date('2026-09-02T00:00:00.000Z'),
    });

    expect(await service.findById('3')).toEqual({
      id: '3',
      amount: 800,
      description: 'Test',
      category: TransactionCategory.SALARY,
      account: Account.EFECTIVO,
      type: TransactionType.INCOME,
      date: new Date('2026-09-02T00:00:00.000Z'),
    });
  });

  it('should throw when the transaction does not exist', async () => {
    await expect(service.findById('99')).rejects.toThrow(
      'Transaction with id 99 not found',
    );
  });

  it('should report zero income, expense and balance when the list is empty', async () => {
    expect(await service.resume()).toEqual(cash(0, 0));
  });

  it('should subtract an expense from income', async () => {
    const date = new Date('2026-09-02T00:00:00.000Z');

    await service.create({
      id: '4',
      amount: 100000,
      description: 'Salario',
      category: TransactionCategory.SALARY,
      account: Account.NU,
      type: TransactionType.INCOME,
      date,
    });
    await service.create({
      id: '5',
      amount: 18000,
      description: 'Almuerzo',
      category: TransactionCategory.FOOD,
      account: Account.EFECTIVO,
      type: TransactionType.EXPENSE,
      date,
    });

    expect(await service.resume()).toEqual(cash(100000, 18000));
    expect((await service.findById('5')).amount).toBe(18000);
  });

  it('should update an existing transaction', async () => {
    const originalDate = new Date('2026-09-02T00:00:00.000Z');
    const updatedDate = '2026-10-03T00:00:00.000Z';

    await service.create({
      id: '6',
      amount: 18000,
      description: 'Almuerzo',
      category: TransactionCategory.FOOD,
      account: Account.EFECTIVO,
      type: TransactionType.EXPENSE,
      date: originalDate,
    });
    await service.create({
      id: '7',
      amount: 100000,
      description: 'Salario',
      category: TransactionCategory.SALARY,
      account: Account.NU,
      type: TransactionType.INCOME,
      date: originalDate,
    });

    const result = await service.update('6', {
      amount: 22000,
      description: 'Cena',
      category: TransactionCategory.ENTERTAINMENT,
      account: Account.NEQUI,
      type: TransactionType.EXPENSE,
      date: updatedDate,
    });

    expect(result).toEqual({
      id: '6',
      amount: 22000,
      description: 'Cena',
      category: TransactionCategory.ENTERTAINMENT,
      account: Account.NEQUI,
      type: TransactionType.EXPENSE,
      date: new Date(updatedDate),
    });
    expect(await service.findById('6')).toEqual(result);
    expect(await service.findAll({})).toHaveLength(2);
    expect(await service.findById('7')).toEqual({
      id: '7',
      amount: 100000,
      description: 'Salario',
      category: TransactionCategory.SALARY,
      account: Account.NU,
      type: TransactionType.INCOME,
      date: originalDate,
    });
    expect(await service.resume()).toEqual(cash(100000, 22000));
  });

  it('should update only the fields sent in the body', async () => {
    const date = new Date('2026-09-02T00:00:00.000Z');

    await service.create({
      id: '8',
      amount: 18000,
      description: 'Almuerzo',
      category: TransactionCategory.FOOD,
      account: Account.EFECTIVO,
      type: TransactionType.EXPENSE,
      date,
    });

    const result = await service.update('8', { amount: 22000 });

    expect(result).toEqual({
      id: '8',
      amount: 22000,
      description: 'Almuerzo',
      category: TransactionCategory.FOOD,
      account: Account.EFECTIVO,
      type: TransactionType.EXPENSE,
      date,
    });
    expect(await service.resume()).toEqual(cash(0, 22000));
  });

  it('should throw when updating a transaction that does not exist', async () => {
    await expect(service.update('99', { amount: 1000 })).rejects.toThrow(
      'Transaction with id 99 not found',
    );
  });

  it('should keep the stored transaction when the updated amount is not greater than 0', async () => {
    const date = new Date('2026-09-02T00:00:00.000Z');

    await service.create({
      id: '9',
      amount: 18000,
      description: 'Almuerzo',
      category: TransactionCategory.FOOD,
      account: Account.EFECTIVO,
      type: TransactionType.EXPENSE,
      date,
    });

    await expect(
      service.update('9', {
        amount: 0,
        description: 'Cena',
        category: TransactionCategory.ENTERTAINMENT,
        account: Account.NEQUI,
      }),
    ).rejects.toThrow('Amount must be greater than 0');

    expect(await service.findById('9')).toEqual({
      id: '9',
      amount: 18000,
      description: 'Almuerzo',
      category: TransactionCategory.FOOD,
      account: Account.EFECTIVO,
      type: TransactionType.EXPENSE,
      date,
    });
  });

  it('should delete an existing transaction', async () => {
    const date = new Date('2026-09-02T00:00:00.000Z');

    await service.create({
      id: '10',
      amount: 100000,
      description: 'Salario',
      category: TransactionCategory.SALARY,
      account: Account.NU,
      type: TransactionType.INCOME,
      date,
    });
    await service.create({
      id: '11',
      amount: 18000,
      description: 'Almuerzo',
      category: TransactionCategory.FOOD,
      account: Account.EFECTIVO,
      type: TransactionType.EXPENSE,
      date,
    });

    expect(await service.delete('11')).toEqual({
      message: 'Transaction with id 11 deleted successfully',
    });
    expect(await service.findAll({})).toEqual([
      {
        id: '10',
        amount: 100000,
        description: 'Salario',
        category: TransactionCategory.SALARY,
        account: Account.NU,
        type: TransactionType.INCOME,
        date,
      },
    ]);
    await expect(service.findById('11')).rejects.toThrow(
      'Transaction with id 11 not found',
    );
    expect(await service.resume()).toEqual(cash(100000, 0));
  });

  it('should throw when deleting a transaction that does not exist', async () => {
    await expect(service.delete('99')).rejects.toThrow(
      'Transaction with id 99 not found',
    );
  });

  it('should include a stored instant from the start of startDate through the last second of endDate', async () => {
    await seedOctoberRange(service);
    const filter = { startDate: '2026-10-01', endDate: '2026-10-03' };
    const listed = await service.findAll(filter);

    expect(listed.map((transaction) => transaction.id)).toEqual([
      'start',
      'middle',
      'end-afternoon',
      'end-last',
    ]);
    expect(await service.resume(filter)).toEqual(cash(13000, 6000));
    expect(await service.resume(filter)).toEqual(calculateResume(listed));
    expect(await service.resume()).toEqual(cash(13000, 12000));
  });

  it('should keep an endDate that includes a time at that instant', async () => {
    await seedOctoberRange(service);
    const filter = {
      startDate: '2026-10-01',
      endDate: '2026-10-03T12:00:00.000Z',
    };

    expect(
      (await service.findAll(filter)).map((transaction) => transaction.id),
    ).toEqual(['start', 'middle']);
    expect(await service.resume(filter)).toEqual(cash(10000, 4000));
  });

  it('should return an empty list and a zero resume when the range has no transactions', async () => {
    await seedOctoberRange(service);
    const filter = { startDate: '2026-11-01', endDate: '2026-11-02' };

    expect(await service.findAll(filter)).toEqual([]);
    expect(await service.resume(filter)).toEqual(cash(0, 0));
    expect(await service.resume()).toEqual(
      calculateResume(await service.findAll({})),
    );
  });

  it('should filter the resume by type, category and date range together', async () => {
    await seedOctoberRange(service);
    const filter = {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.FOOD,
      startDate: '2026-10-01',
      endDate: '2026-10-03',
    };
    const listed = await service.findAll(filter);

    expect(listed.map((transaction) => transaction.id)).toEqual(['middle']);
    expect(await service.resume(filter)).toEqual(cash(0, 4000));
    expect(await service.resume(filter)).toEqual(calculateResume(listed));
  });

  it('keeps a card purchase out of the cash balance and in its category', async () => {
    const date = new Date('2026-11-03T00:00:00.000Z');
    await service.create({
      id: 'salary',
      amount: 100000,
      description: 'Salario',
      category: TransactionCategory.SALARY,
      account: Account.NU,
      type: TransactionType.INCOME,
      date,
    });
    await service.create({
      id: 'market',
      amount: 100000,
      description: 'Mercado',
      category: TransactionCategory.FOOD,
      account: Account.TARJETA_CREDITO,
      type: TransactionType.EXPENSE,
      date,
    });
    await service.create({
      id: 'cash-food',
      amount: 18000,
      description: 'Almuerzo',
      category: TransactionCategory.FOOD,
      account: Account.NU,
      type: TransactionType.EXPENSE,
      date,
    });

    expect(await service.resume()).toEqual({
      income: 100000,
      cashExpense: 18000,
      cardExpense: 100000,
      cardPayments: 0,
      balance: 82000,
      cardOutstanding: 100000,
    });
    expect(
      (
        await service.findAll({
          category: TransactionCategory.FOOD,
          startDate: '2026-11-01',
          endDate: '2026-11-30',
        })
      ).map((transaction) => transaction.id),
    ).toEqual(['cash-food', 'market']);
  });

  it('filters the list by account', async () => {
    const date = new Date('2026-11-03T00:00:00.000Z');
    await service.create({
      id: 'nu',
      amount: 18000,
      description: 'Almuerzo',
      category: TransactionCategory.FOOD,
      account: Account.NU,
      type: TransactionType.EXPENSE,
      date,
    });
    await service.create({
      id: 'cash',
      amount: 5000,
      description: 'Bus',
      category: TransactionCategory.TRANSPORTATION,
      account: Account.EFECTIVO,
      type: TransactionType.EXPENSE,
      date,
    });

    expect(
      (await service.findAll({ account: Account.NU })).map(
        (transaction) => transaction.id,
      ),
    ).toEqual(['nu']);
  });
});

function cash(income: number, cashExpense: number) {
  return {
    income,
    cashExpense,
    cardExpense: 0,
    cardPayments: 0,
    balance: income - cashExpense,
    cardOutstanding: 0,
  };
}

function calculateResume(
  transactions: { type: TransactionType; amount: number; account: string }[],
) {
  return cashResume(transactions, transactions);
}

function movement(
  id: string,
  amount: number,
  type: TransactionType,
  date: Date,
  category?: TransactionCategory,
) {
  return {
    id,
    amount,
    description: id,
    category:
      category ??
      (type === TransactionType.INCOME
        ? TransactionCategory.SALARY
        : TransactionCategory.OTHER),
    account: Account.EFECTIVO,
    type,
    date,
  };
}

async function seedOctoberRange(service: TransactionService) {
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
      category: TransactionCategory.SALARY,
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
      category: TransactionCategory.SALARY,
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
    await service.create({
      id: row.id,
      amount: row.amount,
      description: row.id,
      category: row.category,
      account: Account.EFECTIVO,
      type: row.type,
      date: new Date(row.date),
    });
  }
}
