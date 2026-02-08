
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'staff@beauty.com';
    const password = 'password123';
    const name = 'Jessica Staff';

    // Check if user exists
    let user = await prisma.user.findUnique({
        where: { email },
    });

    if (user) {
        console.log('User already exists. Updating role to STAFF if needed...');
    } else {
        console.log('Creating new staff user...');
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'STAFF',
            },
        });
    }

    // Check if staff profile exists
    const staff = await prisma.staff.findUnique({
        where: { userId: user.id },
    });

    if (!staff) {
        console.log('Creating staff profile...');
        await prisma.staff.create({
            data: {
                userId: user.id,
                name: user.name,
                email: user.email,
                role: 'Senior Stylist',
                bio: 'Expert stylist with 5 years of experience.',
                skills: 'Hair Cutting, Coloring, Styling',
            },
        });
    } else {
        console.log('Staff profile already exists.');
    }

    console.log('-----------------------------------');
    console.log('Staff Account Ready:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('-----------------------------------');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
