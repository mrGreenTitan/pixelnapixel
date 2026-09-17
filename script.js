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
  const actualBlockWrap = button.closest(".bl-r");
  const block = actualBlockWrap.querySelector(".bl-text-wrap");
  const isShow = block.classList.toggle("show");

  if (isShow) {
    block.style.maxHeight = block.scrollHeight + "px";
    button.textContent = "Згорнути";
  } else {
    updateTextBlockHeight(block);
    button.textContent = "Більше";
  }
}

function updateTextBlockHeight(block) {
  if (window.innerWidth >= 1308) {
    block.style.maxHeight = "455px";
  } else if (window.innerWidth >= 816) {
    block.style.maxHeight = "245px";
  } else if (window.innerWidth >= 500) {
    block.style.maxHeight = "245px";
  } else {
    block.style.maxHeight = "105px";
  }
}

// Слідкуємо за змінами широкості вікна
window.addEventListener("resize", function () {
  document.querySelectorAll(".bl-text-wrap").forEach((block) => {
    if (!block.classList.contains("show")) {
      updateTextBlockHeight(block);
    } else {
      block.style.maxHeight = block.scrollHeight + "px";
    }
  });
});

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

  // Слідкуємо за змінами восокості сторінок
  const resizeObserver = new ResizeObserver(function () {
    updatePageHeight();
  });

  resizeObserver.observe(homepage);
  resizeObserver.observe(workpage);

  updatePageHeight();
}

const heroSocials = document.getElementById("heroSocials");

if (heroSocials) {
  let iconsWrap = heroSocials.querySelectorAll("div");
  iconsWrap.forEach((div) => {
    div.addEventListener("click", function () {
      iconsWrap.forEach((item) => {
        item.classList.remove("is-pick");
      });
      div.classList.add("is-pick");
    });
  });
}

const contSocialIcons = document.getElementById("contSocialIcons");
const inpSocialWrap = document.querySelector(".bl-inp-social");

if (contSocialIcons) {
  let iconsWrap = contSocialIcons.querySelectorAll("div");
  let label = inpSocialWrap.querySelector("label");
  let input = inpSocialWrap.querySelector("input");

  let wrapInput = document.querySelector(".cont-form .bl-two");
  let btn = document.querySelector(".cont-form .cont-btn-send");

  iconsWrap.forEach((div, index) => {
    div.addEventListener("click", function () {
      iconsWrap.forEach((item) => {
        item.classList.remove("is-pick");
      });
      input.value = "";
      div.classList.add("is-pick");
      wrapInput.classList.add("is-pick");
      btn.classList.add("show");

      switch (index) {
        case 0:
          label.innerText = "Instagram";
          input.placeholder = "@you_instagram78";
          break;
        case 1:
          label.innerText = "Viber";
          input.placeholder = "+380 96 000 00";
          break;
        case 2:
          label.innerText = "Telegram";
          input.placeholder = "@you_telegram39";
          break;
        default:
          label.innerText = "WhatsApp";
          input.placeholder = "+380 50 300 00";
          break;
      }
    });
  });
}

const themeSwither = document.getElementById("themeSwither");

if (themeSwither) {
  const workArea = document.getElementById("workArea");
  const input = themeSwither.querySelector("#inpTheme");

  // Получаем тему, которую уже установил скрипт в <head>
  const isLight = document.documentElement.classList.contains("light");

  // Синхронизируем checkbox с текущей темой
  input.checked = isLight;

  // После установки checked убираем режим загрузки
  requestAnimationFrame(() => {
    document.documentElement.classList.remove("theme-loading");
  });

  // Переключение темы
  input.addEventListener("change", () => {
    const isLight = input.checked;

    // Отключаем transition на время смены темы
    document.documentElement.classList.add("theme-changing");

    // Меняем тему
    document.documentElement.classList.toggle("light", isLight);
    document.documentElement.classList.toggle("dark", !isLight);

    // Сохраняем выбранную тему
    localStorage.setItem("theme", isLight ? "light" : "dark");

    // Возвращаем transition после применения новой темы
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("theme-changing");
      });
    });
  });
}
