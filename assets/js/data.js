/* ============================================================
   FLASHOP — Catálogo (demo con marca propia)
   Estructura lista para conectar a WooCommerce/Dropi después:
   cada producto se identifica por `slug` (usado en ?p=slug).
   ============================================================ */
window.FLASHOP_CATALOG = {
  categorias: [
    { id: "tecnologia", nombre: "Tecnología y gadgets", icono: "tec" },
    { id: "hogar", nombre: "Hogar y cocina", icono: "hogar" },
    { id: "moda", nombre: "Moda", icono: "moda" },
    { id: "belleza", nombre: "Belleza y cuidado", icono: "belleza" },
    { id: "deportes", nombre: "Salud y bienestar", icono: "deportes" },
    { id: "camping", nombre: "Camping y aire libre", icono: "camping" },
    { id: "ninos", nombre: "Niños y juguetes", icono: "ninos" }
  ],

  productos: [
    {
      slug: "auriculares-anc-pro", nombre: "Auriculares AirBass Pro ANC inalámbricos",
      categoria: "tecnologia", precio: 109900, antes: 219900, badge: "OFERTA",
      rating: 4.8, reviews: 213, etiquetas: ["Envío gratis"],
      variantes: { nombre: "Color", opciones: ["Negro", "Azul eléctrico", "Blanco"] },
      corto: "Cancelación activa de ruido, 40 h de batería y estuche de carga rápida.",
      bullets: [
        "Cancelación activa de ruido híbrida (-35 dB)",
        "Hasta 40 horas de reproducción con el estuche",
        "Emparejamiento automático al abrir la tapa",
        "Resistentes al sudor (IPX5) y con micrófono dual"
      ],
      specs: [["Batería", "40 h con estuche"], ["Bluetooth", "5.3"], ["Resistencia", "IPX5"], ["Peso", "42 g"]]
    },
    {
      slug: "robot-aspirador-limpiamax", nombre: "Robot Aspirador LimpiaMax 4 en 1 con mapeo",
      categoria: "hogar", precio: 219900, antes: 429900, badge: "OFERTA",
      rating: 4.7, reviews: 158, etiquetas: ["Envío gratis"],
      variantes: { nombre: "Potencia", opciones: ["Estándar 2500 Pa", "Turbo 4000 Pa"] },
      corto: "Aspira, barre, trapea y esteriliza con UV. Control por app y regresa solo a su base.",
      bullets: [
        "4 funciones: aspira, barre, trapea y luz UV-C",
        "Mapeo láser y rutas por habitación desde la app",
        "Autonomía de 150 minutos y base de autocarga",
        "Antichoque y anticaída para escaleras"
      ],
      specs: [["Succión", "2500 / 4000 Pa"], ["Batería", "5200 mAh"], ["Depósito", "600 ml"], ["Control", "App + control remoto"]]
    },
    {
      slug: "mini-proyector-hd", nombre: "Mini Proyector HD Wi-Fi 1080P portátil",
      categoria: "tecnologia", precio: 189900, antes: 349900, badge: "OFERTA",
      rating: 4.6, reviews: 96, etiquetas: ["Envío gratis"],
      variantes: { nombre: "Sistema", opciones: ["Android TV", "Mirroring básico"] },
      corto: "Cine en casa hasta 120 pulgadas: Netflix, YouTube y espejo de pantalla.",
      bullets: [
        "Resolución Full HD con soporte de 1080p real",
        "Wi-Fi + Bluetooth: transmite desde el celular",
        "Parlante incorporado y salida para audífonos",
        "Corrección trapezoidal para paredes inclinadas"
      ],
      specs: [["Proyección", "hasta 120 in"], ["Lúmenes", "6000 ANSI-lum"], ["Entradas", "HDMI / USB / AV"], ["Vida útil", "30.000 h"]]
    },
    {
      slug: "smartwatch-pulse-fit-8", nombre: "Smartwatch Pulse Fit 8 con llamadas Bluetooth",
      categoria: "tecnologia", precio: 89900, antes: 179900, badge: "OFERTA",
      rating: 4.7, reviews: 342, etiquetas: ["Envío gratis"],
      variantes: { nombre: "Correa", opciones: ["Silicona negra", "Silicona azul", "Metálica"] },
      corto: "Oxímetro, ritmo cardíaco, 100 modos deportivos y notificaciones en la muñeca.",
      bullets: [
        "Pantalla AMOLED de 1.83 pulgadas siempre activa",
        "Mide oxígeno, ritmo cardíaco, sueño y estrés",
        "Responde llamadas y lee WhatsApp desde la muñeca",
        "Sumergible IP68 y batería de 7 días"
      ],
      specs: [["Pantalla", "1.83 in AMOLED"], ["Batería", "7 días"], ["Sensores", "SpO2 + HR"], ["Resistencia", "IP68"]]
    },
    {
      slug: "combo-cuero-3-en-1", nombre: "Combo Cuero 3 en 1: maletín + billetera + correa",
      categoria: "moda", precio: 149900, antes: 289900, badge: "OFERTA",
      rating: 4.5, reviews: 121, etiquetas: ["Envío gratis"],
      variantes: { nombre: "Color", opciones: ["Café", "Negro"] },
      corto: "Napa premium con costuras reforzadas: tres piezas que combinan entre sí.",
      bullets: [
        "Maletín antirrobo con cierre magnético y compartimento para portátil",
        "Billetera con bloqueo RFID y 8 espacios para tarjetas",
        "Correa ajustable de cuero para uso formal e informal",
        "Empaque listo para regalo"
      ],
      specs: [["Material", "Cuero PU premium"], ["Maletín", "40 × 30 × 12 cm"], ["Tarjetas", "8 espacios"], ["Seguridad", "Bloqueo RFID"]]
    },
    {
      slug: "depiladora-suave-skin", nombre: "Depiladora eléctrica Suave Skin — paga 1 lleva 2 cabezales",
      categoria: "belleza", precio: 69900, antes: 139900, badge: "OFERTA",
      rating: 4.6, reviews: 289, etiquetas: ["Envío gratis"],
      variantes: { nombre: "Color", opciones: ["Rosa", "Blanco"] },
      corto: "Indolora, con dos cabezales intercambiables y luz LED de precisión.",
      bullets: [
        "Sin dolor: no jala el vello de raíz",
        "2 cabezales: zona V y cuerpo completo",
        "Luz LED y cabezal desmontable lavable",
        "Uso en seco y recargable por USB-C"
      ],
      specs: [["Cabezales", "2 intercambiables"], ["Carga", "USB-C, 90 min"], ["Modos", "2 velocidades"], ["Ruido", "< 45 dB"]]
    },
    {
      slug: "freidora-aire-digital-5l", nombre: "Freidora de aire digital 5 L con 8 programas",
      categoria: "hogar", precio: 199900, antes: 399900, badge: "OFERTA",
      rating: 4.8, reviews: 204, etiquetas: ["Envío gratis"],
      variantes: { nombre: "Capacidad", opciones: ["5 L", "6.5 L"] },
      corto: "Cocina sin aceite con pantalla táctil y 8 recetas en un solo toque.",
      bullets: [
        "8 programas: papas, pollo, carne, pescado, hornear y más",
        "Cesta antiadherente desmontable, apta para lavavajillas",
        "Apagado automático y modo mantener caliente",
        "Hasta 80 % menos grasa que la fritura tradicional"
      ],
      specs: [["Capacidad", "5 L / 6.5 L"], ["Potencia", "1500 W"], ["Programas", "8"], ["Temperatura", "80 – 200 °C"]]
    },
    {
      slug: "kit-6-lamparas-solares", nombre: "Kit x6 lámparas inteligentes solares con sensor y control",
      categoria: "camping", precio: 89900, antes: 179900, badge: "OFERTA",
      rating: 4.5, reviews: 87, etiquetas: ["Envío gratis"],
      variantes: { nombre: "Cantidad", opciones: ["6 unidades", "12 unidades"] },
      corto: "Carga solar, sensor de movimiento y control remoto para interior y exterior.",
      bullets: [
        "Punto LED de alta luminosidad con 3 modos",
        "Sensor de movimiento y crepuscular",
        "Batería solar de litio: hasta 12 h encendida",
        "Pack x6 con control remoto"
      ],
      specs: [["Autonomía", "12 h"], ["Carga", "Solar"], ["Modos", "3"], ["Resistencia", "IP65"]]
    },
    {
      slug: "secador-ionico-5-en-1", nombre: "Secador iónico 5 en 1 con cepillo alisador y difusor",
      categoria: "belleza", precio: 129900, antes: 259900, badge: "OFERTA",
      rating: 4.7, reviews: 176, etiquetas: ["Envío gratis"],
      variantes: { nombre: "Juego", opciones: ["5 accesorios", "3 accesorios"] },
      corto: "Seca, alisa y da volumen con iones negativos que reducen el frizz.",
      bullets: [
        "Tecnología iónica: menos frizz y más brillo",
        "5 accesorios: secador, alisador, rizador, difusor y cepillo",
        "3 niveles de temperatura y golpe de aire frío",
        "Motor silencioso de CD con rejilla desmontable"
      ],
      specs: [["Potencia", "1600 W"], ["Temperaturas", "3 + aire frío"], ["Accesorios", "5"], ["Cable", "2.2 m giratorio"]]
    },
    {
      slug: "dron-mini-kids-hd", nombre: "Dron Mini Kids HD con cámara y control de gestos",
      categoria: "ninos", precio: 129900, antes: 249900, badge: "NUEVO",
      rating: 4.4, reviews: 64, etiquetas: ["Envío gratis"],
      variantes: { nombre: "Cámara", opciones: ["HD 720p", "HD 1080p"] },
      corto: "Vuela solo, graba y aterriza de emergencia. Ideal para primeros vuelos.",
      bullets: [
        "Cámara con transmisión en vivo al celular",
        "Despegue/aterrizaje con un botón y control de gestos",
        "Modos órbita y selfie automáticos",
        "2 baterías incluidas y hélices de repuesto"
      ],
      specs: [["Autonomía", "2 × 12 min"], ["Alcance", "80 m"], ["Cámara", "720p / 1080p"], ["Modos", "5"]]
    },
    {
      slug: "botella-termica-smart", nombre: "Botella térmica inteligente 500 ml con termómetro LED",
      categoria: "deportes", precio: 59900, antes: 119900, badge: "OFERTA",
      rating: 4.6, reviews: 132, etiquetas: ["Envío gratis"],
      variantes: { nombre: "Color", opciones: ["Negro mate", "Blanco", "Verde"] },
      corto: "Muestra la temperatura al tocar la tapa y mantiene el frío 24 h.",
      bullets: [
        "Termómetro LED en la tapa: temperatura al instante",
        "Acero inoxidable de doble pared: 24 h frío / 12 h caliente",
        "Antiderrame y libre de BPA",
        "Recordatorio de hidratación cada 2 horas"
      ],
      specs: [["Capacidad", "500 ml"], ["Aislamiento", "doble pared al vacío"], ["Frío", "24 h"], ["Caliente", "12 h"]]
    },
    {
      slug: "parlante-bluetooth-boombox", nombre: "Parlante Bluetooth BoomBox 20 W resistente al agua",
      categoria: "tecnologia", precio: 79900, antes: 159900, badge: "OFERTA",
      rating: 4.7, reviews: 198, etiquetas: ["Envío gratis"],
      variantes: { nombre: "Color", opciones: ["Negro", "Azul"] },
      corto: "20 W de sonido con graves profundos, luces LED y 12 h de batería.",
      bullets: [
        "20 W con radiador pasivo para graves potentes",
        "IPX7: se puede mojar sin riesgo",
        "Hasta 12 horas de música y entrada para microSD/USB",
        "Luces LED que siguen el ritmo de la música"
      ],
      specs: [["Potencia", "20 W"], ["Batería", "12 h"], ["Resistencia", "IPX7"], ["Extras", "TWS, microSD, AUX"]]
    },
    {
      slug: "organizador-cocina-modular", nombre: "Organizador modular de cocina 6 piezas apilables",
      categoria: "hogar", precio: 69900, antes: null, badge: null,
      rating: 4.5, reviews: 58, etiquetas: ["Envío gratis"],
      variantes: { nombre: "Pack", opciones: ["6 piezas", "9 piezas"] },
      corto: "Ordena despensa y nevera con recipientes herméticos apilables.",
      bullets: [
        "6 recipientes herméticos con tapa de sello",
        "Diseño apilable que aprovecha cada centímetro",
        "Libre de BPA y apto para nevera",
        "Fácil de limpiar, base transparente"
      ],
      specs: [["Piezas", "6 / 9"], ["Material", "PP libre de BPA"], ["Sellado", "hermético"], ["Lavado", "a mano"]]
    },
    {
      slug: "gimnasio-casa-bandas-set", nombre: "Set de gimnasio en casa: bandas + mancuernas ajustables",
      categoria: "deportes", precio: 119900, antes: null, badge: null,
      rating: 4.6, reviews: 71, etiquetas: []
    },
    {
      slug: "carpa-automatica-2p", nombre: "Carpa automática 2 personas impermeable con mosquitero",
      categoria: "camping", precio: 189900, antes: 289900, badge: "OFERTA",
      rating: 4.5, reviews: 44, etiquetas: ["Envío gratis"],
      variantes: { nombre: "Tamaño", opciones: ["2 personas", "3 personas"] },
      corto: "Se arma en 10 segundos, doble techo impermeable y ventilación superior.",
      bullets: [
        "Apertura automática en 10 segundos",
        "Doble techo con recubrimiento impermeable PU3000",
        "Mosquitero en puertas y techo para ventilar",
        "Incluye estacas, vientos y bolso de transporte"
      ],
      specs: [["Capacidad", "2 / 3 personas"], ["Impermeabilidad", "PU3000"], ["Peso", "3.4 kg"], ["Armado", "10 s"]]
    }
  ]
};
