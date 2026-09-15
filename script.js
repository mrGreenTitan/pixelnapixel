const languageMenu = document.querySelector(".language");

languageMenu.addEventListener("click", () => {
  const isOpened = languageMenu.classList.toggle("open");
  if (!isOpened) {
    languageMenu.classList.add("closing");

    setTimeout(() => {
      languageMenu.classList.remove("closing");
    }, 500);
  }
});

const burgMenu = document.getElementById("burgMenu");
const navigation = document.getElementById("navigation");

burgMenu.addEventListener("click", function () {
  burgMenu.classList.toggle("open");
  navigation.classList.toggle("open");
  languageMenu.classList.toggle("show");
});
