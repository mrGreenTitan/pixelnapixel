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

const wrapPages = document.getElementById("wrapPages");
const linkHomePage = document.getElementById("linkHomePage");
const linkWorkPage = document.getElementById("linkWorkPage");
const homepage = document.getElementById("homepage");
const workpage = document.getElementById("workpage");

if (wrapPages) {
  function updatePageHeight() {
    if (wrapPages.classList.contains("is-work")) {
      wrapPages.style.height = workpage.offsetHeight + "px";
    } else {
      wrapPages.style.height = homepage.offsetHeight + "px";
    }
  }

  linkWorkPage.addEventListener("click", function () {
    if (linkWorkPage.classList.contains("view")) return;

    linkWorkPage.classList.add("view");
    linkHomePage.classList.remove("view");
    wrapPages.classList.add("is-work");

    updatePageHeight();
  });

  linkHomePage.addEventListener("click", function () {
    if (linkHomePage.classList.contains("view")) return;

    linkHomePage.classList.add("view");
    linkWorkPage.classList.remove("view");
    wrapPages.classList.remove("is-work");

    updatePageHeight();
  });

  const resizeObserver = new ResizeObserver(function () {
    updatePageHeight();
  });

  resizeObserver.observe(homepage);
  resizeObserver.observe(workpage);
  updatePageHeight();
}
