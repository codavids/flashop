# Flashop — tienda dropshipping (copia de línea gráfica)

Copia funcional de la estructura y el flujo de compra de `consiguelotienda.com`, con la
identidad de marca de **Flashop** (la portada que enviaste): estética *dark tech* con azul
eléctrico, eslogan **“Tu compra en un flash.”**, envío gratis y pago contra entrega.

No es una copia de su código (su sitio es WordPress + WooCommerce + Elementor): es un sitio
propio, estático y sin dependencias, con el mismo esqueleto comercial —hero, categorías,
“los más vendidos”, banners de promoción, garantías, testimonios, FAQ, footer con medios de
pago— y el mismo checkout por WhatsApp.

---

## 1. Verlo en tu PC (30 segundos)

Doble clic en `index.html` funciona, pero para que el carrito y las rutas se comporten como
en producción, sírvelo por HTTP:

```bash
cd C:/Users/saave/Desktop/flashop
python -m http.server 8123
# abre http://localhost:8123
```

Páginas:

| Archivo | Qué es |
|---|---|
| `index.html` | Home: hero, categorías, más vendidos, promos, novedades, nosotros, garantías, testimonios, FAQ |
| `categoria.html` | Catálogo con filtros por categoría, orden y buscador (`?c=hogar`, `?q=robot`, `?o=precio_asc`) |
| `producto.html` | Ficha: galería de 3 vistas, variantes, cantidad, agregar al carrito, compra directa por WhatsApp, acordeones |
| `carrito.html` | Carrito + checkout: edita cantidades, datos de entrega y envía el pedido por WhatsApp |

---

## 2. Estructura

```
flashop/
├─ index.html  categoria.html  producto.html  carrito.html
├─ assets/
│  ├─ css/styles.css        ← todo el sistema de diseño (variables al inicio)
│  ├─ js/config.js          ← WhatsApp, correo, redes, envío gratis, costo de envío
│  ├─ js/data.js            ← categorías y productos (catálogo)
│  ├─ js/app.js             ← header/footer compartidos, carrito, filtros, checkout
│  └─ img/*.svg             ← 53 ilustraciones generadas (marca + 3 vistas por producto)
└─ _qa/verify.mjs           ← prueba automática (DOM, carrito, errores de consola)
```

---

## 3. Personalizar

### 3.1 WhatsApp y datos del negocio — `assets/js/config.js`

```js
whatsapp: "573000000000",   // ⚠️ CAMBIA ESTO: código de país + número, sin + ni espacios
email: "hola@flashop.co",
instagram / facebook / tiktok,
envioGratisDesde: 120000,   // envío gratis desde este monto
costoEnvio: 12000,          // costo cuando no alcanza el mínimo
```

Ese número alimenta **todos** los botones de WhatsApp: la barra superior, el carrito lateral,
la compra directa en la ficha y el envío del pedido. Cámbialo una sola vez.

### 3.2 Productos — `assets/js/data.js`

Cada producto es un objeto. El `slug` es también el nombre de sus imágenes.

```js
{
  slug: "auriculares-anc-pro",          // define producto.html?p=auriculares-anc-pro
  nombre: "Auriculares AirBass Pro ANC",
  categoria: "tecnologia",              // debe existir en el array `categorias`
  precio: 109900, antes: 219900,        // `antes: null` = sin descuento
  badge: "OFERTA" | "NUEVO" | null,
  rating: 4.8, reviews: 213,
  etiquetas: ["Envío gratis"],
  variantes: { nombre: "Color", opciones: ["Negro", "Azul eléctrico"] },  // opcional
  corto: "…", bullets: ["…"], specs: [["Batería", "40 h"]]
}
```

Las categorías del menú, los chips de filtro y el footer se generan desde `categorias`,
así que agregar una categoría nueva la hace aparecer en todo el sitio.

### 3.3 Ponle tus fotos reales

Las ilustraciones son SVG propios (nada hotlinkeado del sitio original). Para usar fotos:

1. Guarda tus fotos como `assets/img/<slug>.svg`… o mejor en `.jpg` y cambia una línea en
   `assets/js/app.js`:

```js
function img(slug, v) { return "assets/img/" + slug + (v > 1 ? "-" + v : "") + ".jpg"; }
```

Nombra los archivos igual que el `slug` (`auriculares-anc-pro.jpg`, `auriculares-anc-pro-2.jpg`,
`auriculares-anc-pro-3.jpg` para las 3 vistas de la galería).

### 3.4 Colores y tipografía — `assets/css/styles.css`

Todo el tema sale de las variables del inicio del archivo:

```css
--accent:#008cff;      /* azul eléctrico de la marca */
--accent-2:#00d1ff;    /* cian de los brillos */
--bg:#05070f;          /* fondo */
--offer:#ff2d55;       /* badges de oferta */
--font-h / --font-b    /* títulos (Poppins) y texto (Inter) */
```

---

## 4. Publicarlo (pasos manuales)

### Opción A — GitHub + Vercel (recomendado, gratis y con HTTPS)

1. En GitHub: **New repository** → nombre `flashop` → **Create**.
2. En tu PC, dentro de la carpeta `C:/Users/saave/Desktop/flashop`:
   ```bash
   git init
   git add .
   git commit -m "Sitio Flashop"
   git branch -M main
   git remote add origin https://github.com/<TU-USUARIO>/flashop.git
   git push -u origin main
   ```
3. En Vercel: **Add New… → Project → Import Git Repository** → elige `flashop`.
4. Framework Preset: **Other**. Build Command y Output Directory: déjalos **vacíos**.
5. **Deploy**. En ~20 segundos tienes `https://flashop.vercel.app`.
6. Dominio propio: en Vercel → **Settings → Domains → Add** `flashop.co`, y en tu proveedor
   de dominio crea el registro que Vercel te muestre (normalmente `A` a `76.76.21.21` y
   `CNAME www → cname.vercel-dns.com`). El HTTPS se emite solo.

### Opción B — Netlify (arrastrar y soltar)

Entra a `app.netlify.com/drop` y arrastra la carpeta `flashop` completa. Queda publicada al
instante; luego puedes conectar el repositorio para que cada `git push` despliegue solo.

### Opción C — Hosting propio (cPanel)

Sube el contenido de la carpeta a `public_html` por el Administrador de archivos o FTP.
No hay base de datos ni PHP: funcionan los 4 archivos HTML tal cual.

---

## 5. Cómo se probó (y cómo volver a probarlo)

Se corrió una prueba real en Chrome headless vía CDP, contra el servidor local:

- **0 errores** de consola y **0 imágenes rotas** en home, catálogo, búsqueda, ficha, carrito y móvil.
- Carrito: agregar con variante `Azul eléctrico` × 3 → badge 3, total `$ 329.700` (109.900 × 3 correcto), persistido en `localStorage`.
- Checkout: validación de campos obligatorios, guardado del pedido y armado del mensaje de WhatsApp.
- Carrito vacío → estado vacío correcto y badge oculto.
- Móvil 390 px → una columna, menú hamburguesa, sin desbordes horizontales.

Para repetirla:

```bash
cd C:/Users/saave/Desktop/flashop
python -m http.server 8123
# en otra terminal:
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
  --user-data-dir=/tmp/chrome-flashop --remote-debugging-port=9222 about:blank
node _qa/verify.mjs
```

---

## 6. Lo que aún queda por decidir (no lo inventé por ti)

1. **Número de WhatsApp real** en `config.js` — hoy es un placeholder `573000000000`.
2. **Fotos reales de producto** — los SVG son ilustraciones de marca, no fotos.
3. **Cobro en línea**: hoy el pago es contra entrega + WhatsApp. Si quieres tarjeta/PSE
   automáticos hay que sumar una pasarela (Wompi, Mercado Pago o Bold para Colombia) y un
   backend que registre el pedido; dime y lo montamos.
4. **Registro de pedidos**: hoy el checkout arma el mensaje de WhatsApp y guarda el pedido en
   el navegador (`localStorage`). Si quieres que los pedidos queden en una hoja de cálculo o
   base de datos, se conecta a Google Sheets o Supabase.
5. **Precios y catálogo**: puse 15 productos de ejemplo con categorías reales de dropshipping
   (tecnología, hogar, moda, belleza, bienestar, camping, niños), no los productos de
   Consíguelo Tienda, para no copiar su catálogo.

*`_qa/shots`: evidencia de las pruebas, no forma parte del sitio. Puedes borrarla o agregarla a `.gitignore`.*
