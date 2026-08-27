const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const closeCart = document.querySelector("#close-cart");

cartIcon.addEventListener("click", () => cart.classList.add("active"));
closeCart.addEventListener("click", () => cart.classList.remove("active"));
