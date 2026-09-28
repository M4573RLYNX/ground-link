// scripts/seed-properties.ts
// Inserts sample listings. Safe to re-run: listings are matched by title and updated in place.
import 'dotenv/config';
import mongoose from 'mongoose';
import Property from '../src/models/Property.js';

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=1600&q=80&auto=format&fit=crop`;

const agents = {
  mary: { name: 'Mary Tekulu', phone: '+677 7412 358', email: 'mary@groundlink.sb' },
  john: { name: 'John Maeniu', phone: '+677 7569 104', email: 'john@groundlink.sb' },
};

const properties = [
  {
    title: 'Modern Family Home in Tasahe',
    description:
      'A bright four-bedroom home on the Tasahe ridge with sweeping views over Iron Bottom Sound. Open-plan living and dining flow onto a wide covered veranda, perfect for evening breezes. Fully fenced with a secure double carport and established tropical garden.',
    price: 3_850_000,
    type: 'house',
    image: img('1600596542815-ffad4c1539a9'),
    images: [img('1600585154340-be6161a56a0c'), img('1600607687939-ce8a6c25118c')],
    featured: true,
    location: 'Tasahe, Honiara',
    coordinates: { lat: -9.4265, lng: 159.9241 },
    address: 'Tasahe Ridge Road',
    province: 'Guadalcanal',
    bedrooms: 4,
    bathrooms: 2,
    landArea: 1200,
    buildingArea: 220,
    status: 'for-sale',
    yearBuilt: 2019,
    features: ['Ocean views', 'Covered veranda', 'Double carport', 'Water tank', 'Security fence', 'Solar hot water'],
    agent: agents.mary,
  },
  {
    title: 'Beachfront Villa, Gizo',
    description:
      'Wake up to turquoise water at this three-bedroom villa just steps from the lagoon. Timber and glass construction, private jetty and an outdoor shower. An ideal holiday home or boutique guesthouse opportunity in the heart of the Western Province dive scene.',
    price: 5_200_000,
    type: 'beachfront',
    image: img('1499793983690-e29da59ef1c2'),
    images: [img('1507525428034-b723cf961d3e'), img('1512917774080-9991f1c4c750')],
    featured: true,
    location: 'Gizo',
    coordinates: { lat: -8.1030, lng: 156.8419 },
    address: 'Lagoon Front, Gizo Island',
    province: 'Western',
    bedrooms: 3,
    bathrooms: 2,
    landArea: 2500,
    buildingArea: 180,
    status: 'for-sale',
    yearBuilt: 2016,
    features: ['Private jetty', 'Direct beach access', 'Outdoor shower', 'Rainwater tanks', 'Generator backup'],
    agent: agents.john,
  },
  {
    title: 'Executive Apartment near Point Cruz',
    description:
      'Fully furnished two-bedroom apartment within walking distance of the Honiara CBD, banks and the waterfront. Air-conditioned throughout, 24-hour security and backup power. Suits expatriate professionals and NGO staff.',
    price: 14_000,
    type: 'apartment',
    image: img('1522708323590-d24dbb6b0267'),
    images: [img('1502672260266-1c1ef2d93688')],
    featured: true,
    location: 'Point Cruz, Honiara',
    coordinates: { lat: -9.4296, lng: 159.9546 },
    address: 'Mendana Avenue',
    province: 'Guadalcanal',
    bedrooms: 2,
    bathrooms: 1,
    buildingArea: 95,
    status: 'for-rent',
    yearBuilt: 2018,
    features: ['Fully furnished', 'Air conditioning', '24/7 security', 'Backup generator', 'Walk to CBD'],
    agent: agents.mary,
  },
  {
    title: 'Freehold Land, Henderson',
    description:
      'Flat, cleared freehold block close to Henderson International Airport and the main Kukum Highway. Power and water available at the boundary. Well suited to residential subdivision or a light-industrial yard.',
    price: 950_000,
    type: 'land',
    image: img('1500382017468-9049fed747ef'),
    images: [],
    featured: false,
    location: 'Henderson',
    coordinates: { lat: -9.4280, lng: 160.0500 },
    address: 'Off Kukum Highway',
    province: 'Guadalcanal',
    landArea: 5000,
    status: 'for-sale',
    features: ['Freehold title', 'Cleared and level', 'Road frontage', 'Power at boundary', 'Near airport'],
    agent: agents.john,
  },
  {
    title: 'Commercial Office Building, Chinatown',
    description:
      'Two-storey concrete commercial building with ground-floor retail frontage and upstairs office space. Established tenancy area on a busy corner with strong foot traffic.',
    price: 7_600_000,
    type: 'commercial',
    image: img('1486406146926-c627a92ad1ab'),
    images: [img('1497366216548-37526070297c')],
    featured: false,
    location: 'Chinatown, Honiara',
    coordinates: { lat: -9.4330, lng: 159.9630 },
    address: 'Chinatown Main Street',
    province: 'Guadalcanal',
    bathrooms: 3,
    landArea: 600,
    buildingArea: 480,
    status: 'under-offer',
    yearBuilt: 2010,
    features: ['Retail frontage', 'Upstairs offices', 'Concrete construction', 'Corner site', 'Off-street parking'],
    agent: agents.mary,
  },
  {
    title: 'Hillside Villa with Pool, Lengakiki',
    description:
      'Luxury five-bedroom villa with an infinity pool overlooking Honiara and Savo Island. Designed for entertaining with a large outdoor kitchen, staff quarters and landscaped terraces.',
    price: 6_900_000,
    type: 'villa',
    image: img('1613490493576-7fde63acd811'),
    images: [img('1512917774080-9991f1c4c750'), img('1600607687939-ce8a6c25118c')],
    featured: true,
    location: 'Lengakiki, Honiara',
    coordinates: { lat: -9.4380, lng: 159.9500 },
    address: 'Lengakiki Ridge',
    province: 'Guadalcanal',
    bedrooms: 5,
    bathrooms: 4,
    landArea: 2000,
    buildingArea: 380,
    status: 'for-sale',
    yearBuilt: 2021,
    features: ['Infinity pool', 'Outdoor kitchen', 'Staff quarters', 'Panoramic views', 'Solar power', 'Security gate'],
    agent: agents.john,
  },
  {
    title: 'Family House for Rent, Kukum',
    description:
      'Comfortable three-bedroom home on a quiet street in Kukum, close to schools, the national university campus and shops. Includes a small yard and covered parking.',
    price: 9_500,
    type: 'house',
    image: img('1570129477492-45c003edd2be'),
    images: [img('1564013799919-ab600027ffc6')],
    featured: false,
    location: 'Kukum, Honiara',
    coordinates: { lat: -9.4310, lng: 159.9800 },
    address: 'Kukum Back Road',
    province: 'Guadalcanal',
    bedrooms: 3,
    bathrooms: 1,
    landArea: 700,
    buildingArea: 140,
    status: 'for-rent',
    yearBuilt: 2012,
    features: ['Near schools', 'Covered parking', 'Fenced yard', 'Water tank'],
    agent: agents.mary,
  },
  {
    title: 'Waterfront Lot, Munda',
    description:
      'Rare waterfront parcel on the Roviana Lagoon, minutes from Munda airport. Gentle slope to the water with established coconut palms — an excellent site for an eco-lodge or private residence.',
    price: 1_400_000,
    type: 'land',
    image: img('1507525428034-b723cf961d3e'),
    images: [],
    featured: false,
    location: 'Munda',
    coordinates: { lat: -8.3272, lng: 157.2631 },
    address: 'Roviana Lagoon',
    province: 'Western',
    landArea: 8000,
    status: 'for-sale',
    features: ['Lagoon frontage', 'Near airport', 'Coconut palms', 'Registered title'],
    agent: agents.john,
  },
  {
    title: 'Townhouse Condo, Kola Ridge',
    description:
      'Low-maintenance two-bedroom townhouse in a gated complex with shared pool. Modern kitchen, split-system air conditioning and a private courtyard.',
    price: 1_750_000,
    type: 'condo',
    image: img('1545324418-cc1a3fa10c00'),
    images: [img('1502672260266-1c1ef2d93688')],
    featured: false,
    location: 'Kola Ridge, Honiara',
    coordinates: { lat: -9.4400, lng: 159.9700 },
    address: 'Kola Ridge Estate',
    province: 'Guadalcanal',
    bedrooms: 2,
    bathrooms: 2,
    buildingArea: 110,
    status: 'for-sale',
    yearBuilt: 2020,
    features: ['Gated complex', 'Shared pool', 'Air conditioning', 'Private courtyard'],
    agent: agents.mary,
  },
  {
    title: 'Colonial-Era Home, Auki',
    description:
      'Characterful four-bedroom timber home overlooking Auki harbour on Malaita. Recently re-roofed with a new kitchen, set on a generous lot with fruit trees.',
    price: 1_200_000,
    type: 'house',
    image: img('1580587771525-78b9dba3b914'),
    images: [],
    featured: false,
    location: 'Auki',
    coordinates: { lat: -8.7676, lng: 160.7034 },
    address: 'Harbour View Road',
    province: 'Malaita',
    bedrooms: 4,
    bathrooms: 1,
    landArea: 1500,
    buildingArea: 170,
    status: 'sold',
    yearBuilt: 1975,
    features: ['Harbour views', 'New roof', 'Fruit trees', 'Large lot'],
    agent: agents.john,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');

    let created = 0;
    let updated = 0;
    for (const p of properties) {
      const res = await Property.updateOne({ title: p.title }, { $set: p }, { upsert: true, runValidators: true });
      if (res.upsertedCount) created++;
      else updated++;
    }
    console.log(`Seed complete: ${created} created, ${updated} updated.`);
  } catch (err) {
    console.error('Error seeding properties:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
