import { Account, TransactionType } from './enums/transaction.enum';

export type CashResume = {
  income: number;
  cashExpense: number;
  cardExpense: number;
  cardPayments: number;
  balance: number;
  cardOutstanding: number;
};

type Movement = {
  type: TransactionType;
  amount: number;
  account: Account;
};

type Payment = {
  amount: number;
};

export function cardDebt(movement: Movement): number {
  if (
    movement.type === TransactionType.EXPENSE &&
    movement.account === Account.TARJETA_CREDITO
  ) {
    return movement.amount;
  }
  return 0;
}

export function cashResume(
  movements: Movement[],
  history: Movement[],
  payments: Payment[] = [],
  historyPayments: Payment[] = [],
): CashResume {
  const income = sum(
    movements,
    (movement) => movement.type === TransactionType.INCOME,
  );
  const cashExpense = sum(
    movements,
    (movement) =>
      movement.type === TransactionType.EXPENSE && cardDebt(movement) === 0,
  );
  const cardExpense = sum(movements, (movement) => cardDebt(movement) > 0);
  const cardPayments = payments.reduce(
    (total, payment) => total + payment.amount,
    0,
  );
  const historyCard = history.reduce(
    (total, movement) => total + cardDebt(movement),
    0,
  );
  const historyPaid = historyPayments.reduce(
    (total, payment) => total + payment.amount,
    0,
  );

  return {
    income,
    cashExpense,
    cardExpense,
    cardPayments,
    balance: income - cashExpense - cardPayments,
    cardOutstanding: historyCard - historyPaid,
  };
}

function sum(
  movements: Movement[],
  include: (movement: Movement) => boolean,
): number {
  return movements
    .filter(include)
    .reduce((total, movement) => total + movement.amount, 0);
}
