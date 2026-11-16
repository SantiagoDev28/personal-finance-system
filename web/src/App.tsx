import { useEffect, useState } from 'react'
import { getResume, listTransactions, type Resume, type Transaction } from './api'

const pesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [resume, setResume] = useState<Resume | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    Promise.all([listTransactions(), getResume()])
      .then(([list, totals]) => {
        if (!active) return
        setTransactions(list)
        setResume(totals)
      })
      .catch(() => {
        if (active) setError('No se pudo leer la API. Revisa que el servidor esté en el puerto 3000.')
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <main>
      <header>
        <p>Finanzas</p>
        <h1>Movimientos</h1>
      </header>

      {error ? <p className="error">{error}</p> : null}

      <section className="totals" aria-label="Saldo">
        <Total label="Ingresos" value={resume?.income} />
        <Total label="Gastos" value={resume?.expense} />
        <Total label="Saldo" value={resume?.balance} />
      </section>

      {transactions.length === 0 && !error ? (
        <p className="empty">Todavía no hay movimientos en la lista.</p>
      ) : (
        <ul>
          {[...transactions].reverse().map((transaction) => (
            <li key={transaction.id}>
              <div>
                <strong>{transaction.category}</strong>
                <span>
                  {transaction.account} · {calendarDay(transaction.date)}
                </span>
              </div>
              <span className={transaction.type}>
                {transaction.type === 'expense' ? '−' : '+'}
                {pesos.format(transaction.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

function Total({ label, value }: { label: string; value?: number }) {
  return (
    <article>
      <span>{label}</span>
      <strong>{value === undefined ? '—' : pesos.format(value)}</strong>
    </article>
  )
}

function calendarDay(value: string) {
  return value.slice(0, 10)
}
