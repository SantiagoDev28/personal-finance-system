-- Abono a la tarjeta. No es un movimiento: no tiene categoría ni tipo.
-- El monto es un peso entero mayor que 0. La cuenta de origen es de caja.

CREATE TABLE card_payments (
    id text PRIMARY KEY,
    amount bigint NOT NULL CHECK (amount > 0),
    source_account text NOT NULL
        CHECK (source_account IN ('Efectivo', 'Nequi', 'Nu', 'Daviplata')),
    card_account text NOT NULL DEFAULT 'Tarjeta crédito'
        CHECK (card_account = 'Tarjeta crédito'),
    description text NOT NULL,
    date timestamptz NOT NULL
);

CREATE INDEX card_payments_date_idx ON card_payments (date);
