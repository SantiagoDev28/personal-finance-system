export enum Account {
  EFECTIVO = 'Efectivo',
  NEQUI = 'Nequi',
  NU = 'Nu',
  DAVIPLATA = 'Daviplata',
  TARJETA_CREDITO = 'Tarjeta crédito',
}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum TransactionCategory {
  FOOD = 'Alimentación',
  TRANSPORTATION = 'Transporte',
  HOUSING = 'Hogar',
  TECHNOLOGY = 'Tecnología',
  EDUCATION = 'Educación',
  SPORT = 'Deporte',
  CLOTHING = 'Ropa',
  ENTERTAINMENT = 'Entretenimiento',
  SUBSCRIPTIONS = 'Suscripciones',
  OTHER = 'Otros',
  SALARY = 'Salario',
  FREELANCE = 'Freelance',
  BARBERIA = 'Barberia',
  OTHER_INCOME = 'Otros ingresos',
}

export const EXPENSE_CATEGORIES = [
  TransactionCategory.FOOD,
  TransactionCategory.TRANSPORTATION,
  TransactionCategory.HOUSING,
  TransactionCategory.TECHNOLOGY,
  TransactionCategory.EDUCATION,
  TransactionCategory.SPORT,
  TransactionCategory.CLOTHING,
  TransactionCategory.ENTERTAINMENT,
  TransactionCategory.SUBSCRIPTIONS,
  TransactionCategory.OTHER,
] as const;

export const INCOME_CATEGORIES = [
  TransactionCategory.SALARY,
  TransactionCategory.FREELANCE,
  TransactionCategory.BARBERIA,
  TransactionCategory.OTHER_INCOME,
] as const;

export const ACCOUNTS = [
  Account.EFECTIVO,
  Account.NEQUI,
  Account.NU,
  Account.DAVIPLATA,
  Account.TARJETA_CREDITO,
] as const;

export function isAccount(value: string): boolean {
  return (ACCOUNTS as readonly string[]).includes(value);
}

export function isKnownCategory(value: string): boolean {
  return (
    (EXPENSE_CATEGORIES as readonly string[]).includes(value) ||
    (INCOME_CATEGORIES as readonly string[]).includes(value)
  );
}

export function isCategoryForType(
  category: string,
  type: TransactionType,
): boolean {
  if (type === TransactionType.INCOME) {
    return (INCOME_CATEGORIES as readonly string[]).includes(category);
  }
  if (type === TransactionType.EXPENSE) {
    return (EXPENSE_CATEGORIES as readonly string[]).includes(category);
  }
  return false;
}
