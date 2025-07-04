const products = document.querySelectorAll('.add-to-cart');
const cartCount = document.getElementById('cartCount');
const cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartModal = document.getElementById('cart-modal');
const cartIcon = document.getElementById('cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const emptyCartButton = document.getElementById('empty-cart-button');
const checkoutButton = document.getElementById('checkout-button');

const inicioLink = document.getElementById('inicioLink');
const hombreLink = document.getElementById('hombreLink');
const mujerLink = document.getElementById('mujerLink');

// Añadir producto al carrito
products.forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    cart.push({ name, price });
    updateCart();
    alert(`${name} añadido al carrito`);
  });
});

// Mostrar/ocultar carrito
cartIcon.addEventListener('click', () => {
  cartModal.classList.toggle('open');
});

// Vaciar carrito
emptyCartButton.addEventListener('click', () => {
  cart.length = 0;
  updateCart();
});

// Ir al inicio, hombre, mujer (opcional si tienes scroll o filtros)
inicioLink.addEventListener('click', () => window.scrollTo(0, 0));
hombreLink.addEventListener('click', () => window.scrollTo(0, 400));
mujerLink.addEventListener('click', () => window.scrollTo(0, 800));

// Actualizar carrito en pantalla
function updateCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  cartCount.textContent = cart.length;
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - ${item.price.toFixed(2)} €`;
    cartItems.appendChild(li);
    total += item.price;
  });

  cartTotal.textContent = `Total: ${total.toFixed(2)} €`;
}

// Pagar (usa backend en Render)
checkoutButton.addEventListener('click', async () => {
  const storedCart = JSON.parse(localStorage.getItem('cart')) || [];

  if (storedCart.length === 0) {
    alert("El carrito está vacío. Añade productos antes de pagar.");
    return;
  }

  try {
    const response = await fetch('https://tienda-2-7fnq.onrender.com/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: storedCart })
    });

    const data = await response.json();

    if (response.ok && data.url) {
      window.location.href = data.url;
    } else {
      console.error("Error de respuesta:", data);
      alert("Error al iniciar el pago.");
    }
  } catch (error) {
    console.error("Error de red:", error);
    alert("No se pudo conectar con el servidor.");
  }
});

// Iniciar con carrito actualizado
updateCart();
