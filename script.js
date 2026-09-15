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

const textMoreButtons = document.querySelectorAll(".text-more");

textMoreButtons.forEach((button) => {
  button.addEventListener("click", function () {
    toggleDescription(button);
  });
});

function toggleDescription(button) {
  let actualBlockWrap = button.closest(".bl-r");
  let block = actualBlockWrap.querySelector(".bl-text-wrap");
  let isShow = block.classList.toggle("show");

  if (isShow) {
    block.style.maxHeight = block.scrollHeight + "px";
    button.textContent = "Згорнути";
  } else {
    block.style.maxHeight = "455px";
    button.textContent = "Більше";
  }
}
