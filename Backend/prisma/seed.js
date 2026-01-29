import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

const prisma = new PrismaClient({
  adapter,
});

const services = [
  {
    name: 'Hair Cut',
    description: 'Professional haircut service',
    duration: 30,
    price: 2500,
  },
  {
    name: 'Hair Wash',
    description: 'Complete hair washing and conditioning',
    duration: 60,
    price: 1400,
  },
  {
    name: 'Hair Coloring',
    description: 'Full hair coloring service',
    duration: 50,
    price: 800,
  },
  {
    name: 'Manicure & Pedicure',
    description: 'Professional manicure & pedicure service',
    duration: 60,
    price: 3500,
  },
  {
    name: 'Facial Treatment',
    description: 'Relaxing facial treatment',
    duration: 60,
    price: 5000,
  },
  {
    name: 'Massage',
    description: 'Full body massage therapy',
    duration: 90,
    price: 7000,
  },
  {
    name: 'Eyebrow Shaping',
    description: 'Professional eyebrow shaping and threading',
    duration: 15,
    price: 60,
  },
];

const testUsers = [
  {
    name: 'Admin User',
    email: 'admin@beautysalon.com',
    password: 'Admin@123',
    role: 'ADMIN',
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'Sarah@123',
    role: 'CUSTOMER',
  },
  {
    name: 'Emma Wilson',
    email: 'emma@example.com',
    password: 'Emma@123',
    role: 'CUSTOMER',
  },
  {
    name: 'Jessica Brown',
    email: 'jessica@example.com',
    password: 'Jessica@123',
    role: 'CUSTOMER',
  },
  {
    name: 'Lisa Anderson',
    email: 'lisa@example.com',
    password: 'Lisa@123',
    role: 'CUSTOMER',
  },
];

const staffMembers = [
  {
    name: 'Michael Chen',
    email: 'michael.chen@beautysalon.com',
    role: 'Hair Stylist',
  },
  {
    name: 'Rachel Martinez',
    email: 'rachel.martinez@beautysalon.com',
    role: 'Makeup Artist',
  },
  {
    name: 'David Kim',
    email: 'david.kim@beautysalon.com',
    role: 'Massage Therapist',
  },
  {
    name: 'Angela Thompson',
    email: 'angela.thompson@beautysalon.com',
    role: 'Skin Care Specialist',
  },
];

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Clean up any old test services with wrong prices (e.g. 30 or 40)
  console.log('🧹 Cleaning up invalid test services (price 30 or 40)...');
  const deleted = await prisma.service.deleteMany({
    where: {
      price: { in: [30, 40] },
    },
  });
  console.log(`🗑️ Removed ${deleted.count} invalid services\n`);

  // Seed Services
  console.log('📦 Seeding services...');
  for (const service of services) {
    await prisma.service.upsert({
      where: { name: service.name },
      // This ensures existing services get their price/duration/description updated
      update: {
        description: service.description,
        duration: service.duration,
        price: service.price,
      },
      create: service,
    });
  }
  console.log(`✅ ${services.length} services seeded/updated\n`);

  // Seed Users
  console.log('👥 Seeding test users...');
  for (const userData of testUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        isActive: true,
      },
    });
  }
  console.log(`✅ ${testUsers.length} users seeded\n`);

  // Seed Staff
  console.log('👔 Seeding staff members...');
  for (const staff of staffMembers) {
    await prisma.staff.upsert({
      where: { email: staff.email },
      update: {},
      create: staff,
    });
  }
  console.log(`✅ ${staffMembers.length} staff members seeded\n`);

  // Seed Sample Appointments (for existing users)
  console.log('📅 Seeding sample appointments...');
  const users = await prisma.user.findMany({ where: { role: 'CUSTOMER' } });
  const allServices = await prisma.service.findMany();
  const allStaff = await prisma.staff.findMany();

  if (users.length > 0 && allServices.length > 0 && allStaff.length > 0) {
    const appointmentDates = [
      new Date(2026, 1, 2, 10, 0), // Feb 2, 10:00 AM
      new Date(2026, 1, 5, 14, 30), // Feb 5, 2:30 PM
      new Date(2026, 1, 10, 11, 0), // Feb 10, 11:00 AM
      new Date(2026, 1, 15, 16, 0), // Feb 15, 4:00 PM
    ];

    for (let i = 0; i < users.length && i < appointmentDates.length; i++) {
      const randomService = allServices[Math.floor(Math.random() * allServices.length)];
      const randomStaff = allStaff[Math.floor(Math.random() * allStaff.length)];

      await prisma.appointment.upsert({
        where: {
          id: i + 1,
        },
        update: {
          staffId: randomStaff.id,
          appointmentDate: appointmentDates[i],
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
        },
        create: {
          userId: users[i].id,
          serviceId: randomService.id,
          staffId: randomStaff.id,
          appointmentDate: appointmentDates[i],
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          notes: `Sample appointment for ${users[i].name}`,
        },
      });
    }
    console.log(`✅ Sample appointments seeded\n`);
  }

  console.log('✨ Database seeding completed successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  testUsers.forEach((user) => {
    console.log(`\n${user.role === 'ADMIN' ? '👨‍💼' : '👩'} ${user.name} (${user.role})`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${user.password}`);
  });
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });