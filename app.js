/* ==========================================================
   Casta Exotics - app.js
   1) Catálogo dinámico (arreglo de objetos + map + innerHTML)
   2) Buscador y filtro por categoría (input / click + filter)
   3) Carrito con localStorage
   4) Modal de ficha técnica + validación de formulario (SweetAlert2)
   ========================================================== */

const WHATSAPP = "000000000000"; // <- cambia por el número real (con lada de país)

/* ---------- 1. DATOS ---------- */
const animales = [
  {
    id: 1, nombre: "Boa Constrictor", categoria: "Reptiles", especie: "Boa imperator", precio: 4500,
    imagen: "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?q=80&w=1000&auto=format&fit=crop",
    ficha: { temperatura: "Zona fría 26 °C, zona caliente 32 °C", habitat: "Terrario amplio con troncos para trepar y refugio", alimentacion: "Roedores adecuados a su tamaño cada 10-14 días", vida: "20-30 años", nivel: "Intermedio" }
  },
  {
    id: 2, nombre: "Python Regius", categoria: "Reptiles", especie: "Python regius", precio: 3200,
    imagen: "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?q=80&w=1000&auto=format&fit=crop",
    ficha: { temperatura: "Zona fría 26 °C, zona caliente 32 °C", habitat: "Terrario de 120 cm con escondites y humedad 50-60 %", alimentacion: "Ratones o ratas cada 7-14 días", vida: "20-30 años", nivel: "Principiante" }
  },
  {
    id: 3, nombre: "Gecko Leopardo", categoria: "Reptiles", especie: "Eublepharis macularius", precio: 1200,
    imagen: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?q=80&w=1000&auto=format&fit=crop",
    ficha: { temperatura: "Zona caliente 30-32 °C, noche 20-24 °C", habitat: "Terrario seco con sustrato seguro y cueva húmeda", alimentacion: "Grillos y gusanos de harina suplementados con calcio", vida: "15-20 años", nivel: "Principiante" }
  },
  {
    id: 4, nombre: "Gecko Crestado", categoria: "Reptiles", especie: "Correlophus ciliatus", precio: 1800,
    imagen: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?q=80&w=1000&auto=format&fit=crop",
    ficha: { temperatura: "22-26 °C (evitar más de 28 °C)", habitat: "Terrario vertical con plantas y humedad 60-80 %", alimentacion: "Dieta en polvo para crestados e insectos ocasionales", vida: "15-20 años", nivel: "Principiante" }
  },
  {
    id: 5, nombre: "Camaleón de Velo", categoria: "Reptiles", especie: "Chamaeleo calyptratus", precio: 2800,
    imagen: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1000&auto=format&fit=crop",
    ficha: { temperatura: "Zona de asoleo 32-35 °C, ambiente 24-28 °C", habitat: "Jaula con malla ventilada, mucho follaje y luz UVB", alimentacion: "Grillos, langostas y hojas verdes; agua por goteo", vida: "5-8 años", nivel: "Avanzado" }
  },
  {
    id: 6, nombre: "Caimán de Anteojos", categoria: "Reptiles", especie: "Caiman crocodilus", precio: 9500,
    imagen: "https://images.unsplash.com/photo-1471005197911-88e9d4a7834d?q=80&w=1000&auto=format&fit=crop",
    ficha: { temperatura: "Agua 28-30 °C, zona de asoleo 32-35 °C", habitat: "Estanque con área seca; requiere espacio muy grande al crecer", alimentacion: "Peces, insectos y roedores según edad", vida: "30-40 años", nivel: "Experto (requiere documentación legal)" }
  },
  {
    id: 7, nombre: "Ajolote Albino", categoria: "Anfibios", especie: "Ambystoma mexicanum", precio: 900,
    imagen: "",
    ficha: { temperatura: "Agua fría 16-18 °C", habitat: "Acuario sin grava gruesa, agua declorada y filtro suave", alimentacion: "Lombrices, pellets para ajolote y larvas", vida: "10-15 años", nivel: "Intermedio" }
  },
  {
    id: 8, nombre: "Rana de Ojos Rojos", categoria: "Anfibios", especie: "Agalychnis callidryas", precio: 1100,
    imagen: "",
    ficha: { temperatura: "24-28 °C de día, 20-22 °C de noche", habitat: "Terrario alto, muy húmedo (70-90 %), con plantas de hoja ancha", alimentacion: "Grillos y moscas de la fruta suplementados", vida: "5-10 años", nivel: "Intermedio" }
  },
  {
    id: 9, nombre: "Erizo Pigmeo", categoria: "Mamíferos", especie: "Atelerix albiventris", precio: 1500,
    imagen: "",
    ficha: { temperatura: "Ambiente estable de 24-27 °C", habitat: "Jaula amplia con rueda lisa, refugio y sustrato de papel", alimentacion: "Alimento para erizo o gato de calidad e insectos", vida: "4-6 años", nivel: "Intermedio" }
  }
];

/* ---------- Utilidades ---------- */
const $ = (sel) => document.querySelector(sel);
const money = (n) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
const normalizar = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const grid = $("#catalogGrid");
const searchInput = $("#searchInput");
const resultsInfo = $("#resultsInfo");

let categoriaActiva = "Todos";
let textoBusqueda = "";

/* ---------- 1 y 2. RENDER + FILTROS ---------- */
function tarjetaHTML(a) {
  const media = a.imagen
    ? `<div class="card__image" style="background-image:url('${a.imagen}')">`
    : `<div class="card__image card__image--empty"><i class="bi bi-image"></i>`;
  return `
    <article class="card">
      ${media}<span class="card__tag">${a.categoria}</span></div>
      <div class="card__content">
        <h3 class="card__title">${a.nombre}</h3>
        <p class="card__species">${a.especie}</p>
        <p class="card__price">${money(a.precio)}</p>
        <div class="card__actions">
          <button class="btn btn--ghost btn--small" data-action="ficha" data-id="${a.id}">Ver ficha técnica</button>
          <button class="btn btn--primary btn--small" data-action="agregar" data-id="${a.id}"><i class="bi bi-bag-plus"></i> Agregar</button>
        </div>
      </div>
    </article>`;
}

function renderCatalogo() {
  const q = normalizar(textoBusqueda);
  const filtrados = animales
    .filter((a) => categoriaActiva === "Todos" || a.categoria === categoriaActiva)
    .filter((a) => normalizar(a.nombre).includes(q) || normalizar(a.especie).includes(q));

  grid.innerHTML = filtrados.length
    ? filtrados.map(tarjetaHTML).join("")
    : `<p class="empty">No encontramos ejemplares con ese criterio. Prueba con otra búsqueda o categoría.</p>`;

  resultsInfo.textContent = `${filtrados.length} ejemplar${filtrados.length === 1 ? "" : "es"} encontrado${filtrados.length === 1 ? "" : "s"}`;
}

searchInput.addEventListener("input", (e) => {
  textoBusqueda = e.target.value;
  renderCatalogo();
});

$("#filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter");
  if (!btn) return;
  document.querySelectorAll(".filter").forEach((b) => b.classList.remove("is-active"));
  btn.classList.add("is-active");
  categoriaActiva = btn.dataset.category;
  renderCatalogo();
});

/* ---------- 3. CARRITO (localStorage) ---------- */
const CART_KEY = "casta_exotics_cart";
let carrito = [];

try {
  carrito = JSON.parse(localStorage.getItem(CART_KEY)) || [];
} catch {
  carrito = [];
}

const guardarCarrito = () => localStorage.setItem(CART_KEY, JSON.stringify(carrito));

function renderCarrito() {
  const cont = $("#cartItems");
  let total = 0;
  let cantidad = 0;

  if (!carrito.length) {
    cont.innerHTML = `<p class="empty empty--small">Tu carrito está vacío.</p>`;
  } else {
    cont.innerHTML = carrito.map((item) => {
      const a = animales.find((x) => x.id === item.id);
      if (!a) return "";
      total += a.precio * item.cantidad;
      cantidad += item.cantidad;
      return `
        <div class="cart-item">
          <div class="cart-item__info">
            <h4>${a.nombre}</h4>
            <p>${money(a.precio)} c/u</p>
          </div>
          <div class="qty">
            <button data-cart="menos" data-id="${a.id}" aria-label="Quitar una unidad">−</button>
            <span>${item.cantidad}</span>
            <button data-cart="mas" data-id="${a.id}" aria-label="Agregar una unidad">+</button>
          </div>
          <strong class="cart-item__sub">${money(a.precio * item.cantidad)}</strong>
          <button class="icon-btn" data-cart="eliminar" data-id="${a.id}" aria-label="Eliminar ${a.nombre}"><i class="bi bi-trash"></i></button>
        </div>`;
    }).join("");
  }

  $("#cartSubtotal").textContent = money(total);
  $("#cartTotal").textContent = money(total);
  $("#cartCount").textContent = cantidad;
  $("#cartCount").classList.toggle("is-visible", cantidad > 0);
  guardarCarrito();
}

function agregarAlCarrito(id) {
  const existente = carrito.find((i) => i.id === id);
  if (existente) existente.cantidad++;
  else carrito.push({ id, cantidad: 1 });
  renderCarrito();
  const a = animales.find((x) => x.id === id);
  Swal.fire({
    toast: true, position: "top-end", icon: "success", timer: 1600, showConfirmButton: false,
    title: `${a.nombre} agregado al carrito`, background: "#151515", color: "#f5f5f5"
  });
}

function abrirCarrito(abrir) {
  $("#cartPanel").classList.toggle("is-open", abrir);
  $("#cartPanel").setAttribute("aria-hidden", String(!abrir));
  $("#overlay").classList.toggle("is-open", abrir);
}

$("#cartOpen").addEventListener("click", () => abrirCarrito(true));
$("#cartClose").addEventListener("click", () => abrirCarrito(false));
$("#overlay").addEventListener("click", () => abrirCarrito(false));

$("#cartItems").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-cart]");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const item = carrito.find((i) => i.id === id);
  if (!item) return;

  if (btn.dataset.cart === "mas") item.cantidad++;
  if (btn.dataset.cart === "menos") item.cantidad--;
  if (btn.dataset.cart === "eliminar" || item.cantidad <= 0) {
    carrito = carrito.filter((i) => i.id !== id);
  }
  renderCarrito();
});

$("#cartClear").addEventListener("click", () => {
  if (!carrito.length) return;
  Swal.fire({
    title: "¿Vaciar el carrito?", icon: "question", showCancelButton: true,
    confirmButtonText: "Sí, vaciar", cancelButtonText: "Cancelar",
    background: "#151515", color: "#f5f5f5", confirmButtonColor: "#b9a06c"
  }).then((r) => {
    if (r.isConfirmed) {
      carrito = [];
      renderCarrito();
    }
  });
});

$("#cartCheckout").addEventListener("click", () => {
  if (!carrito.length) {
    Swal.fire({ icon: "info", title: "Tu carrito está vacío", background: "#151515", color: "#f5f5f5", confirmButtonColor: "#b9a06c" });
    return;
  }
  let total = 0;
  const lineas = carrito.map((i) => {
    const a = animales.find((x) => x.id === i.id);
    total += a.precio * i.cantidad;
    return `- ${i.cantidad} x ${a.nombre} (${money(a.precio * i.cantidad)})`;
  });
  const msg = `Hola, me gustaría reservar:\n${lineas.join("\n")}\nTotal: ${money(total)}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
});

/* ---------- 4a. MODAL DE FICHA TÉCNICA ---------- */
const modal = $("#modal");

function abrirFicha(id) {
  const a = animales.find((x) => x.id === id);
  if (!a) return;
  $("#modalBody").innerHTML = `
    <p class="section__eyebrow">${a.categoria}</p>
    <h3 class="modal__title" id="modalTitle">${a.nombre}</h3>
    <p class="card__species">${a.especie}</p>
    <ul class="spec">
      <li><i class="bi bi-thermometer-half"></i><div><strong>Temperatura</strong><span>${a.ficha.temperatura}</span></div></li>
      <li><i class="bi bi-house"></i><div><strong>Hábitat</strong><span>${a.ficha.habitat}</span></div></li>
      <li><i class="bi bi-egg-fried"></i><div><strong>Alimentación</strong><span>${a.ficha.alimentacion}</span></div></li>
      <li><i class="bi bi-hourglass-split"></i><div><strong>Esperanza de vida</strong><span>${a.ficha.vida}</span></div></li>
      <li><i class="bi bi-speedometer2"></i><div><strong>Nivel de cuidado</strong><span>${a.ficha.nivel}</span></div></li>
    </ul>
    <div class="modal__foot">
      <strong class="card__price">${money(a.precio)}</strong>
      <button class="btn btn--primary" data-action="agregar" data-id="${a.id}">Agregar al carrito</button>
    </div>`;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function cerrarFicha() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

$("#modalClose").addEventListener("click", cerrarFicha);
modal.addEventListener("click", (e) => { if (e.target === modal) cerrarFicha(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { cerrarFicha(); abrirCarrito(false); }
});

// Delegación de eventos para los botones de tarjetas y del modal
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (btn.dataset.action === "ficha") abrirFicha(id);
  if (btn.dataset.action === "agregar") agregarAlCarrito(id);
});

/* ---------- 4b. FORMULARIO CON VALIDACIÓN ---------- */
const form = $("#contactForm");
const selectInteres = $("#fInteres");

selectInteres.innerHTML =
  `<option value="">Selecciona un ejemplar</option>` +
  animales.map((a) => `<option value="${a.id}">${a.nombre}</option>`).join("") +
  `<option value="otro">Otro / no estoy seguro</option>`;

function setError(idCampo, mensaje) {
  const campo = document.getElementById(idCampo);
  document.querySelector(`[data-error-for="${idCampo}"]`).textContent = mensaje;
  campo.classList.toggle("is-invalid", Boolean(mensaje));
  return !mensaje;
}

const validadores = {
  fNombre: (v) => (v.trim().length >= 3 ? "" : "Escribe tu nombre completo (mínimo 3 caracteres)."),
  fCorreo: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Ingresa un correo válido (ej. nombre@correo.com)."),
  fTelefono: (v) => (/^\d{10}$/.test(v.trim()) ? "" : "El teléfono debe tener 10 dígitos numéricos."),
  fInteres: (v) => (v ? "" : "Selecciona un ejemplar."),
  fMensaje: (v) => (v.trim().length >= 10 ? "" : "El mensaje debe tener al menos 10 caracteres.")
};

// Validación en vivo al salir de cada campo
Object.keys(validadores).forEach((id) => {
  const campo = document.getElementById(id);
  campo.addEventListener("blur", () => setError(id, validadores[id](campo.value)));
  campo.addEventListener("input", () => {
    if (campo.classList.contains("is-invalid")) setError(id, validadores[id](campo.value));
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valido = true;
  Object.keys(validadores).forEach((id) => {
    const ok = setError(id, validadores[id](document.getElementById(id).value));
    if (!ok) valido = false;
  });

  if (!valido) {
    Swal.fire({
      icon: "error", title: "Revisa el formulario",
      text: "Hay campos vacíos o con datos incorrectos.",
      background: "#151515", color: "#f5f5f5", confirmButtonColor: "#b9a06c"
    });
    return;
  }

  Swal.fire({
    icon: "success", title: "¡Solicitud enviada!",
    text: `Gracias, ${$("#fNombre").value.trim()}. Te contactaremos pronto.`,
    background: "#151515", color: "#f5f5f5", confirmButtonColor: "#b9a06c"
  });
  form.reset();
});

/* ---------- INICIO ---------- */
renderCatalogo();
renderCarrito();