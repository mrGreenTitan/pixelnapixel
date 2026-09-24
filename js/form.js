import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const form = document.getElementById("form");

if (form) {
  const inpName = document.getElementById("inpName");
  const inpPhone = document.getElementById("inpPhone");
  const inpSocials = document.getElementById("inpSocials");
  const formBtn = document.getElementById("formBtn");

  const validateForm = () => {
    const isNameValid = inpName.value.trim().length >= inpName.minLength;
    const isPhoneValid = inpPhone.value.trim().length >= inpPhone.minLength;

    formBtn.disabled = !(isNameValid && isPhoneValid);
  };

  form.addEventListener("input", validateForm);

  inpPhone.addEventListener("focus", () => {
    if (inpPhone.value.trim() === "") {
      inpPhone.value = "+";
      validateForm();
    }
  });

  inpPhone.addEventListener("input", () => {
    let val = inpPhone.value;
    if (!val.startsWith("+")) {
      val = "+" + val.replace(/\D/g, "");
    } else {
      val = "+" + val.slice(1).replace(/\D/g, "");
    }
    inpPhone.value = val;
    validateForm();
  });

  inpPhone.addEventListener("blur", () => {
    if (inpPhone.value.trim() === "+") {
      inpPhone.value = "";
    }
    validateForm();
  });

  inpName.addEventListener("input", () => {
    inpName.value = inpName.value.replace(/[^a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ\s-]/g, "");
    validateForm();
  });

  inpName.addEventListener("blur", () => {
    inpName.value = inpName.value.trim();
    validateForm();
  });

  const contSocialIcons = document.getElementById("contSocialIcons");
  const inpSocialWrap = document.querySelector(".bl-inp-social");
  let wrapInput = document.querySelector(".cont-form .bl-two");
  let iconsWrap = [];

  if (contSocialIcons && inpSocialWrap) {
    iconsWrap = contSocialIcons.querySelectorAll("div");
    let label = inpSocialWrap.querySelector("label");

    iconsWrap.forEach((div, index) => {
      div.addEventListener("click", function () {
        iconsWrap.forEach((item) => {
          item.classList.remove("is-pick");
        });
        inpSocials.value = "";

        div.classList.add("is-pick");
        if (wrapInput) wrapInput.classList.add("is-pick");
        formBtn.classList.add("show");

        switch (index) {
          case 0:
            label.innerText = "Instagram";
            inpSocials.placeholder = "@you_instagram78";
            break;
          case 1:
            label.innerText = "Viber";
            inpSocials.placeholder = "+380 96 000 00";
            break;
          case 2:
            label.innerText = "Telegram";
            inpSocials.placeholder = "@you_telegram39";
            break;
          default:
            label.innerText = "WhatsApp";
            inpSocials.placeholder = "+380 50 300 00";
            break;
        }
      });
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formBtn.disabled = true;

    const socialLabel = document.querySelector(".bl-inp-social label");
    const platformName = socialLabel ? socialLabel.innerText : "Social";

    const socialValue = inpSocials && inpSocials.value.trim() !== "" ? `${platformName}: ${inpSocials.value.trim()}` : "";

    const formData = {
      name: inpName.value.trim(),
      phone: inpPhone.value.trim(),
      social: socialValue,
    };

    try {
      const response = await fetch("https://formspree.io/f/xvkowjll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const successModal = document.getElementById("successModal");
        if (successModal) {
          successModal.classList.remove("modal-noVis");
          successModal.classList.add("modal-vis");
        }

        form.reset();
        if (wrapInput) wrapInput.classList.remove("is-pick");
        if (iconsWrap) iconsWrap.forEach((item) => item.classList.remove("is-pick"));

        if (socialLabel) socialLabel.innerText = "Instagram";
      } else {
        alert("Произошла ошибка при отправке. Попробуйте позже.");
      }
    } catch (error) {
      console.error(error);
      alert("Ошибка сети. Проверьте подключение к интернету.");
    } finally {
      validateForm();
    }
  });

  validateForm();
}

const firebaseConfig = {
  apiKey: "AIzaSyAIvQPZPOA9-TU_h7AYoQEaTTydiXgIyoo",
  authDomain: "portfoliolikecounter.firebaseapp.com",
  databaseURL: "https://portfoliolikecounter-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "portfoliolikecounter",
  storageBucket: "portfoliolikecounter.firebasestorage.app",
  messagingSenderId: "698633805413",
  appId: "1:698633805413:web:6ab037ebdae8255aa5b08c",
  measurementId: "G-YNF01XQMS6",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const likesRef = ref(db, "portfolio/likes");

const successModal = document.getElementById("successModal");

if (successModal) {
  const btnLiker = document.querySelector(".wrap-btn-like button");
  const heartFill = btnLiker?.querySelector(".hear-two");
  const modLikerCounter = document.getElementById("modLikerCounter");

  if (btnLiker && modLikerCounter) {
    onValue(likesRef, (snapshot) => {
      const count = snapshot.val() || 0;
      modLikerCounter.textContent = count;
    });

    if (localStorage.getItem("hasLiked")) {
      if (heartFill) heartFill.classList.remove("htwo-no-vis");
      btnLiker.disabled = true;
    }

    btnLiker.addEventListener("click", function () {
      if (localStorage.getItem("hasLiked")) return;

      runTransaction(likesRef, (currentLikes) => {
        return (currentLikes || 0) + 1;
      }).then(() => {
        if (heartFill) heartFill.classList.remove("htwo-no-vis");
        localStorage.setItem("hasLiked", "true");
        btnLiker.disabled = true;
      });
    });
  }

  const btnClose = document.querySelector(".mod-btn-close");
  if (btnClose) {
    btnClose.addEventListener("click", function () {
      successModal.classList.remove("modal-vis");
      successModal.classList.add("modal-noVis");
    });
  }

  const modalBtnPortfolio = document.querySelector(".mod-btn-portf");
  if (modalBtnPortfolio) {
    modalBtnPortfolio.addEventListener("click", function () {
      successModal.classList.remove("modal-vis");
      successModal.classList.add("modal-noVis");

      let linkWorks = document.getElementById("linkWorkPage");

      window.addEventListener(
        "scrollend",
        function () {
          if (linkWorks) linkWorks.click();
        },
        { once: true },
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}
