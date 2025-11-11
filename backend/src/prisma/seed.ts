import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create voice styles
  const voiceStyles = await Promise.all([
    prisma.voiceStyle.create({
      data: {
        name: 'American Male – Neutral',
        language: 'en-US',
        accent: 'American',
        description: 'Male voice, neutral tone',
        sampleUrl: 'https://cdn.example.com/voices/1_sample.mp3',
      },
    }),
    prisma.voiceStyle.create({
      data: {
        name: 'British Female – Dramatic',
        language: 'en-GB',
        accent: 'British',
        description: 'Female voice, cinematic dramatic tone',
        sampleUrl: 'https://cdn.example.com/voices/2_sample.mp3',
      },
    }),
    prisma.voiceStyle.create({
      data: {
        name: 'American Female – Cheerful',
        language: 'en-US',
        accent: 'American',
        description: 'Female voice, cheerful and upbeat',
        sampleUrl: 'https://cdn.example.com/voices/3_sample.mp3',
      },
    }),
    prisma.voiceStyle.create({
      data: {
        name: 'Australian Male – Adventure',
        language: 'en-AU',
        accent: 'Australian',
        description: 'Male voice, adventurous tone',
        sampleUrl: 'https://cdn.example.com/voices/4_sample.mp3',
      },
    }),
  ]);

  console.log(`Created ${voiceStyles.length} voice styles`);
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
