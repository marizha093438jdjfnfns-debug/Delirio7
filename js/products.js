// ==========================================================================
// DELIRIO - CATÁLOGO DE PRODUCTOS Y MENÚ ACTUALIZADO
// ==========================================================================

const CATEGORIES = [
  { id: "all", name: "Todo el Menú", icon: "✨" },
  { id: "tartas", name: "Tartas & Hojaldres", icon: "🍰" },
  { id: "crepes", name: "Crepes Artesanales", icon: "🥞" },
  { id: "bebidas", name: "Bebidas & Infusiones", icon: "🍹" },
  { id: "vasitos", name: "Vasitos & Individuales", icon: "🍮" },
  { id: "cookies", name: "Cookies & Brownies", icon: "🍪" },
  { id: "saludable", name: "Línea Saludable & Fit", icon: "🌱" }
];

const PRODUCTS = [
  // --- PRODUCTOS DESTACADOS CON FOTOS REALES DE DELIRIO ---
  {
    id: "tartaleta-frutos-rojos-flores",
    name: "Tartaleta Hojaldrada con Frutos Rojos & Flores",
    category: "tartas",
    price: 38,
    unit: "Creación de autor individual",
    description: "Crujiente base hojaldrada horneada a la perfección, rellena con crema diplomática suave y coronada con frambuesas frescas, fresas glaseadas, granos de granada y flores comestibles de nuestro huerto.",
    badge: "Firma Delirio",
    localImage: "assets/images/products/tartaleta-frutos-rojos-flores.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80",
    variants: [
      { name: "Tartaleta Individual (plato)", priceDelta: 0 },
      { name: "Caja x 2 Tartaletas de Autor", priceDelta: 34 } // 72 Bs
    ],
    customizable: true
  },
  {
    id: "crepes-amapola-arandanos-crema",
    name: "Crepes de Semillas de Amapola con Crema & Arándanos",
    category: "crepes",
    price: 36,
    unit: "Porción de 3 crepes doblados",
    description: "Tiernos crepes artesanales salpicados con semillas de amapola, rellenos de crema dulce de queso mascarpone con ralladura de limón amarillo, bañados en coulis de arándanos silvestres y frutos frescos.",
    badge: "Favorito Brunch",
    localImage: "assets/images/products/crepes-amapola-arandanos-crema.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=80",
    variants: [
      { name: "Porción Tradicional (3 unidades)", priceDelta: 0 },
      { name: "Porción Doble para Compartir (6 unidades)", priceDelta: 30 } // 66 Bs
    ],
    customizable: false
  },
  {
    id: "crepes-roll-nutella-fresa",
    name: "Crepes Rolls con Nutella & Fresa Liofilizada",
    category: "crepes",
    price: 34,
    unit: "Trilogía de crepes enrollados",
    description: "Tres crepes dorados en cilindro rellenos de crema de cacao, rociados con hilos generosos de Nutella tibia y escamas crujientes de fresa natural deshidratada.",
    badge: "Tentación Dulce",
    localImage: "assets/images/products/crepes-roll-nutella-fresa.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=800&q=80",
    variants: [
      { name: "Trilogía Clásica (3 rollos)", priceDelta: 0 },
      { name: "Con bola extra de helado artesanal", priceDelta: 12 } // 46 Bs
    ],
    customizable: false
  },
  {
    id: "infusiones-frutales-artesanales",
    name: "Infusiones Frutales Frescas & Hierbas Botánicas",
    category: "bebidas",
    price: 22,
    unit: "Vaso de 400ml con fruta fresca",
    description: "Bebidas maceradas en frío con pura fruta de estación y hierbas aromáticas recién cortadas. Ligeras, sumamente refrescantes y con presentación de autor.",
    badge: "100% Natural",
    localImage: "assets/images/products/infusiones-frutales-artesanales.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
    variants: [
      { name: "Frutos Rojos & Tomillo Fresco", priceDelta: 0 },
      { name: "Maracuyá, Mango & Menta", priceDelta: 0 },
      { name: "Kiwi, Uvas Verdes & Limón", priceDelta: 0 },
      { name: "Cítricos, Durazno & Romero", priceDelta: 0 }
    ],
    customizable: false
  },
  {
    id: "mocktails-frutas-especialidad",
    name: "Mocktails Botánicos & Spritz Floral",
    category: "bebidas",
    price: 25,
    unit: "Copa de 450ml",
    description: "Cócteles artesanales sin alcohol con soda cristalina, pulpas naturales, flores de pensamiento comestibles y especias aromáticas.",
    badge: "Especialidad",
    localImage: "assets/images/products/mocktails-frutas-especialidad.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80",
    variants: [
      { name: "Maracuyá Tropical con Flor Púrpura", priceDelta: 0 },
      { name: "Pomelo Rosado & Frambuesas", priceDelta: 0 },
      { name: "Infusión de Flor de Jazmín & Limón", priceDelta: 0 }
    ],
    customizable: false
  },

  // --- TARTAS & CHEESECAKES ---
  {
    id: "cheesecake-frutos-rojos",
    name: "Cheesecake Clásico de Frutos Rojos",
    category: "tartas",
    price: 180,
    unit: "Tarta entera (10-12 porciones)",
    description: "Cremoso cheesecake estilo New York horneado a fuego lento, base de galleta con mantequilla y coulis artesanal de frutos del bosque frescos.",
    badge: "Más Vendido",
    localImage: "assets/images/products/cheesecake-frutos-rojos.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    variants: [
      { name: "Tarta Entera (10-12 porciones)", priceDelta: 0 },
      { name: "Porción Individual", priceDelta: -155 } // 25 Bs
    ],
    customizable: true
  },
  {
    id: "tarta-chocolate-belga",
    name: "Tarta de Chocolate Belga 70% & Praliné",
    category: "tartas",
    price: 195,
    unit: "Tarta entera (10 porciones)",
    description: "Ganache sedosa de chocolate belga de origen, crocante praliné de avellanas tostadas y base de masa sableé de cacao.",
    badge: "Gourmet",
    localImage: "assets/images/products/tarta-chocolate-belga.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    variants: [
      { name: "Tarta Entera (10 porciones)", priceDelta: 0 },
      { name: "Porción Individual", priceDelta: -168 } // 27 Bs
    ],
    customizable: true
  },
  {
    id: "pie-limon",
    name: "Pie de Limón con Merengue Suizo",
    category: "tartas",
    price: 140,
    unit: "Tarta entera (8-10 porciones)",
    description: "Curd de limón sutilmente ácido en base crujiente de masa quebrada, coronado con generoso merengue suizo flameado al soplete.",
    badge: "Clásico",
    localImage: "assets/images/products/pie-limon.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80",
    variants: [
      { name: "Tarta Entera (8-10 porciones)", priceDelta: 0 },
      { name: "Porción Individual", priceDelta: -118 } // 22 Bs
    ],
    customizable: true
  },

  // --- VASITOS & POSTRES INDIVIDUALES ---
  {
    id: "tiramisu-vasito",
    name: "Tiramisú de Especialidad en Vaso",
    category: "vasitos",
    price: 25,
    unit: "Vasito individual (220ml)",
    description: "Bizcochos savoiardi embebidos en espresso de altura, crema suave de queso mascarpone y lluvia de cacao puro amargo.",
    badge: "Favorito",
    localImage: "assets/images/products/tiramisu-vasito.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80",
    variants: [
      { name: "Unidad (1 vasito)", priceDelta: 0 },
      { name: "Pack x 4 vasitos", priceDelta: 65 } // 90 Bs
    ],
    customizable: false
  },
  {
    id: "tres-leches-vasito",
    name: "Tres Leches Delirio & Dulce de Leche",
    category: "vasitos",
    price: 24,
    unit: "Vasito individual (220ml)",
    description: "Bizcochuelo sumamente húmedo bañado en infusión de tres leches, toffee de dulce de leche artesanal y canela en rama.",
    badge: "Tradicional",
    localImage: "assets/images/products/tres-leches-vasito.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80",
    variants: [
      { name: "Unidad (1 vasito)", priceDelta: 0 },
      { name: "Pack x 4 vasitos", priceDelta: 62 } // 86 Bs
    ],
    customizable: false
  },

  // --- COOKIES, BROWNIES & ALFAJORES ---
  {
    id: "cookie-nutella",
    name: "Cookie XL Nutella & Cristales de Sal",
    category: "cookies",
    price: 18,
    unit: "Unidad XL (120g)",
    description: "Galleta dorada por fuera y centro volcánico fundente de Nutella auténtica con escamas de sal marina.",
    badge: "Top Tentación",
    localImage: "assets/images/products/cookie-nutella.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80",
    variants: [
      { name: "Unidad individual", priceDelta: 0 },
      { name: "Caja x 3 unidades", priceDelta: 30 }, // 48 Bs
      { name: "Caja x 6 unidades", priceDelta: 72 }  // 90 Bs
    ],
    customizable: false
  },
  {
    id: "brownie-nuez",
    name: "Brownie Fudgy con Nueces del Valle",
    category: "cookies",
    price: 16,
    unit: "Porción generosa",
    description: "Brownie extra húmedo e intenso de puro chocolate semiamargo, con costra quebradiza y trozos de nueces tostadas.",
    badge: "Imperdible",
    localImage: "assets/images/products/brownie-nuez.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    variants: [
      { name: "Porción individual", priceDelta: 0 },
      { name: "Caja Degustación x 4 brownies", priceDelta: 42 } // 58 Bs
    ],
    customizable: false
  },
  {
    id: "alfajores-maicena",
    name: "Alfajores de Maicena Artesanales",
    category: "cookies",
    price: 35,
    unit: "Caja con 6 unidades",
    description: "Masa ultra suave que se deshace en la boca, relleno generoso de dulce de leche repostero y bordeado de coco rallado fino.",
    badge: "Artesanal",
    localImage: "assets/images/products/alfajores-maicena.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80",
    variants: [
      { name: "Caja x 6 unidades", priceDelta: 0 },
      { name: "Caja x 12 unidades", priceDelta: 30 } // 65 Bs
    ],
    customizable: false
  },

  // --- LÍNEA SALUDABLE & FIT ---
  {
    id: "cheesecake-keto",
    name: "Cheesecake Keto Frutos Rojos (Sin Azúcar)",
    category: "saludable",
    price: 32,
    unit: "Porción individual",
    description: "Elaborado con queso crema premium, endulzado con alulosa / monkfruit y base crujiente de harina de almendras. Bajo en carbohidratos.",
    badge: "Keto / Sin Azúcar",
    localImage: "assets/images/products/cheesecake-keto.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80",
    variants: [
      { name: "Porción Individual", priceDelta: 0 },
      { name: "Tarta Entera Keto (8 porciones)", priceDelta: 168 } // 200 Bs
    ],
    customizable: true
  },
  {
    id: "brownie-fit-avena",
    name: "Brownie Fit de Avena, Cacao & Datil",
    category: "saludable",
    price: 18,
    unit: "Porción individual",
    description: "Sin azúcar refinada, sin harina de trigo ni lácteos. Endulzado naturalmente con pasta de dátiles y cacao amargo 100%.",
    badge: "Gluten Free & Vegano",
    localImage: "assets/images/products/brownie-fit-avena.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1515037893149-de7f840978e2?auto=format&fit=crop&w=800&q=80",
    variants: [
      { name: "Unidad individual", priceDelta: 0 },
      { name: "Pack x 4 brownies fit", priceDelta: 48 } // 66 Bs
    ],
    customizable: false
  }
];
