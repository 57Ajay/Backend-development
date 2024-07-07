import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Console } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
    const data = await fs.readFile(join(__dirname, 'files', 'starter.txt'), 'utf-8');
    console.log(data);
} catch (err) {
    console.error('There was an error reading the file', err);
}

console.log("Ajay is here");

try {
    await fs.writeFile(join(__dirname, 'files', 'write.txt'), 'This is the content to write');
    console.log('Write completed');
} catch (error) {
    console.error(`There was an error writing the file: ${error}`);
}

process.on('uncaughtException', err => {
    console.error('There was an uncaught Error', err);
    process.exit(1);
});