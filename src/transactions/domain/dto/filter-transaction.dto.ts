import { TransactionCategory, TransactionType } from "../transaction.enum";
import { IsString, IsEnum, IsOptional } from "class-validator";


export class FilterTransactionDto {
    @IsOptional()
    @IsEnum(TransactionCategory)
    category?: TransactionCategory;

    @IsOptional()
    @IsEnum(TransactionType)
    type?: TransactionType;

    @IsString()
    @IsOptional()
    startDate?: string;

    @IsString()
    @IsOptional()
    endDate?: string;
}