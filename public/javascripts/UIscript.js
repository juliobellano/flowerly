const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");
const loginButton = document.querySelector(".log-in-button");
const loginModal = document.querySelector(".login-modal");
const loginCloseButton = document.querySelector("#login-close-button");

loginButton.addEventListener("click", () => {
  document.body.classList.add("show-login-modal");
});

loginCloseButton.addEventListener("click", () => {
  document.body.classList.remove("show-login-modal");
});

// Close modal when clicking outside the login container
loginModal.addEventListener("click", (e) => {
  if (e.target === loginModal) {
    document.body.classList.remove("show-login-modal");
  }
});

// Prevent closing when clicking inside the login container
loginModal.querySelector(".login-container").addEventListener("click", (e) => {
  e.stopPropagation();
});

menuOpenButton.addEventListener("click", () => {
  document.body.classList.toggle("show-mobile-menu");
});
menuCloseButton.addEventListener("click", () => {
  document.body.classList.toggle("show-mobile-menu");
});
