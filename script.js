const hamburger = document.querySelector(".header_nav-hamburger");
const mobileNav = document.querySelector(".header_nav-mobile");

hamburger.addEventListener("click", () => {
  mobileNav.classList.toggle("closed");
});
