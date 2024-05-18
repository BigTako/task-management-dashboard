import { faker } from '@faker-js/faker';
import { Column, PrismaClient } from '@prisma/client';

function fakeCard({ index, column }: { index: number; column: Column }) {
  return {
    title: String(index),
    description: faker.lorem.words({ min: 5, max: 20 }),
    column,
    position: index,
  };
}

function fakeCardsArray({ column }: { column: Column }) {
  return Array.from({
    length: faker.helpers.rangeToNumber({ min: 1, max: 5 }),
  })
    .fill('')
    .map((_, i) => fakeCard({ index: i, column }));
}

function fakeBoard() {
  const toDoCards = fakeCardsArray({ column: Column.TO_DO });
  const inProgressCards = fakeCardsArray({ column: Column.IN_PROGRESS });
  const doneCards = fakeCardsArray({ column: Column.DONE });

  return {
    name: faker.lorem.words({ min: 1, max: 5 }),
    cards: {
      create: [...toDoCards, ...inProgressCards, ...doneCards],
    },
  };
}

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async trx => {
    await trx.board.deleteMany();
  });

  for (let i = 0; i < 5; i++) {
    await prisma.board.create({
      data: fakeBoard(),
    });
  }
}

main().then(
  async () => {
    await prisma.$disconnect();
  },
  async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  },
);
