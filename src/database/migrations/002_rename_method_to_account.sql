-- La cuenta del atajo se guarda con el texto del menú.

ALTER TABLE transactions RENAME COLUMN method TO account;
