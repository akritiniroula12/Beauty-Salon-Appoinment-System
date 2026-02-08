import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'staff@beautysalon.com';
  const passwordToTest = 'Staff@123';

  console.log('🔍 Testing Staff Login...\n');

  // Find the user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log('❌ User not found!');
    return;
  }

  console.log(`✅ User found: ${user.name}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Role: ${user.role}`);
  console.log(`   Hashed Password in DB: ${user.password.substring(0, 20)}...`);

  // Test password
  const isPasswordValid = await bcrypt.compare(passwordToTest, user.password);
  
  console.log(`\n🔐 Password Test: "${passwordToTest}"`);
  console.log(`   Match Result: ${isPasswordValid ? '✅ MATCHES' : '❌ DOES NOT MATCH'}`);

  if (!isPasswordValid) {
    console.log('\n⚠️  Password mismatch! Re-hashing with correct password...');
    const newHashedPassword = await bcrypt.hash(passwordToTest, 10);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { password: newHashedPassword }
    });
    
    console.log('✅ Password updated in database');
  }

  // Check if staff profile exists
  const staff = await prisma.staff.findUnique({
    where: { userId: user.id },
  });

  if (!staff) {
    console.log('\n⚠️  Staff profile not found! Creating one...');
    await prisma.staff.create({
      data: {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: 'Specialist',
      },
    });
    console.log('✅ Staff profile created');
  } else {
    console.log(`\n✅ Staff profile exists: ${staff.name}`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
