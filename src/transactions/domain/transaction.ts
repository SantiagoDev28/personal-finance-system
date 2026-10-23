import { TransactionMethod, TransactionType } from "./transaction.enum";

export class Transaction {
    private constructor(
        public readonly id: string,
        public readonly amount: number,
        public readonly description: string,
        public readonly category: string,
        public readonly method: TransactionMethod,
        public readonly type: TransactionType,
        public readonly date: Date,
    ) {}

    public static create(data: {
        id: string;
        amount: number;
        description: string;
        category: string;
        method: TransactionMethod;
        type: TransactionType;
        date: Date;
    }): Transaction {
        if (data.amount <= 0) {
            throw new Error('Amount must be greater than 0');
        }
        if (!Number.isInteger(data.amount)) {
            throw new Error('Amount must be an integer');
        }
        if (!data.id.trim() || !data.category.trim() || !data.method.trim() || !data.type.trim()) {
            throw new Error(`${data.id.trim()}, ${data.category.trim()}, ${data.method.trim()}, ${data.type.trim()} are required`);
        }
        if (Number.isNaN(data.date.getTime())) {
            throw new Error(`Date must be a valid date`);
        }
        return new Transaction(data.id, data.amount, data.description, data.category, data.method, data.type, data.date);
    }
}