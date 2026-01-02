
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import data
import { meatRecipes } from './recipe_data/meat.js';
import { seafoodRecipes } from './recipe_data/seafood.js';
import { noodleRecipes } from './recipe_data/noodle.js';
import { riceRecipes } from './recipe_data/rice.js';
import { snackRecipes } from './recipe_data/snack.js';
import { vegetableRecipes } from './recipe_data/vegetable.js';
import { soupRecipes } from './recipe_data/soup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../public/recipes');

const writeJson = (filename, data) => {
    const filePath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Wrote ${data.length} recipes to ${filename}`);
};

const main = () => {
    // Ensure output directory exists (it should, but safety first)
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    console.log('Generating bulk recipes...');

    writeJson('meat.json', meatRecipes);
    writeJson('seafood.json', seafoodRecipes);
    writeJson('noodle.json', noodleRecipes);
    writeJson('rice.json', riceRecipes);
    writeJson('snack.json', snackRecipes);
    writeJson('vegetable.json', vegetableRecipes);
    writeJson('soup.json', soupRecipes);

    const total = meatRecipes.length + seafoodRecipes.length + noodleRecipes.length + riceRecipes.length + snackRecipes.length + vegetableRecipes.length + soupRecipes.length;
    console.log(`All recipes generated successfully! Total count: ${total}`);
};

main();
