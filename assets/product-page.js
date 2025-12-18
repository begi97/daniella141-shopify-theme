class ProductPage {
  constructor() {
    this.handler = document.getElementById("product_description_handler");
    this.content = document.getElementById("product_description_content");
    this.icon = document.getElementById("product_desc_icon");

    this.isOpen = true;
    this.bindEvents();
  }

  bindEvents() {
    this.handler?.addEventListener("click", () => {
      this.toggleDescription();
    });
  }

  toggleDescription() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.content.classList.add("block");
      this.content.classList.remove("hidden");
      this.icon.src = Shopify.assetUrl
        ? Shopify.assetUrl("minus.svg")
        : this.icon.src.replace("plus.svg", "minus.svg");
    } else {
      this.content.classList.add("hidden");
      this.content.classList.remove("block");
      this.icon.src = Shopify.assetUrl
        ? Shopify.assetUrl("plus.svg")
        : this.icon.src.replace("minus.svg", "plus.svg");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ProductPage();
});
