import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes';

const app = express();

// ==========================================
// GLOBAL MIDDLEWARE
// Semua middleware global harus terpasang SEBELUM router,
// agar ikut memproses setiap request yang masuk ke router.
// ==========================================
app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
}));
app.use(express.json());

// ==========================================
// HEALTH CHECK
// ==========================================
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'LMS Express Backend Running' });
});

// ==========================================
// ROUTES
// Modul baru didaftarkan di sini: app.use('/api/v1/<module>', <module>Router)
// ==========================================
app.use('/api/v1/auth', authRouter);

export default app;