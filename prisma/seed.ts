import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Delete existing data
  await prisma.car.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const passwordHash = await bcrypt.hash('password123', 10);
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      name: 'User One',
      password: passwordHash,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      name: 'User Two',
      password: passwordHash,
    },
  });

  // Create categories for each user
  const category1 = await prisma.category.create({
    data: { name: 'SUV', userId: user1.id },
  });

  const category2 = await prisma.category.create({
    data: { name: 'Sedan', userId: user1.id },
  });

  const category3 = await prisma.category.create({
    data: { name: 'Hatchback', userId: user2.id },
  });

  // Create cars for categories
  await prisma.car.createMany({
    data: [
      { make: 'Toyota', model: 'RAV4', year: 2022, categoryId: category1.id },
      { make: 'Honda', model: 'CR-V', year: 2023, categoryId: category1.id },
      { make: 'Toyota', model: 'Camry', year: 2021, categoryId: category2.id },
      { make: 'Honda', model: 'Civic', year: 2020, categoryId: category2.id },
      { make: 'Ford', model: 'Fiesta', year: 2019, categoryId: category3.id },
    ],
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
