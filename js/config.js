// ==========================================================================
// DELIRIO - CONFIGURACIÓN GENERAL DEL NEGOCIO
// ==========================================================================
// Puedes modificar estos valores en cualquier momento según tus necesidades.

const CONFIG = {
  // Datos de la Marca
  brandName: "Delirio",
  tagline: "Repostería de Autor & Cafetería de Especialidad",
  description: "Postres artesanales creados con devoción y café de origen tostado a la perfección en Cochabamba.",
  
  // WhatsApp y Contacto
  // Código de país 591 (Bolivia) seguido del número de WhatsApp sin espacios ni signos +
  whatsappNumber: "59177769199",
  whatsappDisplay: "+591 77769199",
  
  // Ubicación y Moneda
  city: "Cochabamba, Bolivia",
  storeAddress: "Cochabamba - Centro / Zona Norte (Atención para retiro y delivery)",
  currencySymbol: "Bs.",
  
  // Opciones de Entrega y Delivery
  delivery: {
    enabled: true,
    defaultFee: 15, // Costo de envío referencial en Bs.
    freeShippingThreshold: 200, // Envío gratis a partir de este monto en Bs. (0 para desactivar)
    pickupEnabled: true,
    estimatedTime: "45 a 90 minutos según disponibilidad",
  },
  
  // Horarios de Atención
  schedule: {
    weekdays: "Lunes a Viernes: 09:00 - 20:30",
    saturdays: "Sábados: 09:30 - 21:00",
    sundays: "Domingos: 10:00 - 18:00"
  },
  
  // Redes Sociales
  social: {
    instagram: "https://instagram.com/delirio_reposteria",
    tiktok: "https://tiktok.com/@delirio_reposteria",
    facebook: "https://facebook.com/delirioreposteria"
  }
};
