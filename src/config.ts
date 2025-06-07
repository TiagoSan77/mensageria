import dotenv from 'dotenv';
import path from 'path';

// Carrega o .env da raiz do projeto
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

export const DATABASE_URI = process.env.DATABASE_URI || '';
export const PORT = process.env.PORT;
// export const SECRET = process.env.JWT_SECRET as string


// console.log('DATABASE_URI:', DATABASE_URI); // Isso está funcionando
// console.log('PORT', PORT); // Isso está funcionando
// console.log('SECRET', SECRET); // Isso está funcionando