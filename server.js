import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// ✅ Carga la clave secreta de Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ CORS para GitHub Pages
app.use(cors({
  origin: 'https://adrianrs928222.github.io',
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// ✅ Ruta de pago con Stripe
app.post('/create-checkout-session', async (req, res) => {
  try {
    const items = req.body.items;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Carrito vacío o mal formado' });
    }

    const line_items = items.map(item => {
      if (!item.name || typeof item.price !== 'number') {
        throw new Error('Formato incorrecto en los productos');
      }

      return {
        price_data: {
          currency: 'eur',
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100)
        },
        quantity: 1
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'https://tienda-2-7fnq.onrender.com/success.html',
      cancel_url: 'https://tienda-2-7fnq.onrender.com/cancel.html'
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error('❌ ERROR al crear sesión Stripe:', error.message);
    res.status(500).json({ error: 'Error al crear la sesión de pago' });
  }
});

// ✅ Escuchar el puerto que Render asigna
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
