import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import router from './routes/ClientRoutes';
import mongoose from 'mongoose';
import { MongoStore } from 'wwebjs-mongo';
import { Client, RemoteAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode';
import { DATABASE_URI, PORT } from './config';

dotenv.config();
const app = express();
const port = PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')))

export let client: Client;
let qrCodeData = '';

mongoose.connect(DATABASE_URI).then(() => {

    const store = new MongoStore({ mongoose: mongoose });
    client = new Client({
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 300000//Tempo em milissegundos para sincronizar o backup
        })
    })

    client.on('qr', async (qr) => {
        console.log('QR RECEBIDO:', qr);
        qrCodeData = await qrcode.toDataURL(qr); // converte para imagem base64
    });
    
    client.on('remote_session_saved', () => {
        console.log('✅ Sessão salva no MongoDB com sucesso.');
    });

    client.on('message_create', message => {
        console.log('Mensagem Recebida:', message.body);
        if (message.body === '!ping') {
            message.reply('pong');
        }
    });

    client.once('ready', () => {
        console.log('O qrcode foi autorizado e o cliente esta pronto!');
        // Você pode enviar mensagens aqui, pois o cliente está pronto
    });

    client.initialize()
        .then(() => console.log('Conectado com sucesso!'))
        .catch(() => console.log('Erro ao conectar ao WhatsApp'));
});

//testar qrcode
// app.get('/qrcode', (req, res) => {
//     res.send(`
//         <html>
//             <body style="font-family:sans-serif;text-align:center;padding-top:50px">
//                 <h1>QR Code do WhatsApp</h1>
//                 ${qrCodeData
//             ? `<img src="${qrCodeData}" alt="QR Code"/>`
//             : '<p>Aguardando geração do QR Code...</p>'
//         }
//                 <p>Atualize esta página se necessário</p>
//             </body>
//         </html>
//     `);
// });

app.get('/qrcode', (req, res) => {
    res.json({ qr: qrCodeData });
});

app.use('/', router)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});