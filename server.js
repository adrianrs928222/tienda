import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const corsOptions = {
  origin: 'https://tienda-2-7fnq.onrender.com', // 🟡 PON AQUÍ TU URL DE VERCE
  methods: ['POST'],
  credentials: false
};

app.use(cors(corsOptions));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const items = req.body.items || [];

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Carrito vacío' });
  }

  try {
    const line_items = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${req.headers.origin}/success.html`,
      cancel_url: `${req.headers.origin}/cancel.html`,
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error('❌ Stripe error:', err.message);
    res.status(500).json({ error: 'Error al crear sesión de pago' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
