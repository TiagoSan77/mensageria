import { Router } from "express";
import { client } from "../index";

const router = Router();

router.post('/enviar', (req, res) => {
    const { number, message } = req.body;
    client.sendMessage(number, message);
    res.send('Mensagem enviada com sucesso!');
});

export default router;