-- Movimiento que el dominio ya valida. Sin page_id ni cuentas de Notion.
-- El monto es un peso entero mayor que 0. El tipo solo admite income o expense.

CREATE TABLE transactions (
    id text PRIMARY KEY,
    amount bigint NOT NULL CHECK (amount > 0),
    description text NOT NULL,
    category text NOT NULL,
    method text NOT NULL,
    type text NOT NULL CHECK (type IN ('income', 'expense')),
    date timestamptz NOT NULL
);

CREATE INDEX transactions_date_idx ON transactions (date);
