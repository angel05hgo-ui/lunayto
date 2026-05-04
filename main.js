/* ══════════════════════════════════════════
   Luna y Tom – Pastelería Artesanal
   main.js
   ══════════════════════════════════════════ */
 
/* ── DATOS DE PRODUCTOS ── */
const productos = [
  { id: 1, nombre: "Torta Red Velvet",      precio: 18900, img: "torta-red-velvet.jpg",    categoria: "Tortas" },
  { id: 2, nombre: "Macarons (12 u.)",      precio: 9900,  img: "macarons.jpg",             categoria: "Petit Four" },
  { id: 3, nombre: "Galletas Artesanales",  precio: 6900,  img: "galletas.jpg",             categoria: "Galletas" },
  { id: 4, nombre: "Cupcakes Red Velvet",   precio: 7900,  img: "cupcakes-red-velvet.jpg",  categoria: "Cupcakes" },
  { id: 5, nombre: "Muffins Surtidos",      precio: 5900,  img: "muffins.jpg",              categoria: "Muffins" },
  { id: 6, nombre: "Torta Personalizada",   precio: 35000, img: null,                       categoria: "Especial" },
];
 
/* ── CARRITO ── */
let carrito = [];
 
function agregarAlCarrito(id) {
  const prod = productos.find(p => p.id === id);
  const item = carrito.find(c => c.id === id);
  if (item) {
    item.cantidad++;
  } else {
    carrito.push({ ...prod, cantidad: 1 });
  }
  actualizarContadorCarrito();
  mostrarToast(`🛒 ${prod.nombre} agregado al carrito`, '#e91e8c');
}
 
function actualizarContadorCarrito() {
  const total = carrito.reduce((s, c) => s + c.cantidad, 0);
  const el = document.getElementById('cartCount');
  if (el) el.textContent = total;
}
 
function verCarrito() {
  if (carrito.length === 0) {
    mostrarToast('Tu carrito está vacío 🛒', '#7a5c5c');
    return;
  }
  const lista = carrito.map(c =>
    `• ${c.nombre} × ${c.cantidad} = $${(c.precio * c.cantidad).toLocaleString('es-CL')}`
  ).join('\n');
  const total = carrito.reduce((s, c) => s + c.precio * c.cantidad, 0);
  alert(`🛒 Tu carrito:\n\n${lista}\n\n💰 Total: $${total.toLocaleString('es-CL')}`);
}
 
/* ── RENDERIZAR PRODUCTOS ── */
function renderProductos() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
 
  grid.innerHTML = productos.map(p => `
    <div class="col-sm-6 col-lg-4 fade-in">
      <div class="product-card">
        ${p.img
          ? `<img src="${p.img}" alt="${p.nombre}" class="product-img" />`
          : `<div class="card-img-placeholder">✨</div>`
        }
        <div class="card-body">
          <span class="badge-luna mb-2 d-inline-block">${p.categoria}</span>
          <h5 class="card-title">${p.nombre}</h5>
          <p class="price">$${p.precio.toLocaleString('es-CL')}</p>
          <button class="btn-luna w-100" onclick="agregarAlCarrito(${p.id})">
            <i class="bi bi-bag-plus me-1"></i> Agregar
          </button>
        </div>
      </div>
    </div>
  `).join('');
 
  observarFadeIn();
}
 
/* ── VALIDACIÓN FORMULARIO PEDIDO ── */
function initFormulario() {
  const form = document.getElementById('formPedido');
  if (!form) return;
 
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validarFormulario()) return;
    mostrarResumen();
    mostrarToast('¡Pedido enviado con éxito! Te contactaremos pronto 🌸', '#2e7d32');
    this.reset();
    document.getElementById('resumenPedido').style.display = 'none';
  });
}
 
function validarFormulario() {
  let valido = true;
  const campos = ['nombre', 'email', 'telefono', 'producto', 'cantidad'];
 
  campos.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!el.checkValidity()) {
      el.classList.add('is-invalid');
      valido = false;
    } else {
      el.classList.remove('is-invalid');
    }
  });
 
  // Validar radio entrega
  const entrega = document.querySelector('input[name="entrega"]:checked');
  const errEntrega = document.getElementById('entregaError');
  if (errEntrega) {
    if (!entrega) {
      errEntrega.textContent = 'Selecciona el tipo de entrega.';
      errEntrega.style.display = 'block';
      valido = false;
    } else {
      errEntrega.style.display = 'none';
    }
  }
 
  return valido;
}
 
function mostrarResumen() {
  const nombre   = document.getElementById('nombre').value;
  const producto = document.getElementById('producto').value;
  const cantidad = document.getElementById('cantidad').value;
  const entrega  = document.querySelector('input[name="entrega"]:checked')?.value;
  const extras   = [];
  if (document.getElementById('velas')?.checked)   extras.push('Velas');
  if (document.getElementById('tarjeta')?.checked) extras.push('Tarjeta de regalo');
  if (document.getElementById('caja')?.checked)    extras.push('Caja decorativa');
 
  const resumen = document.getElementById('resumenPedido');
  if (!resumen) return;
 
  resumen.style.display = 'block';
  resumen.innerHTML = `
    <div class="alert" style="background:var(--rosa-claro);border:1.5px solid var(--rosa-borde);border-radius:12px;">
      <strong style="font-family:'Playfair Display',serif;">✅ Resumen de tu pedido</strong><br>
      👤 <b>Nombre:</b> ${nombre}<br>
      🧁 <b>Producto:</b> ${producto} × ${cantidad}<br>
      🚚 <b>Entrega:</b> ${entrega === 'domicilio' ? 'Envío a domicilio' : 'Retiro en local'}<br>
      ${extras.length ? `🎁 <b>Extras:</b> ${extras.join(', ')}<br>` : ''}
      <small class="text-muted">Te enviaremos una confirmación al correo registrado.</small>
    </div>
  `;
}
 
function resetForm() {
  const form = document.getElementById('formPedido');
  if (form) form.reset();
  document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  const resumen = document.getElementById('resumenPedido');
  if (resumen) resumen.style.display = 'none';
  const errEntrega = document.getElementById('entregaError');
  if (errEntrega) errEntrega.style.display = 'none';
}
 
/* ── TOAST ── */
function mostrarToast(mensaje, color = '#e91e8c') {
  const el = document.getElementById('toastMsg');
  if (!el) return;
  el.style.backgroundColor = color;
  document.getElementById('toastText').textContent = mensaje;
  bootstrap.Toast.getOrCreateInstance(el, { delay: 3500 }).show();
}
 
/* ── FADE-IN AL HACER SCROLL ── */
function observarFadeIn() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
 
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
}
 
/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  renderProductos();
  initFormulario();
  observarFadeIn();
});