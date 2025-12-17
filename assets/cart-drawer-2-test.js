class CartDrawer2 {
  constructor() {
    this.cart = document.getElementById("cart-drawer");
    this.bindEvents();
  }

  bindEvents() {
    console.log("We are binding all events here");
    this.open();
    this.close();
  }

  open() {
    console.log("here we will click and open the cart");
  }

  close() {
    console.log("Here we will click and close the cart");
  }
}

// document.addEventListener("DOMContentLoaded", () => {
//   console.log("i am called");
//   window.cartDrawer2 = new CartDrawer2();
// });
