import {
  Account,
  isCategoryForType,
  isKnownCategory,
  TransactionType,
} from '../../domain/enums/transaction.enum';
import { isCalendarDate } from '../../domain/repositories/transaction-filter';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'shortcutCategory', async: false })
export class ShortcutCategoryConstraint implements ValidatorConstraintInterface {
  validate(category: unknown, args: ValidationArguments): boolean {
    if (typeof category !== 'string') {
      return false;
    }
    const type = (args.object as { type?: TransactionType }).type;
    if (type === undefined) {
      return isKnownCategory(category);
    }
    return isCategoryForType(category, type);
  }

  defaultMessage(): string {
    return 'category is not valid for this type';
  }
}

@ValidatorConstraint({ name: 'calendarDate', async: false })
export class CalendarDateConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === 'string' && isCalendarDate(value);
  }

  defaultMessage(): string {
    return 'date must be yyyy-MM-dd';
  }
}

export class createTransactionDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id?: string;

  @IsInt()
  @IsPositive()
  amount!: number;

  @IsString()
  @IsNotEmpty()
  @Validate(ShortcutCategoryConstraint)
  category!: string;

  @IsEnum(Account)
  account!: Account;

  @IsEnum(TransactionType)
  type!: TransactionType;

  @IsString()
  @Validate(CalendarDateConstraint)
  date!: string;
}
