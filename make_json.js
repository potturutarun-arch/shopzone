import fs from 'fs';
import { generateDatabase } from './src/data/mockDataGenerator.js';

const data = generateDatabase();
fs.writeFileSync('products.json', JSON.stringify(data, null, 2));
console.log('Created products.json with ' + data.length + ' products.');
