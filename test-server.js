import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Servidor funcionando correctamente' });
});

app.listen(PORT, () => {
    console.log(`Servidor de prueba corriendo en http://localhost:${PORT}`);
}); 