import { TransactionType } from "../enums/transaction.enum";

export interface TransactionFilter {
    category?: string;
    type?: TransactionType;
    method?: string;
    startDate?: string;
    endDate?: string;
}