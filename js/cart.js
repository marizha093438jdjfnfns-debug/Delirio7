// ==========================================================================
// DELIRIO - GESTIÓN DEL CARRITO DE COMPRAS
// ==========================================================================

const Cart = {
  items: [],
  storageKey: "delirio_cart_v1",

  init() {
    this.load();
  },

  load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      this.items = stored ? JSON.parse(stored) : [];
    } catch (e) {
      this.items = [];
    }
  },

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (e) {
      console.warn("No se pudo guardar el carrito:", e);
    }
  },

  // Agrega un producto al carrito
  addItem(productId, variantIndex = 0, quantity = 1, dedication = "") {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return false;

    const variant = product.variants && product.variants[variantIndex] 
      ? product.variants[variantIndex] 
      : { name: "Estándar", priceDelta: 0 };

    const unitPrice = product.price + (variant.priceDelta || 0);
    const cartItemId = `${productId}-${variantIndex}-${dedication.trim().toLowerCase()}`;

    const existingIndex = this.items.findIndex(item => item.cartItemId === cartItemId);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        cartItemId,
        productId,
        name: product.name,
        variantName: variant.name,
        unitPrice,
        quantity,
        dedication: dedication.trim(),
        image: product.localImage,
        fallbackImage: product.fallbackImage
      });
    }

    this.save();
    return true;
  },

  updateQuantity(cartItemId, delta) {
    const item = this.items.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(cartItemId);
    } else {
      this.save();
    }
  },

  removeItem(cartItemId) {
    this.items = this.items.filter(i => i.cartItemId !== cartItemId);
    this.save();
  },

  clear() {
    this.items = [];
    this.save();
  },

  getCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  },

  calculateTotal(deliveryType = "pickup") {
    const subtotal = this.getSubtotal();
    let shipping = 0;

    if (deliveryType === "delivery") {
      if (CONFIG.delivery.freeShippingThreshold > 0 && subtotal >= CONFIG.delivery.freeShippingThreshold) {
        shipping = 0;
      } else {
        shipping = CONFIG.delivery.defaultFee;
      }
    }

    return {
      subtotal,
      shipping,
      total: subtotal + shipping
    };
  }
};
