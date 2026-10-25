# QA de Flashop — se ejecuta contra el sitio servido en local.
# 1) python -m http.server 8123   (dentro de esta carpeta)
# 2) chrome --headless=new --remote-debugging-port=9222 about:blank
# 3) node _qa/verify.mjs          -> imprime JSON con DOM, carrito y errores de consola
#
// QA real de Flashop: DOM, errores de consola, carrito y capturas full-page (CDP).
import fs from "node:fs";

const SITE = process.env.SITE || "http://127.0.0.1:8123";
const CDP = "http://127.0.0.1:9222";
const OUT = process.env.OUT || "./_qa/shots";
fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class C {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map(); this.logs = [];
    ws.onmessage = (e) => {
      const m = JSON.parse(e.data);
      if (m.id && this.pending.has(m.id)) {
        const { res, rej } = this.pending.get(m.id); this.pending.delete(m.id);
        m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result);
        return;
      }
      if (m.method === "Runtime.exceptionThrown") this.logs.push("EXCEPTION: " + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
      if (m.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(m.params.type))
        this.logs.push(m.params.type.toUpperCase() + ": " + m.params.args.map((a) => a.value ?? a.description ?? "").join(" "));
      if (m.method === "Log.entryAdded" && m.params.entry.level === "error")
        this.logs.push("LOG: " + m.params.entry.text + " " + (m.params.entry.url || ""));
    };
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((res, rej) => { this.pending.set(id, { res, rej }); this.ws.send(JSON.stringify({ id, method, params })); });
  }
}

async function targets() {
  const r = await fetch(CDP + "/json/list");
  return r.json();
}

const report = { paginas: {}, pruebas: {}, errores: [] };

const list = await targets();
const page = list.find((t) => t.type === "page");
if (!page) { console.log("no hay target page"); process.exit(1); }
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
const c = new C(ws);
await c.send("Runtime.enable");
await c.send("Page.enable");
await c.send("Log.enable");
await c.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

async function open(path, shot, wait = 1600) {
  c.logs = [];
  await c.send("Page.navigate", { url: SITE + path });
  await sleep(wait);
  if (shot) {
    const { data } = await c.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
    fs.writeFileSync(OUT + "/" + shot, Buffer.from(data, "base64"));
  }
  return c.logs.slice();
}

async function ev(expr) {
  const r = await c.send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) return { error: r.exceptionDetails.exception?.description || r.exceptionDetails.text };
  return r.result.value;
}

// ---------- 1. HOME ----------
report.errores = report.errores.concat((await open("/index.html", "01-home.png")).map((l) => "[home] " + l));
await ev("localStorage.clear()"); // QA desde carrito limpio
report.paginas.home = await ev(`JSON.stringify({
  titulo: document.title,
  header: !!document.querySelector('.header .brand img'),
  navLinks: document.querySelectorAll('.nav a').length,
  cats: document.querySelectorAll('#catStrip .cat').length,
  masVendidos: document.querySelectorAll('#gridMasVendidos .card').length,
  novedades: document.querySelectorAll('#gridNovedades .card').length,
  precioEjemplo: document.querySelector('#gridMasVendidos .price .now')?.textContent,
  dctoEjemplo: document.querySelector('#gridMasVendidos .price .pct')?.textContent,
  footerCols: document.querySelectorAll('#site-footer .foot-grid > div').length,
  whatsappFloat: !!document.querySelector('.wa-float'),
  altoTotal: document.body.scrollHeight
})`);

// ---------- 2. CATEGORÍA ----------
report.errores = report.errores.concat((await open("/categoria.html?c=tecnologia&o=precio_asc", "02-categoria.png")).map((l) => "[categoria] " + l));
report.paginas.categoria = await ev(`JSON.stringify({
  h1: document.querySelector('#catTitle')?.textContent,
  chips: document.querySelectorAll('#chips .chip').length,
  chipActivo: document.querySelector('#chips .chip.on')?.textContent,
  count: document.querySelector('#count')?.textContent,
  tarjetas: document.querySelectorAll('#gridCategoria .card').length,
  primerPrecio: document.querySelector('#gridCategoria .price .now')?.textContent,
  orden: document.querySelector('#orden')?.value
})`);

// ---------- 3. BÚSQUEDA ----------
await open("/categoria.html?q=robot", "03-busqueda.png");
report.pruebas.busqueda = await ev(`JSON.stringify({
  h1: document.querySelector('#catTitle')?.textContent,
  tarjetas: document.querySelectorAll('#gridCategoria .card').length,
  primerTitulo: document.querySelector('#gridCategoria .card h3')?.textContent
})`);

// ---------- 4. PRODUCTO + CARRITO ----------
report.errores = report.errores.concat((await open("/producto.html?p=auriculares-anc-pro", "04-producto.png")).map((l) => "[producto] " + l));
report.paginas.producto = await ev(`JSON.stringify({
  titulo: document.title,
  h1: document.querySelector('#pdp h1')?.textContent,
  precio: document.querySelector('.pricebox .now')?.textContent,
  ahorro: document.querySelector('.pricebox .save')?.textContent,
  opciones: document.querySelectorAll('#opts .opt').length,
  thumbs: document.querySelectorAll('.thumbs button').length,
  relacionados: document.querySelectorAll('#gridRelacionados .card').length,
  acordeones: document.querySelectorAll('.acc details').length
})`);

// clic real: elegir variante + cantidad + agregar al carrito
report.pruebas.agregarAlCarrito = await ev(`(async () => {
  document.querySelectorAll('#opts .opt')[1].click();
  document.querySelector('#qPlus').click();
  document.querySelector('#qPlus').click();
  document.querySelector('#addBtn').click();
  await new Promise(r => setTimeout(r, 300));
  const drawerAbierto = document.querySelector('#drawer').classList.contains('open');
  const lineas = document.querySelectorAll('#drawerBody .line').length;
  const total = document.querySelector('#drawerFoot .totals.big span:last-child')?.textContent;
  const badge = document.querySelector('#cartBadge').textContent;
  const guardado = JSON.parse(localStorage.getItem('flashop_cart_v1') || '[]');
  return JSON.stringify({ drawerAbierto, lineas, total, badge, guardado });
})()`);

// ---------- 5. CARRITO / CHECKOUT ----------
report.errores = report.errores.concat((await open("/carrito.html", "05-carrito.png")).map((l) => "[carrito] " + l));
report.pruebas.checkout = await ev(`(async () => {
  document.querySelector('#fNombre').value = 'María Gómez';
  document.querySelector('#fTel').value = '3001234567';
  document.querySelector('#fCiudad').value = 'Cali';
  document.querySelector('#fDir').value = 'Calle 10 # 20-30, barrio San Fernando';
  const filas = document.querySelectorAll('#cartBox .cartrow').length;
  const total = document.querySelector('#cartSummary .totals.big span:last-child')?.textContent;
  const faltaGratis = document.querySelector('#cartSummary p')?.textContent;
  document.querySelector('#checkoutForm').dispatchEvent(new Event('submit', {cancelable:true, bubbles:true}));
  await new Promise(r => setTimeout(r, 400));
  const pedidos = JSON.parse(localStorage.getItem('flashop_pedidos') || '[]');
  return JSON.stringify({ filas, total, faltaGratis, pedidosGuardados: pedidos.length, ultimo: pedidos[pedidos.length-1]?.datos });
})()`);

// ---------- 6. MÓVIL ----------
await c.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await open("/index.html", "06-movil.png", 1500);
report.pruebas.movil = await ev(`JSON.stringify({
  navOculto: getComputedStyle(document.querySelector('.nav')).display,
  burgerVisible: getComputedStyle(document.querySelector('.burger')).display,
  columnasTarjetas: getComputedStyle(document.querySelector('#gridMasVendidos')).gridTemplateColumns.split(' ').length
})`);

await c.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
report.pruebas.carritoVacio = await ev(`(async () => {
  localStorage.removeItem('flashop_cart_v1');
  location.href = 'carrito.html';
  return 'ok';
})()`);
await sleep(1500);
report.pruebas.estadoVacio = await ev(`JSON.stringify({
  mensaje: document.querySelector('#cartBox .panel h2')?.textContent,
  badge: getComputedStyle(document.querySelector('#cartBadge')).display
})`);

console.log(JSON.stringify(report, null, 2));
ws.close();
