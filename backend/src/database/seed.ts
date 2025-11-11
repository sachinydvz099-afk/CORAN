import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { VoiceStyle } from '../models/VoiceStyle';
import { connectDatabase } from '../config/database';

dotenv.config();

async function seed() {
  console.log('Seeding database...');

  await connectDatabase();

  // Create voice styles
  const voiceStyles = await VoiceStyle.insertMany([
    {
      name: 'American Male – Neutral',
      language: 'en-US',
      accent: 'American',
      description: 'Male voice, neutral tone',
      sampleUrl: 'https://cdn.example.com/voices/1_sample.mp3',
    },
    {
      name: 'British Female – Dramatic',
      language: 'en-GB',
      accent: 'British',
      description: 'Female voice, cinematic dramatic tone',
      sampleUrl: 'https://cdn.example.com/voices/2_sample.mp3',
    },
    {
      name: 'American Female – Cheerful',
      language: 'en-US',
      accent: 'American',
      description: 'Female voice, cheerful and upbeat',
      sampleUrl: 'https://cdn.example.com/voices/3_sample.mp3',
    },
    {
      name: 'Australian Male – Adventure',
      language: 'en-AU',
      accent: 'Australian',
      description: 'Male voice, adventurous tone',
      sampleUrl: 'https://cdn.example.com/voices/4_sample.mp3',
    },
  ]);

  console.log(`Created ${voiceStyles.length} voice styles`);
  console.log('Seeding completed!');
  
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seeding error:', error);
  process.exit(1);
});
