import { faker } from "@faker-js/faker";
import { Column, PrismaClient } from "@prisma/client";

function fakeCard() {
  return {
    title: faker.lorem.words({ min: 1, max: 5 }),
    description: faker.lorem.words({ min: 5, max: 20 }),
    column: faker.helpers.arrayElement(Object.keys(Column)) as Column,
  };
}

function fakeBoard() {
  return {
    name: faker.lorem.words({ min: 1, max: 5 }),
    cards: {
      create: Array.from({
        length: faker.helpers.rangeToNumber({ min: 1, max: 5 }),
      })
        .fill("")
        .map((_) => fakeCard()),
    },
  };
}

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (trx) => {
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
  async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  },
);
