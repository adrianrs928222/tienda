import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Para cargar variables del .env

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// SOLO permite peticiones desde tu frontend en Vercel
const corsOptions = {
  origin: 'https://tu-frontend.vercel.app', // ⬅️ CAMBIA ESTO por tu dominio real de Vercel
  methods: ['POST'],
  credentials: false
};

app.use(cors(corsOptions));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const items = req.body.items || [];

  const line_items = items.map(item => ({
    price_data: {
      currency: 'eur',
      product_data: { name: item.name },
      unit_amount: item.price * 100,
    },
    quantity: 1,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${req.headers.origin}/success.html`,
      cancel_url: `${req.headers.origin}/cancel.html`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

