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
  });
});

// Mostrar/ocultar carrito
cartIcon.addEventListener('click', () => {
  cartModal.classList.toggle('hidden');
});

// Vaciar carrito
emptyCartButton.addEventListener('click', () => {
  cart.length = 0;
  updateCart();
});

// Pagar (usa backend desde el mismo servidor)
checkoutButton.addEventListener('click', async () => {
  if (cart.length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }

  try {
    const response = await fetch('/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart })
    });

    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('No se recibió una URL de pago válida.');
    }
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    alert('Hubo un problema al iniciar el pago. Intenta más tarde.');
  }
});

// Filtros por categoría
inicioLink.addEventListener('click', () => {
  document.querySelectorAll('.product').forEach(p => p.style.display = '');
});
hombreLink.addEventListener('click', () => {
  document.querySelectorAll('.product').forEach(p => {
    p.style.display = p.dataset.category === 'hombre' ? '' : 'none';
  });
});
mujerLink.addEventListener('click', () => {
  document.querySelectorAll('.product').forEach(p => {
    p.style.display = p.dataset.category === 'mujer' ? '' : 'none';
  });
});

// Actualizar carrito
function updateCart() {
  cartCount.textContent = cart.length;
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - ${item.price}€ `;
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Eliminar';
    removeBtn.addEventListener('click', () => {
      cart.splice(index, 1);
      updateCart();
    });
    li.appendChild(removeBtn);
    cartItems.appendChild(li);
    total += item.price;
  });

  cartTotal.textContent = `Total: ${total}€`;
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Inicializar carrito
updateCart();
