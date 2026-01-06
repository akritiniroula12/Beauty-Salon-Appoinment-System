import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

const prisma = new PrismaClient({
  adapter,
});

const services = [
  {
    name: 'Hair Cut',
    description: 'Professional haircut service',
    duration: 30,
    price: 25.00,
  },
  {
    name: 'Hair Wash',
    description: 'Complete hair washing and conditioning',
    duration: 20,
    price: 15.00,
  },
  {
    name: 'Hair Coloring',
    description: 'Full hair coloring service',
    duration: 90,
    price: 80.00,
  },
  {
    name: 'Manicure',
    description: 'Professional manicure service',
    duration: 45,
    price: 30.00,
  },
  {
    name: 'Pedicure',
    description: 'Professional pedicure service',
    duration: 60,
    price: 40.00,
  },
  {
    name: 'Facial Treatment',
    description: 'Relaxing facial treatment',
    duration: 60,
    price: 50.00,
  },
  {
    name: 'Massage',
    description: 'Full body massage therapy',
    duration: 90,
    price: 70.00,
  },
  {
    name: 'Eyebrow Shaping',
    description: 'Professional eyebrow shaping and threading',
    duration: 15,
    price: 12.00,
  },
];

async function main() {
  console.log('Seeding services...');

  for (const service of services) {
    await prisma.service.upsert({
      where: { name: service.name },
      update: {},
      create: service,
    });
  }

  console.log('Services seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });