import {
  TransactionCategory,
  TransactionType,
} from '../enums/transaction.enum';

export interface TransactionFilter {
  category?: TransactionCategory;
  type?: TransactionType;
  method?: string;
  startDate?: string;
  endDate?: string;
}

export function filterDateBounds(filter: TransactionFilter): {
  start?: Date;
  end?: Date;
} {
  const start = filter.startDate ? new Date(filter.startDate) : undefined;
  let end: Date | undefined;
  if (filter.endDate) {
    end = new Date(filter.endDate);
    if (/^\d{4}-\d{2}-\d{2}$/.test(filter.endDate)) {
      end.setUTCHours(23, 59, 59, 999);
    }
  }
  return { start, end };
}

export function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

export function startOfUtcDay(calendarDate: string): Date {
  return new Date(`${calendarDate}T00:00:00.000Z`);
}
