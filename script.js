document.addEventListener("DOMContentLoaded", () => {
  initSlider();
  initLoginModal();
  initRegisterModal();
  initProfileModal();
  initProgressBars();
  initSidebar();
  initEmptyState();
});

function initSlider() {
  const slidesEl = document.getElementById("slides");
  const dotsWrap = document.getElementById("dots");

  if (!slidesEl || !dotsWrap) return;

  const dotsEl = dotsWrap.children;
  let current = 0;
  const total = dotsEl.length || 3;

  function goTo(n) {
    current = (n + total) % total;
    slidesEl.style.transform = `translateX(-${current * 100}%)`;
    Array.from(dotsEl).forEach((d, i) => {
      d.classList.toggle("active", i === current);
    });
  }

  function next() {
    goTo(current + 1);
  }

  window.next = next;
  window.prev = () => goTo(current - 1);
  window.goTo = goTo;

  setInterval(next, 15000);
}

function initLoginModal() {
  const openModal = document.getElementById("openModal");
  const modalOverlay = document.getElementById("modalOverlay");
  const closeModal = document.getElementById("closeModal");
  const togglePassword = document.getElementById("togglePassword");
  const password = document.getElementById("password");
  const goToRegister = document.getElementById("goToRegister");
  const registerOverlay = document.getElementById("registerOverlay");

  if (openModal && modalOverlay) {
    openModal.addEventListener("click", () => {
      modalOverlay.classList.add("active");
    });
  }

  if (closeModal && modalOverlay) {
    closeModal.addEventListener("click", () => {
      modalOverlay.classList.remove("active");
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove("active");
      }
    });
  }

  if (togglePassword && password) {
    togglePassword.addEventListener("click", () => {
      password.type = password.type === "password" ? "text" : "password";
    });
  }

  if (goToRegister && modalOverlay && registerOverlay) {
    goToRegister.addEventListener("click", (e) => {
      e.preventDefault();
      modalOverlay.classList.remove("active");
      registerOverlay.classList.add("active");
    });
  }
}

function initRegisterModal() {
  const loginOverlay = document.getElementById("modalOverlay");
  const registerOverlay = document.getElementById("registerOverlay");
  const closeRegister = document.getElementById("closeRegister");
  const prevStepBtn = document.getElementById("prevStepBtn");
  const steps = document.querySelectorAll(".register-step");
  const progressLines = document.querySelectorAll(".progress-line");
  const openRegister = document.getElementById("openRegister");
  const nextStep1 = document.getElementById("nextStep1");
  const nextStep2 = document.getElementById("nextStep2");
  const registerForm = document.getElementById("registerForm");
  const regEmail = document.getElementById("regEmail");
  const regPassword = document.getElementById("regPassword");
  const regConfirmPassword = document.getElementById("regConfirmPassword");
  const goToLogin = document.getElementById("goToLogin");

  if (!registerOverlay) return;

  let currentStep = 1;

  function showStep(step) {
    steps.forEach((item, index) => {
      item.classList.toggle("active", index + 1 === step);
    });

    progressLines.forEach((line, index) => {
      line.classList.toggle("active", index < step);
    });

    if (prevStepBtn) {
      prevStepBtn.style.display = step > 1 ? "block" : "none";
    }

    currentStep = step;
  }

  function openRegisterModal() {
    registerOverlay.classList.add("active");
    showStep(1);
  }

  function closeRegisterModal() {
    registerOverlay.classList.remove("active");
  }

  if (openRegister) {
    openRegister.addEventListener("click", openRegisterModal);
  }

  if (closeRegister) {
    closeRegister.addEventListener("click", closeRegisterModal);
  }

  registerOverlay.addEventListener("click", (e) => {
    if (e.target === registerOverlay) {
      closeRegisterModal();
    }
  });

  if (nextStep1) {
    nextStep1.addEventListener("click", () => {
      if (!regEmail || regEmail.value.trim() === "") {
        regEmail?.focus();
        return;
      }
      showStep(2);
    });
  }

  if (nextStep2) {
    nextStep2.addEventListener("click", () => {
      if (!regPassword || regPassword.value.trim() === "") {
        regPassword?.focus();
        return;
      }

      if (!regConfirmPassword || regConfirmPassword.value.trim() === "") {
        regConfirmPassword?.focus();
        return;
      }

      if (regPassword.value !== regConfirmPassword.value) {
        alert("Passwords do not match.");
        return;
      }

      showStep(3);
    });
  }

  if (prevStepBtn) {
    prevStepBtn.addEventListener("click", () => {
      if (currentStep > 1) {
        showStep(currentStep - 1);
      }
    });
  }

  document.querySelectorAll(".eye-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const targetInput = document.getElementById(button.dataset.target);
      if (!targetInput) return;
      targetInput.type = targetInput.type === "password" ? "text" : "password";
    });
  });

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Registration submitted!");
    });
  }

  if (goToLogin && loginOverlay) {
    goToLogin.addEventListener("click", (e) => {
      e.preventDefault();
      closeRegisterModal();
      loginOverlay.classList.add("active");
    });
  }

  showStep(1);
}

function initProfileModal() {
  const openProfileModal = document.getElementById("openProfileModal");
  const profileOverlay = document.getElementById("profileOverlay");
  const closeProfileModal = document.getElementById("closeProfileModal");

  if (openProfileModal && profileOverlay) {
    openProfileModal.addEventListener("click", () => {
      profileOverlay.classList.add("active");
    });
  }

  if (closeProfileModal && profileOverlay) {
    closeProfileModal.addEventListener("click", () => {
      profileOverlay.classList.remove("active");
    });
  }

  if (profileOverlay) {
    profileOverlay.addEventListener("click", (e) => {
      if (e.target === profileOverlay) {
        profileOverlay.classList.remove("active");
      }
    });
  }
}

function initProgressBars() {
  const progressBars = document.querySelectorAll(".progress-bar");
  if (!progressBars.length) return;

  window.addEventListener("load", () => {
    progressBars.forEach((bar) => {
      const percent = bar.getAttribute("data-progress") || "0";
      bar.style.width = percent + "%";
    });
  });
}

function initSidebar() {
  const openSidebar = document.getElementById("openSidebar");
  const closeSidebar = document.getElementById("closeSidebar");
  const rightSidebar = document.getElementById("rightSidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  if (openSidebar && rightSidebar && sidebarOverlay) {
    openSidebar.addEventListener("click", (e) => {
      e.preventDefault();
      rightSidebar.classList.add("active");
      sidebarOverlay.classList.add("active");
    });
  }

  if (closeSidebar && rightSidebar && sidebarOverlay) {
    closeSidebar.addEventListener("click", () => {
      rightSidebar.classList.remove("active");
      sidebarOverlay.classList.remove("active");
    });
  }

  if (sidebarOverlay && rightSidebar) {
    sidebarOverlay.addEventListener("click", () => {
      rightSidebar.classList.remove("active");
      sidebarOverlay.classList.remove("active");
    });
  }
}

function initEmptyState() {
  const emptyState = document.getElementById("emptyState");
  if (!emptyState) return;

  window.showEmptyState = function () {
    emptyState.style.display = "flex";
  };

  window.hideEmptyState = function () {
    emptyState.style.display = "none";
  };
}

//Browse page Sort dropdown
const sortDropdown = document.querySelector(".sort-dropdown");
const sortToggle = document.getElementById("sortToggle");
const sortMenu = document.getElementById("sortMenu");
const sortOptions = document.querySelectorAll(".sort-option");
const selectedSort = document.getElementById("selectedSort");

sortToggle.addEventListener("click", () => {
  sortDropdown.classList.toggle("open");
});

sortOptions.forEach(option => {
  option.addEventListener("click", () => {
    sortOptions.forEach(item => item.classList.remove("active"));
    option.classList.add("active");
    selectedSort.textContent = option.dataset.value;
    sortDropdown.classList.remove("open");
  });
});

document.addEventListener("click", (e) => {
  if (!sortDropdown.contains(e.target)) {
    sortDropdown.classList.remove("open");
  }
});

//when pill is active
const pills = document.querySelectorAll(".pill");

pills.forEach(pill => {
  pill.addEventListener("click", () => {
    pill.classList.toggle("active");
  });
});