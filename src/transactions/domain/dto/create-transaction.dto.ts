import { TransactionMethod, TransactionType } from '../transaction.enum';
import { IsNumber, IsInt, IsPositive, IsString, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';

export class createTransactionDto {
    @IsString()
    @IsNotEmpty()
    id!: string;

    @IsNumber()
    @IsInt()
    @IsPositive()
    amount!: number;

    @IsString()
    description!: string;

    @IsString()
    @IsNotEmpty()
    category!: string;

    @IsEnum(TransactionMethod)
    method!: TransactionMethod;

    @IsEnum(TransactionType)
    type!: TransactionType;

    @IsDateString()
    date!: string;
}