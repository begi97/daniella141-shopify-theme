class CartDrawer {
  constructor() {
    this.drawer = document.getElementById("cart-drawer");
    this.overlay = document.getElementById("cart-overlay");
    this.content = document.getElementById("cart-drawer-content");
    this.cartIcon = document.getElementById("cart-icon");

    this.bindEvents();
  }

  bindEvents() {
    // Add to cart
    document.addEventListener("submit", (e) => {
      if (e.target.matches("#product-form")) {
        e.preventDefault();
        this.addToCart(e.target);
      }
    });

    // Open from cart icon
    if (this.cartIcon) {
      this.cartIcon.addEventListener("click", () => {
        this.openWithCart();
      });
    }

    // close cart
    document
      .getElementById("close-cart")
      ?.addEventListener("click", () => this.close());
    this.overlay?.addEventListener("click", () => this.close());

    // Event listener for Apply button
    document.getElementById("apply-discount")?.addEventListener("click", () => {
      const codeInput = document.getElementById("discount-code");
      const code = codeInput.value.trim(); // get the value from input
      if (!code) return; // do nothing if empty
      this.applyDiscount(code); // pass it to the method
    });
  }

  // add to cart
  async addToCart(form) {
    const formData = new FormData(form);

    await fetch("/cart/add.js", {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    await this.openWithCart();
  }

  async openWithCart() {
    const res = await fetch("/cart.js");
    const cart = await res.json();

    this.render(cart);
    this.open();
  }

  // render cart and its items
  render(cart) {
    if (cart.item_count === 0) {
      this.content.innerHTML = `<p>Your cart is empty</p>`;
      return;
    }

    this.content.innerHTML = `
      <ul class="space-y-4">
        ${cart.items
          .map(
            (item) => `
            <li class="flex gap-4">
              <img src="${item.image}" class="w-16 h-16 object-cover">
              <div>
                <p class="font-medium">${item.product_title}</p>
                <p>${item.quantity} × ${this.formatMoney(item.price)}</p>
              </div>
            </li>
          `
          )
          .join("")}
      </ul>

      <div class="mt-6 border-t pt-4">
        <p class="font-semibold">Total: ${this.formatMoney(cart.total_price)}
      </div>
    `;
  }

  // opens cart
  open() {
    this.drawer.classList.remove("translate-x-full");
    this.overlay.classList.remove("hidden");
  }

  // closes cart
  close() {
    this.drawer.classList.add("translate-x-full");
    this.overlay.classList.add("hidden");
  }

  // formats money
  formatMoney(cents) {
    if (typeof cents !== "number") return "";

    return new Intl.NumberFormat(document.documentElement.lang || "en-US", {
      style: "currency",
      currency: Shopify?.currency?.active || "USD",
    }).format(cents / 100);
  }

  // applies discount
  async applyDiscount(code) {
    try {
      const res = await fetch("/cart/update.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discount: code }), // send discount code
      });

      if (!res.ok) throw new Error("Failed to apply discount");

      const cart = await res.json(); // Shopify recalculates totals
      this.render(cart); // update cart drawer totals
    } catch (err) {
      console.error(err);
      alert("Invalid discount code or something went wrong");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.cartDrawer = new CartDrawer();
});
