-- Esquema del registro. El id del movimiento es el texto que envía el API.

CREATE TABLE IF NOT EXISTS transaction_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) NOT NULL,
    code varchar(100) NOT NULL UNIQUE,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transaction_methods (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) NOT NULL,
    code varchar(100) NOT NULL UNIQUE,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transaction_types (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) NOT NULL,
    code varchar(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS transactions (
    id text PRIMARY KEY,
    amount numeric(14, 2) NOT NULL CHECK (amount > 0),
    description text NOT NULL,
    date timestamptz NOT NULL,
    category_id uuid NOT NULL REFERENCES transaction_categories (id) ON DELETE RESTRICT,
    method_id uuid NOT NULL REFERENCES transaction_methods (id) ON DELETE RESTRICT,
    type_id uuid NOT NULL REFERENCES transaction_types (id) ON DELETE RESTRICT
);

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'transactions'
          AND column_name = 'id'
          AND udt_name = 'uuid'
    ) THEN
        ALTER TABLE transactions ALTER COLUMN id DROP DEFAULT;
        ALTER TABLE transactions
            ALTER COLUMN id TYPE text USING id::text;
    END IF;
END $$;
