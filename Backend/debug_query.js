const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debug() {
    try {
        console.log("Checking User roles...");
        const users = await prisma.user.findMany({
            take: 5,
            select: { id: true, role: true }
        });
        console.log("Users sample:", users);

        console.log("Checking Staff query...");
        const staff = await prisma.user.findMany({
            where: {
                role: {
                    in: ['ADMIN', 'STAFF']
                }
            },
            select: {
                id: true,
                role: true,
                staffProfile: {
                    select: { id: true }
                }
            }
        });
        console.log("Staff query success, count:", staff.length);
    } catch (error) {
        console.error("DEBUG ERROR:", error);
    } finally {
        await prisma.$disconnect();
    }
}

debug();
