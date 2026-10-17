// ==========================================================================
// DELIRIO - LÓGICA DE INTERFAZ, INTERACCIONES Y CHECKOUT POR WHATSAPP
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  Cart.init();
  App.init();
});

const App = {
  currentCategory: "all",
  searchQuery: "",
  selectedProduct: null,
  deliveryType: "delivery", // "delivery" o "pickup"

  init() {
    this.injectConfigData();
    this.renderCategories();
    this.renderProducts();
    this.updateCartBadge();
    this.bindEvents();
    this.setupDateInputDefault();
  },

  // Inserta datos de marca y contacto en el DOM
  injectConfigData() {
    const brandEls = document.querySelectorAll(".brand-name");
    brandEls.forEach(el => el.textContent = CONFIG.brandName);

    const phoneEls = document.querySelectorAll(".brand-phone");
    phoneEls.forEach(el => el.textContent = CONFIG.whatsappDisplay);

    const cityEls = document.querySelectorAll(".brand-city");
    cityEls.forEach(el => el.textContent = CONFIG.city);

    const addressEls = document.querySelectorAll(".brand-address");
    addressEls.forEach(el => el.textContent = CONFIG.storeAddress);

    const feeEl = document.getElementById("checkout-shipping-fee-text");
    if (feeEl) feeEl.textContent = `Bs. ${CONFIG.delivery.defaultFee}`;
  },

  // Asigna por defecto la fecha de hoy/mañana en el selector
  setupDateInputDefault() {
    const dateInput = document.getElementById("order-date");
    if (dateInput) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      dateInput.min = `${yyyy}-${mm}-${dd}`;
      dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
  },

  // Renderiza los botones de categorías
  renderCategories() {
    const container = document.getElementById("categories-container");
    if (!container) return;

    container.innerHTML = CATEGORIES.map(cat => `
      <button class="category-pill ${cat.id === this.currentCategory ? 'active' : ''}" data-category="${cat.id}">
        <span class="category-icon">${cat.icon}</span>
        <span class="category-name">${cat.name}</span>
      </button>
    `).join("");

    container.querySelectorAll(".category-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        container.querySelectorAll(".category-pill").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentCategory = btn.dataset.category;
        this.renderProducts();
      });
    });
  },

  // Renderiza la grilla de productos con soporte para fallback de imágenes
  renderProducts() {
    const grid = document.getElementById("products-grid");
    const countEl = document.getElementById("products-count");
    if (!grid) return;

    let filtered = PRODUCTS;

    if (this.currentCategory !== "all") {
      filtered = filtered.filter(p => p.category === this.currentCategory);
    }

    if (this.searchQuery.trim() !== "") {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    if (countEl) {
      countEl.textContent = `${filtered.length} producto${filtered.length === 1 ? '' : 's'}`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🍰</div>
          <h3>No encontramos postres que coincidan</h3>
          <p>Prueba buscando con otra palabra o revisa otra categoría del menú.</p>
          <button class="btn btn-outline" id="btn-reset-filters">Ver todo el menú</button>
        </div>
      `;
      const resetBtn = document.getElementById("btn-reset-filters");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          this.currentCategory = "all";
          this.searchQuery = "";
          const searchInput = document.getElementById("search-input");
          if (searchInput) searchInput.value = "";
          this.renderCategories();
          this.renderProducts();
        });
      }
      return;
    }

    grid.innerHTML = filtered.map(product => {
      return `
        <article class="product-card" data-id="${product.id}">
          <div class="product-image-wrap">
            <img 
              src="${product.localImage}" 
              onerror="this.onerror=null; this.src='${product.fallbackImage}';" 
              alt="${product.name}" 
              loading="lazy"
              class="product-image"
            />
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
          </div>
          <div class="product-info">
            <span class="product-unit">${product.unit || 'Delirio Repostería'}</span>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
              <div class="product-price">
                <span class="currency">${CONFIG.currencySymbol}</span>
                <span class="amount">${product.price}</span>
              </div>
              <button class="btn-add-quick" data-id="${product.id}" title="Ver opciones y agregar">
                <span>Pedir</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    // Eventos en tarjetas
    grid.querySelectorAll(".product-card").forEach(card => {
      card.addEventListener("click", (e) => {
        const id = card.dataset.id;
        this.openProductModal(id);
      });
    });
  },

  // Modal de detalle de producto
  openProductModal(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    this.selectedProduct = product;
    let selectedVariantIndex = 0;
    let quantity = 1;

    const modal = document.getElementById("product-modal");
    const container = document.getElementById("modal-product-content");

    const renderModalBody = () => {
      const currentVariant = product.variants ? product.variants[selectedVariantIndex] : { priceDelta: 0 };
      const currentPrice = product.price + (currentVariant.priceDelta || 0);

      container.innerHTML = `
        <div class="modal-product-layout">
          <div class="modal-image-col">
            <img 
              src="${product.localImage}" 
              onerror="this.onerror=null; this.src='${product.fallbackImage}';" 
              alt="${product.name}" 
              class="modal-product-img"
            />
          </div>
          <div class="modal-info-col">
            <div class="modal-header-info">
              ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
              <h2 class="modal-product-title">${product.name}</h2>
              <p class="modal-product-desc">${product.description}</p>
            </div>

            ${product.variants && product.variants.length > 1 ? `
              <div class="modal-variants-section">
                <label class="modal-field-label">Selecciona la presentación:</label>
                <div class="variant-options">
                  ${product.variants.map((v, idx) => `
                    <label class="variant-option-card ${idx === selectedVariantIndex ? 'active' : ''}">
                      <input type="radio" name="product-variant" value="${idx}" ${idx === selectedVariantIndex ? 'checked' : ''} />
                      <div class="variant-card-content">
                        <span class="variant-card-title">${v.name}</span>
                        <span class="variant-card-price">${CONFIG.currencySymbol} ${product.price + (v.priceDelta || 0)}</span>
                      </div>
                    </label>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            ${product.customizable ? `
              <div class="modal-custom-section">
                <label class="modal-field-label" for="product-dedication">
                  Dedicatoria / Mensaje en tarjeta (Opcional):
                </label>
                <input 
                  type="text" 
                  id="product-dedication" 
                  class="input-custom" 
                  placeholder="Ej: ¡Feliz Cumpleaños Camila! / Con mucho amor"
                  maxlength="80"
                />
                <span class="field-hint">Incluiremos una tarjeta caligráfica sin costo extra.</span>
              </div>
            ` : ''}

            <div class="modal-actions-bar">
              <div class="quantity-control">
                <button class="btn-qty" id="modal-qty-minus">−</button>
                <span class="qty-display" id="modal-qty-num">${quantity}</span>
                <button class="btn-qty" id="modal-qty-plus">+</button>
              </div>

              <button class="btn btn-primary btn-modal-add" id="btn-confirm-add">
                <span>Agregar al Carrito</span>
                <span class="dot-separator">•</span>
                <span>${CONFIG.currencySymbol} ${currentPrice * quantity}</span>
              </button>
            </div>
          </div>
        </div>
      `;

      // Eventos de selección de variante
      const radioInputs = container.querySelectorAll("input[name='product-variant']");
      radioInputs.forEach(input => {
        input.addEventListener("change", (e) => {
          selectedVariantIndex = parseInt(e.target.value);
          renderModalBody();
        });
      });

      // Controles de cantidad
      const minusBtn = container.getElementById("modal-qty-minus");
      const plusBtn = container.getElementById("modal-qty-plus");

      if (minusBtn) {
        minusBtn.addEventListener("click", () => {
          if (quantity > 1) {
            quantity--;
            renderModalBody();
          }
        });
      }

      if (plusBtn) {
        plusBtn.addEventListener("click", () => {
          quantity++;
          renderModalBody();
        });
      }

      // Botón agregar al carrito
      const addBtn = container.getElementById("btn-confirm-add");
      if (addBtn) {
        addBtn.addEventListener("click", () => {
          const dedicationInput = container.querySelector("#product-dedication");
          const dedication = dedicationInput ? dedicationInput.value : "";
          
          Cart.addItem(product.id, selectedVariantIndex, quantity, dedication);
          this.updateCartBadge();
          this.closeProductModal();
          this.showToast(`¡${product.name} agregado al carrito!`);
          this.openCartDrawer();
        });
      }
    };

    renderModalBody();
    modal.classList.add("open");
    document.body.classList.add("modal-open");
  },

  closeProductModal() {
    const modal = document.getElementById("product-modal");
    if (modal) modal.classList.remove("open");
    document.body.classList.remove("modal-open");
  },

  // Carrito Drawer (Slide-Over)
  openCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    if (!drawer) return;
    this.renderCartItems();
    drawer.classList.add("open");
    document.body.classList.add("drawer-open");
  },

  closeCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    if (drawer) drawer.classList.remove("open");
    document.body.classList.remove("drawer-open");
  },

  updateCartBadge() {
    const count = Cart.getCount();
    const badges = document.querySelectorAll(".cart-count-badge");
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? "inline-flex" : "none";
    });
  },

  renderCartItems() {
    const list = document.getElementById("cart-items-list");
    const emptyView = document.getElementById("cart-empty-view");
    const footerView = document.getElementById("cart-footer-view");
    if (!list) return;

    if (Cart.items.length === 0) {
      list.innerHTML = "";
      if (emptyView) emptyView.style.display = "flex";
      if (footerView) footerView.style.display = "none";
      return;
    }

    if (emptyView) emptyView.style.display = "none";
    if (footerView) footerView.style.display = "block";

    list.innerHTML = Cart.items.map(item => `
      <div class="cart-item-row" data-id="${item.cartItemId}">
        <img 
          src="${item.image}" 
          onerror="this.onerror=null; this.src='${item.fallbackImage}';" 
          alt="${item.name}" 
          class="cart-item-thumb"
        />
        <div class="cart-item-details">
          <h4 class="cart-item-name">${item.name}</h4>
          ${item.variantName && item.variantName !== "Estándar" ? `<span class="cart-item-variant">${item.variantName}</span>` : ''}
          ${item.dedication ? `<span class="cart-item-dedication">💌 "${item.dedication}"</span>` : ''}
          <div class="cart-item-price-unit">${CONFIG.currencySymbol} ${item.unitPrice} c/u</div>
        </div>
        <div class="cart-item-controls">
          <div class="cart-item-qty-wrap">
            <button class="btn-cart-qty" data-action="minus" data-id="${item.cartItemId}">−</button>
            <span class="cart-qty-val">${item.quantity}</span>
            <button class="btn-cart-qty" data-action="plus" data-id="${item.cartItemId}">+</button>
          </div>
          <span class="cart-item-subtotal">${CONFIG.currencySymbol} ${item.unitPrice * item.quantity}</span>
        </div>
      </div>
    `).join("");

    // Eventos dentro de la lista de items
    list.querySelectorAll(".btn-cart-qty").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        Cart.updateQuantity(id, action === "plus" ? 1 : -1);
        this.updateCartBadge();
        this.renderCartItems();
      });
    });

    this.updateCheckoutTotals();
  },

  updateCheckoutTotals() {
    const totals = Cart.calculateTotal(this.deliveryType);
    
    const subtotalEl = document.getElementById("summary-subtotal");
    const shippingEl = document.getElementById("summary-shipping");
    const totalEl = document.getElementById("summary-total");

    if (subtotalEl) subtotalEl.textContent = `Bs. ${totals.subtotal}`;
    
    if (shippingEl) {
      if (this.deliveryType === "pickup") {
        shippingEl.textContent = "Gratis (Retiro en local)";
      } else if (totals.shipping === 0) {
        shippingEl.textContent = "¡Envío Gratis!";
      } else {
        shippingEl.textContent = `Bs. ${totals.shipping}`;
      }
    }

    if (totalEl) totalEl.textContent = `Bs. ${totals.total}`;
  },

  // Genera el mensaje y lanza WhatsApp
  handleCheckout() {
    if (Cart.items.length === 0) {
      alert("Tu carrito está vacío. Agrega tus postres favoritos antes de continuar.");
      return;
    }

    const nameInput = document.getElementById("order-name");
    const phoneInput = document.getElementById("order-phone");
    const addressInput = document.getElementById("order-address");
    const dateInput = document.getElementById("order-date");
    const timeInput = document.getElementById("order-time");
    const notesInput = document.getElementById("order-notes");

    const name = nameInput ? nameInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";
    const address = addressInput ? addressInput.value.trim() : "";
    const date = dateInput ? dateInput.value : "";
    const time = timeInput ? timeInput.value : "";
    const notes = notesInput ? notesInput.value.trim() : "";

    if (!name) {
      alert("Por favor ingresa tu nombre para el pedido.");
      if (nameInput) nameInput.focus();
      return;
    }

    if (this.deliveryType === "delivery" && !address) {
      alert("Por favor ingresa la dirección de entrega en Cochabamba.");
      if (addressInput) addressInput.focus();
      return;
    }

    const totals = Cart.calculateTotal(this.deliveryType);

    // Formatear mensaje para WhatsApp con estilo Delirio
    let msg = `🍰 *¡HOLA DELIRIO! QUIERO REALIZAR UN PEDIDO*\n\n`;
    msg += `📋 *DETALLE DEL PEDIDO:*\n`;

    Cart.items.forEach(item => {
      msg += `• *${item.quantity}x ${item.name}*`;
      if (item.variantName && item.variantName !== "Estándar") {
        msg += ` (${item.variantName})`;
      }
      msg += ` — Bs. ${item.unitPrice * item.quantity}\n`;
      if (item.dedication) {
        msg += `  💌 _Dedicatoria: "${item.dedication}"_\n`;
      }
    });

    msg += `\n💵 *RESUMEN:*\n`;
    msg += `• Subtotal: Bs. ${totals.subtotal}\n`;
    if (this.deliveryType === "delivery") {
      msg += `• Envío a Domicilio: ${totals.shipping === 0 ? 'Gratis' : 'Bs. ' + totals.shipping}\n`;
    } else {
      msg += `• Retiro en Local: Sin costo adicional\n`;
    }
    msg += `• *TOTAL A PAGAR: Bs. ${totals.total}*\n\n`;

    msg += `👤 *DATOS DEL CLIENTE:*\n`;
    msg += `• Nombre: ${name}\n`;
    if (phone) msg += `• Teléfono de contacto: ${phone}\n`;
    msg += `• Modalidad: ${this.deliveryType === 'delivery' ? '🛵 Delivery a Domicilio' : '🏪 Retiro en Tienda (Pickup)'}\n`;
    
    if (this.deliveryType === "delivery") {
      msg += `• Dirección de entrega: ${address}\n`;
    }

    if (date || time) {
      msg += `• Fecha / Hora preferida: ${date || 'Hoy'} a las ${time || 'lo antes posible'}\n`;
    }

    if (notes) {
      msg += `• Notas especiales: ${notes}\n`;
    }

    msg += `\n_Pedido generado desde la tienda web de Delirio._`;

    // Abrir WhatsApp Web / App
    const encodedMsg = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMsg}`;

    window.open(whatsappUrl, "_blank");
  },

  // Notificación flotante Toast
  showToast(message) {
    let toast = document.getElementById("toast-notification");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast-notification";
      toast.className = "toast-notification";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("visible");
    setTimeout(() => {
      toast.classList.remove("visible");
    }, 2800);
  },

  // Event Listeners generales
  bindEvents() {
    // Buscador
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value;
        this.renderProducts();
      });
    }

    // Botones para abrir y cerrar el carrito
    const openCartBtns = document.querySelectorAll(".btn-open-cart");
    openCartBtns.forEach(btn => {
      btn.addEventListener("click", () => this.openCartDrawer());
    });

    const closeCartBtn = document.getElementById("btn-close-cart");
    if (closeCartBtn) {
      closeCartBtn.addEventListener("click", () => this.closeCartDrawer());
    }

    const drawerBackdrop = document.getElementById("cart-drawer-backdrop");
    if (drawerBackdrop) {
      drawerBackdrop.addEventListener("click", () => this.closeCartDrawer());
    }

    // Modal de producto cerrar
    const closeModalBtn = document.getElementById("btn-close-modal");
    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", () => this.closeProductModal());
    }

    const modalBackdrop = document.getElementById("modal-backdrop");
    if (modalBackdrop) {
      modalBackdrop.addEventListener("click", () => this.closeProductModal());
    }

    // Selector Delivery vs Retiro
    const deliveryRadio = document.getElementById("radio-delivery");
    const pickupRadio = document.getElementById("radio-pickup");
    const addressFieldGroup = document.getElementById("address-field-group");

    if (deliveryRadio && pickupRadio) {
      deliveryRadio.addEventListener("change", () => {
        if (deliveryRadio.checked) {
          this.deliveryType = "delivery";
          if (addressFieldGroup) addressFieldGroup.style.display = "block";
          this.updateCheckoutTotals();
        }
      });

      pickupRadio.addEventListener("change", () => {
        if (pickupRadio.checked) {
          this.deliveryType = "pickup";
          if (addressFieldGroup) addressFieldGroup.style.display = "none";
          this.updateCheckoutTotals();
        }
      });
    }

    // Botón Checkout por WhatsApp
    const checkoutBtn = document.getElementById("btn-checkout-whatsapp");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => this.handleCheckout());
    }

    // Botón Vaciar Carrito
    const clearCartBtn = document.getElementById("btn-clear-cart");
    if (clearCartBtn) {
      clearCartBtn.addEventListener("click", () => {
        if (confirm("¿Seguro que deseas vaciar el carrito?")) {
          Cart.clear();
          this.updateCartBadge();
          this.renderCartItems();
        }
      });
    }
  }
};
