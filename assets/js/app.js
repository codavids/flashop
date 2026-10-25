/* ============================================================
   FLASHOP — Motor de la tienda (sin dependencias)
   Header/footer compartidos, grillas, ficha, carrito y checkout
   por WhatsApp. Estado del carrito en localStorage.
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.FLASHOP_CONFIG;
  var CATALOG = window.FLASHOP_CATALOG;
  var CATS = CATALOG.categorias;
  var PRODUCTS = CATALOG.productos;
  var CART_KEY = "flashop_cart_v1";

  /* ---------- utilidades ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function money(n) {
    // Espacio duro entre simbolo y cifra: evita que el precio se parta en dos lineas.
    return "$ " + Math.round(n).toLocaleString("es-CO").replace(/\./g, " ");
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function byslug(s) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].slug === s) return PRODUCTS[i]; return null; }
  function catNombre(id) { for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i].nombre; return id; }
  function pct(p) { return p.antes ? Math.round((1 - p.precio / p.antes) * 100) : 0; }
  function img(slug, v) { return "assets/img/" + slug + (v > 1 ? "-" + v : "") + ".svg"; }
  function qs(k) { return new URLSearchParams(location.search).get(k); }
  function waLink(txt) { return "https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(txt); }
  function control(id, label, d) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>";
  }
  var IC = {
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="10" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4.5 20c1.6-3.6 4.3-5.4 7.5-5.4S18 16.4 19.5 20"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z"/><circle cx="6" cy="18.5" r="1.6"/><circle cx="17" cy="18.5" r="1.6"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18M16 14h2"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.7 15L2 22l5.2-1.3A10 10 0 1 0 12 2zm5.5 14.1c-.2.6-1.3 1.2-1.8 1.3-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4-.1.6.5l.8 2c.1.2.1.3 0 .5l-.3.4-.3.4c-.1.1-.3.3-.1.6.1.3.6 1.2 1.4 1.9 1 .9 1.8 1.2 2 1.3.3.1.4.1.6-.1l.9-1c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.2.1.7-.1 1.2z"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5 6.1 20.6l1.2-6.5L2.5 9.5l6.6-.9z"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M4 11l8-7 8 7v9H4z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 20s-7-4.3-7-9.3A4 4 0 0 1 12 8a4 4 0 0 1 7 2.7c0 5-7 9.3-7 9.3z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M3 12l9-9 9 9-9 9z"/><circle cx="8.5" cy="8.5" r="1.4"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 21s6-5.3 6-10a6 6 0 1 0-12 0c0 4.7 6 10 6 10z"/><circle cx="12" cy="11" r="2.2"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>'
  };

  /* ---------- carrito ---------- */
  function cartRead() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; }
  }
  function cartWrite(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    renderDrawer();
    badge();
  }
  function cartAdd(slug, qty, variante) {
    var items = cartRead();
    var key = slug + "|" + (variante || "");
    var found = null;
    for (var i = 0; i < items.length; i++) if (items[i].key === key) found = items[i];
    if (found) found.qty += qty;
    else items.push({ key: key, slug: slug, qty: qty, variante: variante || "" });
    cartWrite(items);
    var p = byslug(slug);
    toast("Agregado al carrito: " + (p ? p.nombre.split(" ").slice(0, 4).join(" ") : slug));
    openDrawer();
  }
  function cartSetQty(key, qty) {
    var items = cartRead();
    for (var i = 0; i < items.length; i++) if (items[i].key === key) items[i].qty = Math.max(1, qty);
    cartWrite(items);
  }
  function cartRemove(key) {
    cartWrite(cartRead().filter(function (it) { return it.key !== key; }));
    if (typeof renderCartPage === "function") renderCartPage();
  }
  function cartCount() { return cartRead().reduce(function (a, it) { return a + it.qty; }, 0); }
  function cartSubtotal() {
    return cartRead().reduce(function (a, it) {
      var p = byslug(it.slug);
      return a + (p ? p.precio * it.qty : 0);
    }, 0);
  }
  function envio(sub) { return sub >= CFG.envioGratisDesde || sub === 0 ? 0 : CFG.costoEnvio; }

  /* ---------- toasts ---------- */
  function toast(msg) {
    var box = $("#toasts");
    if (!box) { box = document.createElement("div"); box.id = "toasts"; box.className = "toasts"; document.body.appendChild(box); }
    var t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = IC.bolt + "<span>" + esc(msg) + "</span>";
    box.appendChild(t);
    setTimeout(function () { t.style.opacity = "0"; t.style.transform = "translateX(-14px)"; }, 2600);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 3200);
  }

  /* ---------- chrome compartido (header / footer / drawer) ---------- */
  function navHTML(activePage) {
    var h = '<a href="index.html"' + (activePage === "home" ? ' class="active"' : "") + ">Inicio</a>";
    h += '<div class="nav-item" id="navCat"><button class="navbtn" type="button" aria-expanded="false">Categorías <i class="caret"></i></button><div class="nav-menu">';
    CATS.forEach(function (c) { h += '<a href="categoria.html?c=' + c.id + '">' + esc(c.nombre) + "</a>"; });
    h += "</div></div>";
    h += '<a href="categoria.html?c=tecnologia"' + (activePage === "cat" ? ' class="active"' : "") + ">Ofertas</a>";
    h += '<a href="index.html#garantias">Envíos y pagos</a>';
    h += '<a href="index.html#nosotros">Nosotros</a>';
    h += '<a href="' + waLink("Hola " + CFG.nombre + ", quiero información de un producto.") + '" target="_blank" rel="noopener">Contacto</a>';
    return h;
  }

  function headerHTML(activePage) {
    return '' +
      '<div class="topbar"><div class="wrap">' +
        '<div class="topbar-msg"><span class="bolt">' + IC.bolt + '</span><span id="tickerMsg">Envío gratis a toda Colombia en pedidos desde ' + money(CFG.envioGratisDesde) + "</span></div>" +
        '<div class="topbar-right">' +
          '<span>' + IC.pin + " " + esc(CFG.ciudad) + "</span>" +
          '<a href="' + waLink("Hola " + CFG.nombre + ", necesito ayuda con mi compra.") + '" target="_blank" rel="noopener">Atención por WhatsApp</a>' +
        "</div>" +
      "</div></div>" +
      '<header class="header"><div class="wrap">' +
        '<a class="brand" href="index.html" aria-label="' + esc(CFG.nombre) + ' — inicio"><img src="assets/img/logo-horizontal.svg" alt="' + esc(CFG.nombre) + ' — ' + esc(CFG.eslogan) + '"></a>' +
        '<nav class="nav" aria-label="Principal">' + navHTML(activePage) + "</nav>" +
        '<div class="header-actions">' +
          '<form class="search" role="search" id="searchForm">' + '<span class="ico">' + IC.search + "</span>" +
            '<input type="search" id="searchInput" placeholder="Buscar productos…" aria-label="Buscar productos">' +
          "</form>" +
          '<button class="iconbtn" type="button" aria-label="Mi cuenta" onclick="Flashop.toast(\'Muy pronto: cuentas y seguimiento de pedidos.\')">' + IC.user + "</button>" +
          '<button class="iconbtn" type="button" id="cartBtn" aria-label="Abrir carrito">' + IC.cart + '<span class="badge" id="cartBadge">0</span></button>' +
          '<button class="iconbtn burger" type="button" id="burgerBtn" aria-label="Abrir menú">' + IC.menu + "</button>" +
        "</div>" +
      "</div></header>" +
      '<div class="mobile-nav" id="mobileNav"><div class="wrap">' + navHTML(activePage) + "</div></div>";
  }

  function footerHTML() {
    var cats = CATS.slice(0, 6).map(function (c) { return '<li><a href="categoria.html?c=' + c.id + '">' + esc(c.nombre) + "</a></li>"; }).join("");
    return '' +
      '<div class="wrap">' +
        '<div class="foot-grid">' +
          '<div class="foot-brand">' +
            '<img src="assets/img/logo-horizontal.svg" alt="' + esc(CFG.nombre) + '">' +
            "<p>" + esc(CFG.eslogan) + " " + esc(CFG.descripcion) + "</p>" +
            '<div class="socials">' +
              '<a href="' + esc(CFG.instagram) + '" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1.2" fill="currentColor"/></svg></a>' +
              '<a href="' + esc(CFG.facebook) + '" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7h2.6l.4-3h-3V9.2c0-.9.3-1.5 1.6-1.5H17V5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V11H8v3h2.6v7z"/></svg></a>' +
              '<a href="' + esc(CFG.tiktok) + '" target="_blank" rel="noopener" aria-label="TikTok"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 3c.4 2.2 1.8 3.6 4 3.9v2.6c-1.6.1-3-.3-4.3-1.1v6.2c0 3.6-2.4 5.9-5.6 5.9A5.4 5.4 0 0 1 5 15.1c0-3.2 2.7-5.6 6-5.2v2.7c-.4-.1-.8-.2-1.2-.2-1.5 0-2.6 1.1-2.6 2.6s1.1 2.7 2.6 2.7c1.6 0 2.7-1.1 2.7-2.9V3z"/></svg></a>' +
              '<a href="' + waLink("Hola " + CFG.nombre + "!") + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + IC.wa + "</a>" +
            "</div>" +
          "</div>" +
          "<div><h4>Tienda</h4><ul>" + cats + "</ul></div>" +
          "<div><h4>Ayuda</h4><ul>" +
            '<li><a href="' + waLink("Hola, quiero rastrear mi pedido.") + '" target="_blank" rel="noopener">Rastrear mi pedido</a></li>' +
            '<li><a href="index.html#garantias">Envíos y entregas</a></li>' +
            '<li><a href="index.html#garantias">Cambios y garantía</a></li>' +
            '<li><a href="carrito.html">Carrito y pago</a></li>' +
            '<li><a href="index.html#preguntas">Preguntas frecuentes</a></li>' +
          "</ul></div>" +
          "<div><h4>Contacto</h4><ul>" +
            '<li><a href="' + waLink("Hola " + CFG.nombre + "!") + '" target="_blank" rel="noopener">WhatsApp: +' + esc(CFG.whatsapp) + "</a></li>" +
            "<li><a href=\"mailto:" + esc(CFG.email) + "\">" + esc(CFG.email) + "</a></li>" +
            "<li>Lun a sáb, 8:00 a.m. – 7:00 p.m.</li>" +
            "<li>" + esc(CFG.ciudad) + "</li>" +
          "</ul></div>" +
        "</div>" +
        '<div class="foot-bottom">' +
          "<p>© " + new Date().getFullYear() + " " + esc(CFG.nombre) + ". Todos los derechos reservados.</p>" +
          '<div class="foot-pay"><span>Pago contra entrega</span><span>Nequi</span><span>Bancolombia</span><span>Visa</span><span>Mastercard</span><span>PSE</span></div>' +
        "</div>" +
      "</div>";
  }

  function drawerHTML() {
    return '' +
      '<div class="overlay" id="overlay"></div>' +
      '<aside class="drawer" id="drawer" aria-label="Carrito de compras" aria-hidden="true">' +
        '<div class="drawer-head"><h3>Tu carrito <span id="drawerCount" style="color:var(--muted);font-weight:600"></span></h3>' +
          '<button class="iconbtn" type="button" id="drawerClose" aria-label="Cerrar carrito">' + IC.close + "</button></div>" +
        '<div class="drawer-body" id="drawerBody"></div>' +
        '<div class="drawer-foot" id="drawerFoot"></div>' +
      "</aside>" +
      '<a class="wa-float" href="' + waLink("Hola " + CFG.nombre + ", quiero hacer un pedido.") + '" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">' + IC.wa + "</a>" +
      '<div class="toasts" id="toasts"></div>';
  }

  function chrome(activePage) {
    var h = $("#site-header"), f = $("#site-footer");
    if (h) h.innerHTML = headerHTML(activePage);
    if (f) f.innerHTML = footerHTML();
    var d = document.createElement("div");
    d.innerHTML = drawerHTML();
    while (d.firstChild) document.body.appendChild(d.firstChild);
    wireChrome();
  }

  function wireChrome() {
    var navCat = $("#navCat");
    if (navCat) {
      var btn = $(".navbtn", navCat);
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        navCat.classList.toggle("open");
        btn.setAttribute("aria-expanded", navCat.classList.contains("open") ? "true" : "false");
      });
      document.addEventListener("click", function () { navCat.classList.remove("open"); });
    }
    var burger = $("#burgerBtn"), mobile = $("#mobileNav");
    if (burger && mobile) burger.addEventListener("click", function () { mobile.classList.toggle("open"); });

    var cb = $("#cartBtn");
    if (cb) cb.addEventListener("click", openDrawer);
    var dc = $("#drawerClose"), ov = $("#overlay");
    if (dc) dc.addEventListener("click", closeDrawer);
    if (ov) ov.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });

    var form = $("#searchForm");
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = $("#searchInput").value.trim();
      location.href = "categoria.html" + (v ? "?q=" + encodeURIComponent(v) : "");
    });

    var msgs = [
      "Envío gratis a toda Colombia en pedidos desde " + money(CFG.envioGratisDesde),
      "Pago contra entrega: paga cuando recibas tu pedido",
      "Garantía de 30 días y soporte por WhatsApp"
    ], i = 0, tick = $("#tickerMsg");
    if (tick) setInterval(function () {
      i = (i + 1) % msgs.length;
      tick.style.opacity = "0";
      setTimeout(function () { tick.textContent = msgs[i]; tick.style.opacity = "1"; }, 220);
    }, 4200);

    var sub = $("#subscribeForm");
    if (sub) sub.addEventListener("submit", function (e) { e.preventDefault(); toast("¡Listo! Te avisaremos de las próximas ofertas."); sub.reset(); });

    revealInit();
    badge();
    renderDrawer();
  }

  function openDrawer() {
    var d = $("#drawer"), o = $("#overlay");
    if (!d) return;
    d.classList.add("open"); o.classList.add("open");
    d.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    var d = $("#drawer"), o = $("#overlay");
    if (!d) return;
    d.classList.remove("open"); o.classList.remove("open");
    d.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function badge() {
    var b = $("#cartBadge");
    if (!b) return;
    var n = cartCount();
    b.textContent = n;
    b.style.display = n ? "grid" : "none";
  }

  function renderDrawer() {
    var body = $("#drawerBody"), foot = $("#drawerFoot"), cnt = $("#drawerCount");
    if (!body) return;
    var items = cartRead();
    if (cnt) cnt.textContent = items.length ? "(" + items.length + ")" : "";
    if (!items.length) {
      body.innerHTML = '<div class="empty">' + IC.cart + '<p style="margin-top:12px">Tu carrito está vacío.</p><p style="font-size:13px">Explora los más vendidos y agrega tus favoritos.</p><a class="btn btn-primary btn-sm" href="index.html#mas-vendidos" style="margin-top:16px">Ver los más vendidos</a></div>';
      foot.innerHTML = "";
      return;
    }
    body.innerHTML = items.map(function (it) {
      var p = byslug(it.slug);
      if (!p) return "";
      return '<div class="line">' +
        '<img src="' + img(p.slug) + '" alt="' + esc(p.nombre) + '">' +
        "<div>" +
          '<h4>' + esc(p.nombre) + "</h4>" +
          (it.variante ? '<div class="meta">' + esc(p.variantes ? p.variantes.nombre : "Opción") + ": " + esc(it.variante) + "</div>" : "") +
          '<div class="qty"><button type="button" data-dec="' + esc(it.key) + '" aria-label="Quitar una unidad">−</button><span>' + it.qty + '</span><button type="button" data-inc="' + esc(it.key) + '" aria-label="Agregar una unidad">+</button></div>' +
          '<button class="rm" type="button" data-rm="' + esc(it.key) + '">Eliminar</button>' +
        "</div>" +
        '<div class="pr">' + money(p.precio * it.qty) + "</div>" +
      "</div>";
    }).join("");
    var sub = cartSubtotal(), env = envio(sub);
    foot.innerHTML =
      '<div class="totals"><span>Subtotal</span><b>' + money(sub) + "</b></div>" +
      '<div class="totals"><span>Envío</span><b>' + (env ? money(env) : "Gratis") + "</b></div>" +
      '<div class="totals big"><span>Total</span><span>' + money(sub + env) + "</span></div>" +
      '<a class="btn btn-primary btn-block" href="carrito.html">Ver carrito y pagar</a>' +
      '<button class="btn btn-wa btn-block" type="button" id="drawerWa">Finalizar por WhatsApp</button>';

    $$("[data-inc]", body).forEach(function (b) { b.addEventListener("click", function () { cartSetQty(b.dataset.inc, qtyOf(b.dataset.inc) + 1); }); });
    $$("[data-dec]", body).forEach(function (b) { b.addEventListener("click", function () { var q = qtyOf(b.dataset.dec); if (q > 1) cartSetQty(b.dataset.dec, q - 1); }); });
    $$("[data-rm]", body).forEach(function (b) { b.addEventListener("click", function () { cartRemove(b.dataset.rm); }); });
    var dw = $("#drawerWa");
    if (dw) dw.addEventListener("click", function () { location.href = waLink(orderMessage(null)); });
  }
  function qtyOf(key) {
    var items = cartRead();
    for (var i = 0; i < items.length; i++) if (items[i].key === key) return items[i].qty;
    return 1;
  }
  function orderMessage(extra) {
    var items = cartRead(), sub = cartSubtotal(), env = envio(sub);
    var lines = ["*Nuevo pedido — " + CFG.nombre + "*", ""];
    items.forEach(function (it, i) {
      var p = byslug(it.slug);
      if (!p) return;
      lines.push((i + 1) + ". " + p.nombre + (it.variante ? " (" + (p.variantes ? p.variantes.nombre : "Opción") + ": " + it.variante + ")" : ""));
      lines.push("   x" + it.qty + " — " + money(p.precio * it.qty));
    });
    lines.push("", "Subtotal: " + money(sub), "Envío: " + (env ? money(env) : "Gratis"), "*Total: " + money(sub + env) + "*");
    if (extra) {
      lines.push("", "*Datos de entrega*");
      if (extra.nombre) lines.push("Nombre: " + extra.nombre);
      if (extra.telefono) lines.push("Teléfono: " + extra.telefono);
      if (extra.ciudad) lines.push("Ciudad: " + extra.ciudad);
      if (extra.direccion) lines.push("Dirección: " + extra.direccion);
      if (extra.notas) lines.push("Notas: " + extra.notas);
    }
    lines.push("", "Método de pago preferido: pago contra entrega.");
    return lines.join("\n");
  }

  /* ---------- tarjeta de producto ---------- */
  function cardHTML(p) {
    var d = pct(p);
    var tags = "";
    if (p.badge === "OFERTA") tags += '<span class="tag tag-offer">Oferta</span>';
    if (p.badge === "NUEVO") tags += '<span class="tag tag-new">Nuevo</span>';
    if (p.etiquetas && p.etiquetas.indexOf("Envío gratis") > -1) tags += '<span class="tag tag-free">Envío gratis</span>';
    return '<article class="card fade-up">' +
      '<div class="card-media">' +
        '<div class="tags">' + tags + "</div>" +
        '<a href="producto.html?p=' + p.slug + '" aria-label="' + esc(p.nombre) + '"><img src="' + img(p.slug) + '" alt="' + esc(p.nombre) + '" loading="lazy"></a>' +
      "</div>" +
      '<div class="card-body">' +
        '<a class="card-cat" href="categoria.html?c=' + p.categoria + '">' + esc(catNombre(p.categoria)) + "</a>" +
        "<h3><a href=\"producto.html?p=" + p.slug + '">' + esc(p.nombre) + "</a></h3>" +
        '<div class="stars"><span class="s">' + IC.star.repeat(1) + "</span><span>" + p.rating.toFixed(1) + " (" + p.reviews + " reseñas)</span></div>" +
        '<div class="price' + (p.antes ? "" : " single") + '">' +
          (p.antes ? '<span class="old">' + money(p.antes) + "</span>" : "") +
          '<span class="now">' + money(p.precio) + "</span>" +
          (d ? '<span class="pct">-' + d + "%</span>" : "") +
        "</div>" +
        '<a class="btn btn-primary btn-block btn-sm" href="producto.html?p=' + p.slug + '">' + (p.variantes ? "Elegir opciones" : "Ver producto") + "</a>" +
      "</div></article>";
  }
  function renderGrid(sel, list) {
    var el = $(sel);
    if (!el) return;
    el.innerHTML = list.map(cardHTML).join("");
    revealInit();
  }

  /* ---------- home ---------- */
  function catStripHTML() {
    return CATS.map(function (c) {
      var n = PRODUCTS.filter(function (p) { return p.categoria === c.id; }).length;
      return '<a class="cat' + (qs("c") === c.id ? " active" : "") + '" href="categoria.html?c=' + c.id + '">' + esc(c.nombre) + ' <span class="n">' + n + "</span></a>";
    }).join("");
  }

  function initHome() {
    var strip = $("#catStrip");
    if (strip) strip.innerHTML = catStripHTML();
    var top = PRODUCTS.filter(function (p) { return !!p.antes; }).sort(function (a, b) { return pct(b) - pct(a); }).slice(0, 8);
    renderGrid("#gridMasVendidos", top);
    var novedades = PRODUCTS.filter(function (p) { return p.badge === "NUEVO" || !p.antes; }).slice(0, 4);
    renderGrid("#gridNovedades", novedades.length ? novedades : PRODUCTS.slice(0, 4));

    var s = $("#statProductos"); if (s) s.textContent = PRODUCTS.length + "+";
  }

  /* ---------- categoria ---------- */
  function initCategory() {
    var q = (qs("q") || "").toLowerCase().trim();
    var cat = qs("c") || "todos";
    var orden = qs("o") || "relevancia";
    var si = $("#searchInput");
    if (si && q) si.value = qs("q");

    var chips = $("#chips");
    if (chips) {
      chips.innerHTML = '<button class="chip' + (cat === "todos" ? " on" : "") + '" data-c="todos" type="button">Todos</button>' +
        CATS.map(function (c) {
          var n = PRODUCTS.filter(function (p) { return p.categoria === c.id; }).length;
          if (!n) return "";
          return '<button class="chip' + (cat === c.id ? " on" : "") + '" data-c="' + c.id + '" type="button">' + esc(c.nombre) + " (" + n + ")</button>";
        }).join("");
      $$(".chip", chips).forEach(function (b) {
        b.addEventListener("click", function () {
          var u = new URLSearchParams(location.search);
          if (b.dataset.c === "todos") u.delete("c"); else u.set("c", b.dataset.c);
          location.search = u.toString();
        });
      });
    }
    var sel = $("#orden");
    if (sel) {
      sel.value = orden;
      sel.addEventListener("change", function () {
        var u = new URLSearchParams(location.search);
        u.set("o", sel.value);
        location.search = u.toString();
      });
    }

    var h1 = $("#catTitle"), sub = $("#catSub");
    if (h1) h1.textContent = q ? 'Resultados para "' + qs("q") + '"' : (cat === "todos" ? "Todo el catálogo" : catNombre(cat));
    if (sub) {
      sub.textContent = q
        ? "Buscamos en nombres, categorías y descripciones del catálogo."
        : (cat === "todos" ? "Gadgets virales, hogar y tecnología con envío gratis a toda Colombia." : "Productos de " + catNombre(cat).toLowerCase() + " con pago contra entrega.");
    }

    var list = PRODUCTS.filter(function (p) {
      var okCat = cat === "todos" || p.categoria === cat;
      if (!okCat) return false;
      if (!q) return true;
      var hay = [p.nombre, catNombre(p.categoria), p.corto || ""].join(" ").toLowerCase();
      return hay.indexOf(q) > -1;
    });

    var sorters = {
      relevancia: function (a, b) { return (b.reviews || 0) - (a.reviews || 0); },
      precio_asc: function (a, b) { return a.precio - b.precio; },
      precio_desc: function (a, b) { return b.precio - a.precio; },
      descuento: function (a, b) { return pct(b) - pct(a); },
      nombre: function (a, b) { return a.nombre.localeCompare(b.nombre, "es"); }
    };
    list.sort(sorters[orden] || sorters.relevancia);

    var cont = $("#gridCategoria");
    if (cont) {
      if (!list.length) {
        cont.innerHTML = '<div class="panel" style="grid-column:1/-1;text-align:center">' +
          '<h2 style="margin-bottom:8px">Sin resultados</h2>' +
          '<p style="color:var(--muted);margin-bottom:18px">No encontramos productos con esos filtros. Prueba con otra palabra o mira todo el catálogo.</p>' +
          '<a class="btn btn-primary" href="categoria.html">Ver todo el catálogo</a></div>';
      } else {
        cont.innerHTML = list.map(cardHTML).join("");
      }
      revealInit();
    }
    var cnt = $("#count");
    if (cnt) cnt.textContent = list.length + (list.length === 1 ? " producto" : " productos");
  }

  /* ---------- ficha de producto ---------- */
  function initProduct() {
    var slug = qs("p");
    var p = byslug(slug);
    var root = $("#pdp");
    if (!root) return;
    if (!p) {
      root.innerHTML = '<div class="panel" style="text-align:center"><h2>Producto no encontrado</h2><p style="color:var(--muted);margin:12px 0 18px">El enlace puede estar mal escrito o el producto ya no está disponible.</p><a class="btn btn-primary" href="categoria.html">Ver el catálogo</a></div>';
      return;
    }
    document.title = p.nombre + " — " + CFG.nombre;
    var d = pct(p), variantes = p.variantes ? p.variantes.opciones : [];
    var selOpt = variantes.length ? variantes[0] : "";
    var bullets = (p.bullets && p.bullets.length ? p.bullets : [
      "Producto verificado y con garantía de 30 días",
      "Pago contra entrega en toda Colombia",
      "Despacho en 24 horas hábiles"
    ]).map(function (b) { return "<div>" + IC.check + "<span>" + esc(b) + "</span></div>"; }).join("");
    var specs = (p.specs || []).map(function (s) { return "<div>" + IC.tag + "<span><b>" + esc(s[0]) + ":</b> " + esc(s[1]) + "</span></div>"; }).join("");

    var crumbs = '<div class="crumbs"><a href="index.html">Inicio</a><span class="sep">/</span>' +
      '<a href="categoria.html?c=' + p.categoria + '">' + esc(catNombre(p.categoria)) + "</a><span class=\"sep\">/</span><span>" + esc(p.nombre) + "</span></div>";
    var cr = $("#crumbs"); if (cr) cr.innerHTML = crumbs;

    root.innerHTML = '' +
      '<div class="gallery">' +
        '<div class="gallery-main"><img id="galMain" src="' + img(p.slug) + '" alt="' + esc(p.nombre) + '"></div>' +
        '<div class="thumbs">' + [1, 2, 3].map(function (v) {
          return '<button type="button" data-v="' + v + '" class="' + (v === 1 ? "on" : "") + '" aria-label="Vista ' + v + '"><img src="' + img(p.slug, v) + '" alt=""></button>';
        }).join("") + "</div>" +
        '<p class="gal-note">' + IC.check + "<span>Fotos ilustrativas del producto: el acabado final depende de la variante que elijas.</span></p>" +
      "</div>" +
      '<div class="pdp-info">' +
        '<a class="card-cat" href="categoria.html?c=' + p.categoria + '">' + esc(catNombre(p.categoria)) + "</a>" +
        "<h1>" + esc(p.nombre) + "</h1>" +
        '<div class="stars"><span class="s">' + IC.star + '</span><span>' + p.rating.toFixed(1) + " · " + p.reviews + " reseñas · " + (p.etiquetas || []).join(" · ") + "</span></div>" +
        '<div class="pricebox">' +
          '<span class="now">' + money(p.precio) + "</span>" +
          (p.antes ? '<span class="old">' + money(p.antes) + "</span><span class=\"pct\">-" + d + "%</span>" : "") +
          (p.antes ? '<span class="save">Ahorras ' + money(p.antes - p.precio) + "</span>" : "") +
        "</div>" +
        '<p style="color:var(--text-dim)">' + esc(p.corto || "Producto con envío gratis y pago contra entrega en toda Colombia.") + "</p>" +
        (variantes.length ? '<div class="field" style="margin-top:22px"><label>' + esc(p.variantes.nombre) + '</label><div class="opts" id="opts">' +
          variantes.map(function (o, i) { return '<button type="button" class="opt' + (i === 0 ? " on" : "") + '" data-o="' + esc(o) + '">' + esc(o) + "</button>"; }).join("") + "</div></div>" : "") +
        '<div class="field"><label>Cantidad</label><div class="qty-lg"><button type="button" id="qMinus" aria-label="Menos">−</button><span id="qVal">1</span><button type="button" id="qPlus" aria-label="Más">+</button></div></div>' +
        '<div class="buyrow">' +
          '<button class="btn btn-primary" type="button" id="addBtn" style="flex:1;min-width:200px">' + IC.cart + " Agregar al carrito</button>" +
          '<button class="btn btn-wa" type="button" id="buyWa">' + IC.wa + " Comprar por WhatsApp</button>" +
        "</div>" +
        '<div class="bullets">' + bullets + specs + "</div>" +
        '<div class="acc">' +
          '<details open><summary>Descripción</summary><div class="body"><p>' + esc(p.corto || "") + "</p>" + (specs ? '<div class="bullets" style="margin-top:14px">' + specs + "</div>" : "") + "</div></details>" +
          '<details><summary>Envío y entrega</summary><div class="body"><ul><li>Despacho en 24 horas hábiles desde nuestra bodega.</li><li>Envío gratis en pedidos desde ' + money(CFG.envioGratisDesde) + ".</li><li>Entrega de 2 a 5 días hábiles en ciudades principales y de 3 a 8 días en el resto del país.</li><li>Recibes la guía de rastreo por WhatsApp.</li></ul></div></details>" +
          '<details><summary>Garantía y cambios</summary><div class="body"><ul><li>30 días de garantía por defectos de fábrica.</li><li>Cambio sin costo si el producto llega averiado o incompleto.</li><li>Soporte por WhatsApp de lunes a sábado.</li></ul></div></details>' +
          '<details><summary>Formas de pago</summary><div class="body"><ul><li>Pago contra entrega (recomendado).</li><li>Transferencia Nequi, Bancolombia o PSE.</li><li>Tarjetas Visa y Mastercard.</li></ul></div></details>' +
        "</div>" +
      "</div>";

    var qty = 1, variante = selOpt;
    function paintQty() { $("#qVal").textContent = qty; }
    $("#qPlus").addEventListener("click", function () { qty++; paintQty(); });
    $("#qMinus").addEventListener("click", function () { if (qty > 1) { qty--; paintQty(); } });
    $$("#opts .opt").forEach(function (b) {
      b.addEventListener("click", function () {
        $$("#opts .opt").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        variante = b.dataset.o;
      });
    });
    $$(".thumbs button").forEach(function (b) {
      b.addEventListener("click", function () {
        $$(".thumbs button").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        $("#galMain").src = img(p.slug, parseInt(b.dataset.v, 10));
      });
    });
    $("#addBtn").addEventListener("click", function () { cartAdd(p.slug, qty, variante); });
    $("#buyWa").addEventListener("click", function () {
      var txt = "*Pedido directo — " + CFG.nombre + "*\n\n" + p.nombre +
        (variante ? "\n" + (p.variantes ? p.variantes.nombre : "Opción") + ": " + variante : "") +
        "\nCantidad: " + qty + "\nPrecio: " + money(p.precio * qty) +
        "\n\nQuiero confirmar disponibilidad y pago contra entrega.";
      window.open(waLink(txt), "_blank");
    });

    renderGrid("#gridRelacionados", PRODUCTS.filter(function (x) { return x.categoria === p.categoria && x.slug !== p.slug; }).slice(0, 4));
    var related = $("#relatedSection");
    if (related && !$("#gridRelacionados").children.length) related.style.display = "none";
  }

  /* ---------- carrito / checkout ---------- */
  function renderCartPage() {
    var box = $("#cartBox"), sum = $("#cartSummary");
    if (!box) return;
    var items = cartRead();
    if (!items.length) {
      box.innerHTML = '<div class="panel" style="text-align:center"><h2>Tu carrito está vacío</h2><p style="color:var(--muted);margin:12px 0 20px">Agrega productos y vuelve para completar tu pedido con pago contra entrega.</p><a class="btn btn-primary" href="categoria.html">Ver el catálogo</a></div>';
      sum.innerHTML = "";
      return;
    }
    box.innerHTML = '<div class="panel"><h2>Productos (' + cartCount() + ")</h2>" + items.map(function (it) {
      var p = byslug(it.slug);
      if (!p) return "";
      return '<div class="cartrow">' +
        '<img src="' + img(p.slug) + '" alt="' + esc(p.nombre) + '">' +
        "<div>" +
          '<h3 style="font-family:var(--font-b);font-size:16px;font-weight:700"><a href="producto.html?p=' + p.slug + '">' + esc(p.nombre) + "</a></h3>" +
          (it.variante ? '<div style="color:var(--muted);font-size:13px;margin-top:4px">' + esc(p.variantes ? p.variantes.nombre : "Opción") + ": " + esc(it.variante) + "</div>" : "") +
          '<div style="color:var(--muted);font-size:13px;margin-top:4px">' + money(p.precio) + " c/u</div>" +
          '<div class="qty" style="margin-top:10px"><button type="button" data-dec="' + esc(it.key) + '" aria-label="Menos">−</button><span>' + it.qty + '</span><button type="button" data-inc="' + esc(it.key) + '" aria-label="Más">+</button></div>' +
          ' <button class="rm" type="button" data-rm="' + esc(it.key) + '">Eliminar</button>' +
        "</div>" +
        '<div class="pr" style="font-family:var(--font-h);font-weight:800">' + money(p.precio * it.qty) + "</div>" +
      "</div>";
    }).join("") + '<div style="margin-top:18px"><a class="link" href="categoria.html">← Seguir comprando</a></div></div>';

    var sub = cartSubtotal(), env = envio(sub), falta = Math.max(0, CFG.envioGratisDesde - sub);
    sum.innerHTML =
      '<div class="panel"><h2>Resumen del pedido</h2>' +
        '<div class="totals"><span>Subtotal</span><b>' + money(sub) + "</b></div>" +
        '<div class="totals" style="margin-top:10px"><span>Envío</span><b>' + (env ? money(env) : "Gratis") + "</b></div>" +
        (falta ? '<p style="font-size:13px;color:var(--accent-2);margin-top:12px">Agrega ' + money(falta) + " más y el envío te sale gratis.</p>" : '<p style="font-size:13px;color:#7ff0bb;margin-top:12px">¡Felicidades! Tu envío es gratis.</p>') +
        '<div class="totals big" style="margin-top:16px"><span>Total</span><span>' + money(sub + env) + "</span></div>" +
      "</div>" +
      '<div class="panel"><h2>Datos de entrega</h2><form id="checkoutForm" novalidate>' +
        '<div class="field-row"><label for="fNombre">Nombre y apellido *</label><input id="fNombre" required placeholder="Ej. María Gómez"></div>' +
        '<div class="field-row"><label for="fTel">WhatsApp / celular *</label><input id="fTel" required inputmode="tel" placeholder="Ej. 300 123 4567"></div>' +
        '<div class="field-row"><label for="fCiudad">Ciudad *</label><input id="fCiudad" required placeholder="Ej. Cali"></div>' +
        '<div class="field-row"><label for="fDir">Dirección *</label><input id="fDir" required placeholder="Calle 10 # 20-30, barrio, apto"></div>' +
        '<div class="field-row"><label for="fNotas">Notas (opcional)</label><textarea id="fNotas" rows="2" placeholder="Punto de referencia, horario de entrega…"></textarea></div>' +
        '<p class="note">' + IC.check + "<span>Confirmamos tu pedido por WhatsApp antes de despachar. Pagas al recibir.</span></p>" +
        '<button class="btn btn-wa btn-block" type="submit" style="margin-top:16px">' + IC.wa + " Enviar pedido por WhatsApp</button>" +
        '<p style="font-size:12.5px;color:var(--muted);margin-top:12px">Al enviar se abre WhatsApp con tu pedido completo listo para enviar.</p>' +
      "</form></div>";

    $$("[data-inc]", box).forEach(function (b) { b.addEventListener("click", function () { cartSetQty(b.dataset.inc, qtyOf(b.dataset.inc) + 1); renderCartPage(); }); });
    $$("[data-dec]", box).forEach(function (b) { b.addEventListener("click", function () { var q = qtyOf(b.dataset.dec); if (q > 1) { cartSetQty(b.dataset.dec, q - 1); renderCartPage(); } }); });
    $$("[data-rm]", box).forEach(function (b) { b.addEventListener("click", function () { cartRemove(b.dataset.rm); }); });

    $("#checkoutForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var f = {
        nombre: $("#fNombre").value.trim(), telefono: $("#fTel").value.trim(),
        ciudad: $("#fCiudad").value.trim(), direccion: $("#fDir").value.trim(),
        notas: $("#fNotas").value.trim()
      };
      var faltan = [];
      if (!f.nombre) faltan.push("nombre");
      if (!f.telefono) faltan.push("teléfono");
      if (!f.ciudad) faltan.push("ciudad");
      if (!f.direccion) faltan.push("dirección");
      if (faltan.length) { toast("Completa: " + faltan.join(", ")); return; }
      var pedidos = [];
      try { pedidos = JSON.parse(localStorage.getItem("flashop_pedidos")) || []; } catch (err) { pedidos = []; }
      pedidos.push({ fecha: new Date().toISOString(), items: cartRead(), total: cartSubtotal() + envio(cartSubtotal()), datos: f });
      localStorage.setItem("flashop_pedidos", JSON.stringify(pedidos));
      window.open(waLink(orderMessage(f)), "_blank");
      toast("Pedido guardado. Enviamos el detalle a WhatsApp.");
    });
  }

  /* ---------- animación de entrada ---------- */
  function revealInit() {
    var els = $$(".fade-up:not(.in)");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (en.isIntersecting) {
          setTimeout(function () { en.target.classList.add("in"); }, Math.min(i * 45, 260));
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -40px 0px", threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
    // Red de seguridad: si el observer no dispara (impresión, captura de página
    // completa, navegadores raros) el contenido aparece igual, nunca queda invisible.
    setTimeout(function () {
      $$(".fade-up:not(.in)").forEach(function (e) { e.classList.add("in"); });
    }, 1500);
  }

  /* ---------- API pública (usada por onclick inline) ---------- */
  window.Flashop = {
    add: cartAdd, toast: toast, money: money, openDrawer: openDrawer, closeDrawer: closeDrawer,
    count: cartCount, config: CFG
  };

  /* ---------- arranque ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var page = document.body.dataset.page || "";
    chrome(page === "home" ? "home" : page === "categoria" ? "cat" : "");
    if (page === "home") initHome();
    if (page === "categoria") initCategory();
    if (page === "producto") initProduct();
    if (page === "carrito") renderCartPage();
  });
})();
