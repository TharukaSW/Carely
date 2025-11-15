import { db } from '../config/firebase';

const doctors = [
  {
    name: 'Dr. Suresh Perera',
    specialty: 'Physician',
    location: 'Asiri, Kandy',
    email: 'suresh.perera@asiri.lk',
    bio: 'Dr. Suresh Perera is a caring and skilled doctor specializing in family medicine, pediatrics, Physician. With over 10 years of experience, Dr. Suresh is dedicated to providing personalized treatment and improving patients’ quality of life. Known for a patient–first approach, they focus on both prevention and treatment to support long–term health. Beyond clinical work, Dr. Suresh Perera is passionate about educating communities and promoting healthier lifestyles.',
    rating: 4.7,
    reviews: 1207,
    locations: ['Asiri, Kandy', 'Suwasewana, Kandy'],
  },
  {
    name: 'Dr. Nadeesha Fernando',
    specialty: 'Cardiologist',
    location: 'Suwasewana, Kandy',
    email: 'nadeesha.fernando@suwasewana.lk',
    bio: 'Dr. Nadeesha Fernando is a leading cardiologist with a passion for heart health and patient education. She has over 15 years of experience and is known for her compassionate care and expertise in cardiovascular medicine.',
    rating: 4.9,
    reviews: 980,
    locations: ['Suwasewana, Kandy'],
  },
  {
    name: 'Dr. Chaminda Silva',
    specialty: 'Dermatologist',
    location: 'Asiri, Kandy',
    email: 'chaminda.silva@asiri.lk',
    bio: 'Dr. Chaminda Silva specializes in skin care and dermatology, helping patients achieve healthy skin through personalized treatment plans. He is highly regarded for his research and patient-centered approach.',
    rating: 4.8,
    reviews: 1120,
    locations: ['Asiri, Kandy'],
  },
];

async function seed() {
  for (const doc of doctors) {
    const ref = db.collection('users').doc();
    await ref.set({
      ...doc,
      id: ref.id,
      role: 'doctor',
      createdAt: new Date(),
    });
    console.log(`Seeded doctor: ${doc.name}`);
  }
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
