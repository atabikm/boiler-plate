import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting LMS database seeding...');

  const hashedPassword = await bcrypt.hash('bikibiki', 10);
  await prisma.user.upsert({
    where: { email: 'biki@here.com' },
    update: { password: hashedPassword },
    create: {
      email: 'biki@here.com',
      name: 'System Admin',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log('LMS database seeding completed successfully.');
}

main()
  .catch((error) => {
    console.error('LMS database seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
