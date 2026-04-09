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




// register modal

const registerOverlay = document.getElementById("registerOverlay");
const closeRegister = document.getElementById("closeRegister");
const prevStepBtn = document.getElementById("prevStepBtn");
const steps = document.querySelectorAll(".register-step");
const progressLines = document.querySelectorAll(".progress-line");

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

  prevStepBtn.style.display = step > 1 ? "block" : "none";
  currentStep = step;
  }

function openRegisterModal() {
  registerOverlay.classList.add("active");
  showStep(1);
}

function closeRegisterModal() {
  registerOverlay.classList.remove("active");
}

nextStep1.addEventListener("click", () => {
  if (regEmail.value.trim() === "") {
    regEmail.focus();
    return;
  }
  showStep(2);
});

nextStep2.addEventListener("click", () => {
  if (regPassword.value.trim() === "") {
    regPassword.focus();
    return;
  }

  if (regConfirmPassword.value.trim() === "") {
    regConfirmPassword.focus();
    return;
  }

  if (regPassword.value !== regConfirmPassword.value) {
    alert("Passwords do not match.");
    return;
  }

  showStep(3);
});

prevStepBtn.addEventListener("click", () => {
  if (currentStep > 1) {
    showStep(currentStep - 1);
  }
});

closeRegister.addEventListener("click", closeRegisterModal);

registerOverlay.addEventListener("click", (e) => {
  if (e.target === registerOverlay) {
    closeRegisterModal();
  }
});

document.querySelectorAll(".eye-toggle").forEach(button => {
  button.addEventListener("click", () => {
    const targetInput = document.getElementById(button.dataset.target);
    targetInput.type = targetInput.type === "password" ? "text" : "password";
  });
});

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Registration submitted!");
});

const openRegister = document.getElementById("openRegister");

openRegister.addEventListener("click", () => {
  openRegisterModal();
});



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
