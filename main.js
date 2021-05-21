const menuBarBtn = document.getElementById("mobile-menu-btn");
const mobileNavBar = document.getElementById("mobile-navbar");
function toggleNavBar() {
  mobileNavBar.classList.toggle("open");
}

menuBarBtn.addEventListener("click", toggleNavBar);
