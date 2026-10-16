import Product from '../models/Product.js';
import { sampleProducts } from './productsData.js';
import { connectDB, closeDB } from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

export const seedProductsIfNeeded = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('[Seeder] Product collection empty. Seeding catalog...');
      await Product.insertMany(sampleProducts);
      console.log(`[Seeder] Successfully seeded ${sampleProducts.length} products.`);
    } else {
      console.log(`[Seeder] Product collection has ${count} existing products.`);
    }
  } catch (err) {
    console.error('[Seeder Error] Failed to auto-seed products:', err.message);
  }
};

const runSeederCLI = async () => {
  try {
    await connectDB();
    console.log('[Seeder CLI] Clearing existing products...');
    await Product.deleteMany({});
    console.log('[Seeder CLI] Inserting fresh sample products...');
    await Product.insertMany(sampleProducts);
    console.log(`[Seeder CLI] Successfully inserted ${sampleProducts.length} products.`);
    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seeder CLI Error]', error);
    process.exit(1);
  }
};

// If run directly via node seeder.js
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeederCLI();
}
