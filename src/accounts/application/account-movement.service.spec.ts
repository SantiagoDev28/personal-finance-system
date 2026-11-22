import { AccountMovementService } from './account-movement.service';
import { CardPaymentMemory } from '../../card-payments/infrastructure/persistence/card-payment.memory';
import { CardPaymentService } from '../../card-payments/application/card-payment.service';
import { TransactionService } from '../../transactions/application/transaction.service';
import {
  Account,
  TransactionCategory,
  TransactionType,
} from '../../transactions/domain/enums/transaction.enum';
import { TransactionMemory } from '../../transactions/infrastructure/persistence/transaction.memory';

describe('AccountMovementService', () => {
  it('lists a cash expense and the card payment that leaves that account', async () => {
    const transactionRepository = new TransactionMemory();
    const paymentRepository = new CardPaymentMemory();
    const transactions = new TransactionService(
      transactionRepository,
      paymentRepository,
    );
    const payments = new CardPaymentService(
      paymentRepository,
      transactionRepository,
    );
    const movements = new AccountMovementService(
      transactionRepository,
      paymentRepository,
    );
    const november = new Date('2026-11-03T00:00:00.000Z');
    const december = new Date('2026-12-05T00:00:00.000Z');

    await transactions.create({
      id: 'market',
      amount: 100000,
      description: 'Mercado',
      category: TransactionCategory.FOOD,
      account: Account.TARJETA_CREDITO,
      type: TransactionType.EXPENSE,
      date: november,
    });
    await transactions.create({
      id: 'lunch',
      amount: 18000,
      description: 'Almuerzo',
      category: TransactionCategory.FOOD,
      account: Account.NU,
      type: TransactionType.EXPENSE,
      date: december,
    });
    await payments.create({
      id: 'pay-1',
      amount: 100000,
      sourceAccount: Account.NU,
      date: december,
    });

    expect(
      await movements.list({
        account: Account.NU,
        startDate: '2026-12-01',
        endDate: '2026-12-31',
      }),
    ).toEqual([
      {
        kind: 'expense',
        id: 'lunch',
        amount: 18000,
        account: Account.NU,
        date: december,
        description: 'Almuerzo',
        category: TransactionCategory.FOOD,
      },
      {
        kind: 'card_payment',
        id: 'pay-1',
        amount: 100000,
        account: Account.NU,
        date: december,
        description: 'Abono tarjeta',
      },
    ]);
  });
});
