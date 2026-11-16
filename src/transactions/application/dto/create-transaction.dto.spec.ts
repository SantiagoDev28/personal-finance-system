import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { createTransactionDto } from './create-transaction.dto';

const pipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
});

const shortcut = {
  amount: 18000,
  category: 'Alimentación',
  account: 'Efectivo',
  type: 'expense',
  date: '2026-11-15',
};

function submit(body: object) {
  return pipe.transform(body, {
    type: 'body',
    metatype: createTransactionDto,
  });
}

it('accepts the shortcut form without id, description or method', async () => {
  await expect(submit(shortcut)).resolves.toMatchObject(shortcut);
});

it('accepts an income category with its account', async () => {
  await expect(
    submit({
      amount: 2000000,
      category: 'Salario',
      account: 'Nu',
      type: 'income',
      date: '2026-11-15',
    }),
  ).resolves.toMatchObject({
    category: 'Salario',
    account: 'Nu',
    type: 'income',
  });
  await expect(
    submit({
      amount: 80000,
      category: 'Barberia',
      account: 'Nu',
      type: 'income',
      date: '2026-11-15',
    }),
  ).resolves.toMatchObject({
    category: 'Barberia',
    account: 'Nu',
    type: 'income',
  });
});

it('rejects a category that does not belong to the type', async () => {
  await expect(
    submit({ ...shortcut, category: 'Salario' }),
  ).rejects.toBeInstanceOf(BadRequestException);
  await expect(
    submit({ ...shortcut, type: 'income', category: 'Alimentación' }),
  ).rejects.toBeInstanceOf(BadRequestException);
});

it('rejects a zero, negative or decimal amount', async () => {
  for (const amount of [0, -18000, 18.5]) {
    await expect(submit({ ...shortcut, amount })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  }
});

it('rejects a date that is not a calendar day and a notion page id', async () => {
  await expect(
    submit({ ...shortcut, date: '2026-11-15T15:00:00.000Z' }),
  ).rejects.toBeInstanceOf(BadRequestException);
  await expect(
    submit({ ...shortcut, date: '2026-02-31' }),
  ).rejects.toBeInstanceOf(BadRequestException);
  await expect(
    submit({ ...shortcut, page_id: 'c1642803748248acba245c31686ff821' }),
  ).rejects.toBeInstanceOf(BadRequestException);
  await expect(submit({ ...shortcut, method: 'cash' })).rejects.toBeInstanceOf(
    BadRequestException,
  );
});
