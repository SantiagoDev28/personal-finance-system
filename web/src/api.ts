export type TransactionType = 'income' | 'expense'

export type Transaction = {
  id: string
  amount: number
  description: string
  category: string
  account: string
  type: TransactionType
  date: string
}

export type Resume = {
  income: number
  expense: number
  balance: number
}

export async function listTransactions(): Promise<Transaction[]> {
  return readJson<Transaction[]>('/transactions')
}

export async function getResume(): Promise<Resume> {
  return readJson<Resume>('/transactions/resume')
}

async function readJson<T>(path: string): Promise<T> {
  const response = await fetch(path)
  if (!response.ok) {
    throw new Error('La API no respondió')
  }
  return response.json() as Promise<T>
}
