// Підтягуємо мову
const translationsCache = {};

async function fetchTransl(lang) {
  if (translationsCache[lang]) {
    return translationsCache[lang];
  }

  try {
    let loadLang = await fetch(`translations/${lang}.json`);
    if (!loadLang.ok) throw new Error(`Файл translations/${lang}.json не найден`);

    let data = await loadLang.json();
    translationsCache[lang] = data;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Допоміжна функція для універсального пошуку перекладу
function getTranslationValue(translate, rawKey, lang) {
  if (translate[rawKey]) return translate[rawKey];

  const baseKey = rawKey.replace(/_[a-z]{2}$/i, "");
  const langKey = `${baseKey}_${lang}`;

  if (translate[langKey]) return translate[langKey];
  if (translate[baseKey]) return translate[baseKey];

  return null;
}

// Знаходимо на сторінці текст та оновлюємо його
async function switchLang(lang) {
  let translate = await fetchTransl(lang);
  if (!translate) return;

  // 1. Оновлюємо звичайний текст [data-i18n]
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    let rawKey = el.getAttribute("data-i18n");
    let value = getTranslationValue(translate, rawKey, lang);
    if (value) {
      el.textContent = value;
    }
  });

  // 2. Оновлюємо плейсхолдери
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    let rawKey = el.getAttribute("data-i18n-placeholder");
    let value = getTranslationValue(translate, rawKey, lang);
    if (value) {
      el.placeholder = value;
    }
  });

  localStorage.setItem("selectedLang", lang);
  document.documentElement.lang = lang;
}

// Оновлюємо значення актуального спану з мовою
function updateSpanLang(lang) {
  let selectSpan = document.getElementById("selectLanguage");
  if (selectSpan) {
    selectSpan.textContent = lang.toUpperCase();
    selectSpan.setAttribute("value", lang);
  }
}

function toggleDescription(button) {
  const actualBlockWrap = button.closest(".bl-r");
  const block = actualBlockWrap.querySelector(".bl-text-wrap");
  const isShow = block.classList.toggle("show");

  const key = isShow ? "works_btn_more_hide" : "works_btn_more";
  button.setAttribute("data-i18n", key);

  const currentLang = localStorage.getItem("selectedLang") || "uk";
  const translate = translationsCache[currentLang];

  if (translate) {
    const text = getTranslationValue(translate, key, currentLang);
    if (text) {
      button.textContent = text;
    }
  } else {
    button.textContent = isShow ? "Згорнути" : "Більше";
  }

  if (isShow) {
    block.style.maxHeight = block.scrollHeight + "px";
  } else {
    updateTextBlockHeight(block);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let languageMenu = document.querySelector(".language");
  let selectSpan = document.getElementById("selectLanguage");

  let currentLang = localStorage.getItem("selectedLang") || "uk";
  let defaultHtmlLang = "uk";

  if (currentLang !== defaultHtmlLang) {
    let liToSwap = document.querySelector(`li[data-lang="${currentLang}"]`);
    if (liToSwap) {
      liToSwap.setAttribute("data-lang", defaultHtmlLang);
      liToSwap.setAttribute("value", defaultHtmlLang);
      liToSwap.textContent = defaultHtmlLang.toUpperCase();
    }
  }

  updateSpanLang(currentLang);
  switchLang(currentLang);

  if (languageMenu) {
    languageMenu.addEventListener("click", (event) => {
      let isOpened = languageMenu.classList.toggle("open");

      if (!isOpened) {
        languageMenu.classList.add("closing");
        setTimeout(() => {
          languageMenu.classList.remove("closing");
        }, 500);
      }

      const li = event.target.closest("li[data-lang]");
      if (li) {
        let prevLang = selectSpan.getAttribute("value");
        let prevText = selectSpan.textContent;

        let chosenLang = li.getAttribute("data-lang");

        li.setAttribute("data-lang", prevLang);
        li.setAttribute("value", prevLang);
        li.textContent = prevText;

        updateSpanLang(chosenLang);
        switchLang(chosenLang);
      }
    });
  }

  // "Більше / Згорнути"
  const textMoreButtons = document.querySelectorAll(".text-more");
  textMoreButtons.forEach((button) => {
    button.addEventListener("click", function () {
      toggleDescription(button);
    });
  });
});

// Бургер меню
const burgMenu = document.getElementById("burgMenu");
const navMenu = document.getElementById("navigation");
const languageMenu = document.querySelector(".language");

burgMenu.addEventListener("click", function () {
  burgMenu.classList.toggle("open");
  navMenu.classList.toggle("open");
  languageMenu.classList.toggle("show");
});

function updateTextBlockHeight(block) {
  if (window.innerWidth >= 1309) {
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
const linkAboutMe = document.getElementById("linkAboutMe");
const linkWorkPage = document.getElementById("linkWorkPage");
const linkContactMe = document.getElementById("linkContactMe");
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

  const closeBurgNav = () => {
    burgMenu.classList.remove("open");
    navMenu.classList.remove("open");
    languageMenu.classList.remove("show");
  };

  linkWorkPage.addEventListener("click", function () {
    if (linkWorkPage.classList.contains("view")) return;

    linkWorkPage.classList.add("view");
    linkHomePage.classList.remove("view");
    wrapPages.classList.add("is-work");

    updatePageHeight();
    decorControll();

    setTimeout(closeBurgNav, 100);
  });

  function scrollToSection(linkElement, sectionId) {
    linkElement.addEventListener("click", function (e) {
      e.preventDefault();
      let section = document.getElementById(sectionId);

      if (!section) return;
      if (window.innerWidth <= 700) {
        closeBurgNav();
      }

      const doScroll = () => {
        let offset = 80;
        let targetPosition = section.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      };

      if (wrapPages.classList.contains("is-work")) {
        linkHomePage.classList.add("view");
        linkWorkPage.classList.remove("view");
        wrapPages.classList.remove("is-work");
        updatePageHeight();
        decorControll();

        setTimeout(doScroll, 500);
      } else {
        doScroll();
      }
    });
  }

  scrollToSection(linkAboutMe, "aboutMe");
  scrollToSection(linkContactMe, "contactMe");

  linkHomePage.addEventListener("click", function () {
    if (linkHomePage.classList.contains("view")) return;

    linkHomePage.classList.add("view");
    linkWorkPage.classList.remove("view");
    wrapPages.classList.remove("is-work");

    updatePageHeight();
    decorControll();

    setTimeout(closeBurgNav, 100);
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
  const input = themeSwither.querySelector("#inpTheme");
  const isLight = document.documentElement.classList.contains("light");
  input.checked = isLight;

  requestAnimationFrame(() => {
    document.documentElement.classList.remove("theme-loading");
  });

  input.addEventListener("change", () => {
    const isLight = input.checked;
    document.documentElement.classList.add("theme-changing");
    document.documentElement.classList.toggle("light", isLight);
    document.documentElement.classList.toggle("dark", !isLight);
    localStorage.setItem("theme", isLight ? "light" : "dark");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("theme-changing");
      });
    });
  });
}

function decorControll() {
  let allDecorHome = document.querySelectorAll(".decor-h");
  let allDecorWork = document.querySelectorAll(".decor-w");

  allDecorHome.forEach((decorHome) => {
    decorHome.classList.toggle("vis-no");
  });

  allDecorWork.forEach((decorWork) => {
    decorWork.classList.toggle("vis-no");
  });
}
