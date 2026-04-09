// Slider

let current = 0;
const total = 3;
const slidesEl = document.getElementById('slides');
const dotsEl = document.getElementById('dots').children;

function goTo(n) {
  current = (n + total) % total;
  slidesEl.style.transform = `translateX(-${current * 100}%)`;
  Array.from(dotsEl).forEach((d, i) => d.classList.toggle('active', i === current));
}
function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }

setInterval(() => next(), 15000);




// sign in modal

const openModal = document.getElementById("openModal");
  openModal.addEventListener("click", () => {
    modalOverlay.classList.add("active");
  });

const modalOverlay = document.getElementById("modalOverlay");
const closeModal = document.getElementById("closeModal");
const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

closeModal.addEventListener("click", () => {
  modalOverlay.classList.remove("active");
});

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove("active");
  }
});

togglePassword.addEventListener("click", () => {
  password.type = password.type === "password" ? "text" : "password";
});

const loginOverlay = document.getElementById("modalOverlay");
  const registerOverlay = document.getElementById("registerOverlay");

  const goToRegister = document.getElementById("goToRegister");
  const goToLogin = document.getElementById("goToLogin");

  if (goToRegister) {
    goToRegister.addEventListener("click", (e) => {
      e.preventDefault();
      loginOverlay.classList.remove("active");
      registerOverlay.classList.add("active");
    });
  }

  if (goToLogin) {
    goToLogin.addEventListener("click", (e) => {
      e.preventDefault();
      registerOverlay.classList.remove("active");
      loginOverlay.classList.add("active");
    });
  }


// register modal

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
    if (!registerOverlay) return;
    registerOverlay.classList.add("active");
    showStep(1);
  }

  function closeRegisterModal() {
    if (!registerOverlay) return;
    registerOverlay.classList.remove("active");
  }

  if (goToRegister) {
    goToRegister.addEventListener("click", (e) => {
      e.preventDefault();

      if (loginOverlay) {
        loginOverlay.classList.remove("active");
      }

      openRegisterModal();
    });
  }

  if (openRegister) {
    openRegister.addEventListener("click", () => {
      openRegisterModal();
    });
  }

  if (nextStep1) {
    nextStep1.addEventListener("click", () => {
      if (!regEmail || regEmail.value.trim() === "") {
        if (regEmail) regEmail.focus();
        return;
      }

      showStep(2);
    });
  }

  if (nextStep2) {
    nextStep2.addEventListener("click", () => {
      if (!regPassword || regPassword.value.trim() === "") {
        if (regPassword) regPassword.focus();
        return;
      }

      if (!regConfirmPassword || regConfirmPassword.value.trim() === "") {
        if (regConfirmPassword) regConfirmPassword.focus();
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

  if (closeRegister) {
    closeRegister.addEventListener("click", closeRegisterModal);
  }

  if (registerOverlay) {
    registerOverlay.addEventListener("click", (e) => {
      if (e.target === registerOverlay) {
        closeRegisterModal();
      }
    });
  }

  document.querySelectorAll(".eye-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const targetInput = document.getElementById(button.dataset.target);
      if (!targetInput) return;

      targetInput.type =
        targetInput.type === "password" ? "text" : "password";
    });
  });

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Registration submitted!");
    });
  }

  showStep(1);



//Profile modal

const openProfileModal = document.getElementById("openProfileModal");
const profileOverlay = document.getElementById("profileOverlay");
const closeProfileModal = document.getElementById("closeProfileModal");

openProfileModal.addEventListener("click", () => {
  profileOverlay.classList.add("active");
});

closeProfileModal.addEventListener("click", () => {
  profileOverlay.classList.remove("active");
});

profileOverlay.addEventListener("click", (e) => {
  if (e.target === profileOverlay) {
    profileOverlay.classList.remove("active");
  }
});


//progress bar
window.addEventListener("load", () => {
    const progressBars = document.querySelectorAll(".progress-bar");

    progressBars.forEach((bar) => {
      const percent = bar.getAttribute("data-progress");
      bar.style.width = percent + "%";
    });
  });



// Sidebar

const openSidebar = document.getElementById("openSidebar");
const closeSidebar = document.getElementById("closeSidebar");
const rightSidebar = document.getElementById("rightSidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

openSidebar.addEventListener("click", (e) => {
    e.preventDefault();
    rightSidebar.classList.add("active");
    sidebarOverlay.classList.add("active");
});

closeSidebar.addEventListener("click", () => {
    rightSidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
});

sidebarOverlay.addEventListener("click", () => {
    rightSidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
});



// Sidebar empty state
const emptyState = document.getElementById("emptyState");

function showEmptyState() {
    emptyState.style.display = "flex";
}

function hideEmptyState() {
    emptyState.style.display = "none";
}