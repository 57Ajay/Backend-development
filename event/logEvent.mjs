import { format } from 'date-fns';
import { v7 as uuid } from 'uuid';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logEvent = async (message) => {
    const dateTime = format(new Date(), 'yy/MM/dd\tHH:mm:ss');
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    console.log(logItem);

    try {
        const logsDir = join(__dirname, 'logs');
        const logFile = join(logsDir, 'eventLog.txt');

        if (!existsSync(logsDir)) {
            await fs.mkdir(logsDir);
        }

        await fs.appendFile(logFile, logItem);
    } catch (error) {
        console.error('Error writing to log file:', error);
    }
};

export default logEvent;