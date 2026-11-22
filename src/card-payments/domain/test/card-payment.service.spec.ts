import { CardPaymentService } from '../../application/card-payment.service';
import { CardPaymentMemory } from '../../infrastructure/persistence/card-payment.memory';
import { TransactionService } from '../../../transactions/application/transaction.service';
import {
  Account,
  TransactionCategory,
  TransactionType,
} from '../../../transactions/domain/enums/transaction.enum';
import { TransactionMemory } from '../../../transactions/infrastructure/persistence/transaction.memory';

describe('CardPaymentService', () => {
  let transactions: TransactionService;
  let payments: CardPaymentService;

  beforeEach(() => {
    const transactionRepository = new TransactionMemory();
    const paymentRepository = new CardPaymentMemory();
    transactions = new TransactionService(
      transactionRepository,
      paymentRepository,
    );
    payments = new CardPaymentService(paymentRepository, transactionRepository);
  });

  it('stores an abono that matches the card purchase and leaves nothing outstanding', async () => {
    await purchase(transactions, 100000);

    const created = await payments.create({
      id: 'pay-1',
      amount: 100000,
      sourceAccount: Account.NU,
      date: new Date('2026-12-05T00:00:00.000Z'),
    });

    expect(created).toMatchObject({
      id: 'pay-1',
      amount: 100000,
      sourceAccount: Account.NU,
      cardAccount: Account.TARJETA_CREDITO,
      description: 'Abono tarjeta',
    });
    expect(await payments.outstanding()).toBe(0);
    expect(await transactions.findAll({})).toHaveLength(1);
  });

  it('rejects an abono above the outstanding balance', async () => {
    await purchase(transactions, 100000);

    await expect(
      payments.create({
        id: 'pay-too-much',
        amount: 100001,
        sourceAccount: Account.NU,
        date: new Date('2026-12-05T00:00:00.000Z'),
      }),
    ).rejects.toThrow('Card payment exceeds the outstanding balance');
    expect(await payments.findAll({})).toEqual([]);
    expect(await payments.outstanding()).toBe(100000);
  });

  it('keeps the remainder after a partial abono', async () => {
    await purchase(transactions, 100000);

    await payments.create({
      id: 'pay-part',
      amount: 40000,
      sourceAccount: Account.NEQUI,
      description: 'Abono parcial',
      date: new Date('2026-12-05T00:00:00.000Z'),
    });

    expect(await payments.outstanding()).toBe(60000);
  });

  it('returns the amount to the outstanding balance when the abono is deleted', async () => {
    await purchase(transactions, 100000);
    await payments.create({
      id: 'pay-1',
      amount: 100000,
      sourceAccount: Account.NU,
      date: new Date('2026-12-05T00:00:00.000Z'),
    });

    expect(await payments.delete('pay-1')).toEqual({
      message: 'Card payment with id pay-1 deleted successfully',
    });
    expect(await payments.outstanding()).toBe(100000);
  });

  it('lists abonos by source account and date', async () => {
    await purchase(transactions, 80000);
    await payments.create({
      id: 'nu',
      amount: 30000,
      sourceAccount: Account.NU,
      date: new Date('2026-12-05T00:00:00.000Z'),
    });
    await payments.create({
      id: 'nequi',
      amount: 20000,
      sourceAccount: Account.NEQUI,
      date: new Date('2026-12-06T00:00:00.000Z'),
    });

    expect(
      (
        await payments.findAll({
          sourceAccount: Account.NU,
          startDate: '2026-12-01',
          endDate: '2026-12-31',
        })
      ).map((payment) => payment.id),
    ).toEqual(['nu']);
  });

  it('rejects deleting a card purchase already covered by an abono', async () => {
    await purchase(transactions, 100000);
    await payments.create({
      id: 'pay-1',
      amount: 100000,
      sourceAccount: Account.NU,
      date: new Date('2026-12-05T00:00:00.000Z'),
    });

    await expect(transactions.delete('purchase-100000')).rejects.toThrow(
      'Card outstanding would be below zero',
    );
    expect(await transactions.findById('purchase-100000')).toMatchObject({
      amount: 100000,
    });
  });

  it('rejects an abono edit that leaves the card below zero', async () => {
    await purchase(transactions, 100000);
    await payments.create({
      id: 'pay-part',
      amount: 40000,
      sourceAccount: Account.NU,
      date: new Date('2026-12-05T00:00:00.000Z'),
    });

    await expect(
      payments.update('pay-part', { amount: 100001 }),
    ).rejects.toThrow('Card payment exceeds the outstanding balance');
    expect(await payments.findById('pay-part')).toMatchObject({
      amount: 40000,
    });
    expect(await payments.outstanding()).toBe(60000);
  });
});

function purchase(transactions: TransactionService, amount: number) {
  return transactions.create({
    id: `purchase-${amount}`,
    amount,
    description: 'Mercado',
    category: TransactionCategory.FOOD,
    account: Account.TARJETA_CREDITO,
    type: TransactionType.EXPENSE,
    date: new Date('2026-11-03T00:00:00.000Z'),
  });
}
