document.addEventListener("DOMContentLoaded", () => {
  initSlider();
  initLoginModal();
  initRegisterModal();
  initProfileModal();
  initProgressBars();
  initSidebar();
  initEmptyState();
  initSortDropdown();
  initPills();
  initBreadcrumbLinks();
  initCourseEnrollSection();
});

// --- Utilities ---

function getEl(id) {
  return document.getElementById(id);
}

function getCsrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta ? meta.getAttribute("content") : "";
}

function clearError(id) {
  const el = getEl(id);
  if (el) el.textContent = "";
}

function setError(id, message) {
  const el = getEl(id);
  if (el) el.textContent = message || "";
}

const LOGIN_FIELD_MAP = {
  email: "loginEmailError",
  password: "loginPasswordError",
};

const REGISTER_FIELD_MAP = {
  email: "registerEmailError",
  password: "registerPasswordError",
  password_confirmation: "registerPasswordConfirmationError",
  username: "registerUsernameError",
  avatar: "registerAvatarError",
};

const PROFILE_FIELD_MAP = {
  name: "profileNameError",
  email: "profileEmailError",
  mobile_number: "profileMobileError",
  age: "profileAgeError",
  avatar: "profileAvatarError",
};

function renderFormErrors(data, fieldMap, generalErrorId) {
  Object.values(fieldMap).forEach(clearError);
  if (generalErrorId) clearError(generalErrorId);

  if (data?.errors) {
    Object.entries(fieldMap).forEach(([field, errorId]) => {
      if (data.errors[field]) setError(errorId, data.errors[field][0]);
    });
  }

  if (data?.message && generalErrorId) {
    setError(generalErrorId, data.message);
  }
}

function clearLoginErrors() {
  renderFormErrors({}, LOGIN_FIELD_MAP, "loginGeneralError");
}

function clearRegisterErrors() {
  renderFormErrors({}, REGISTER_FIELD_MAP, "registerGeneralError");
}

function clearProfileErrors() {
  renderFormErrors({}, PROFILE_FIELD_MAP, "profileGeneralError");
  const successEl = getEl("profileSuccessMessage");
  if (successEl) successEl.textContent = "";
}

function renderLoginErrors(data) {
  renderFormErrors(data, LOGIN_FIELD_MAP, "loginGeneralError");
}

function renderRegisterErrors(data) {
  renderFormErrors(data, REGISTER_FIELD_MAP, "registerGeneralError");
}

function renderProfileErrors(data) {
  renderFormErrors(data, PROFILE_FIELD_MAP, "profileGeneralError");
}

async function submitForm(form, { onSuccess, onError }) {
  const response = await fetch(form.action, {
    method: "POST",
    headers: {
      "X-CSRF-TOKEN": getCsrfToken(),
      Accept: "application/json",
    },
    body: new FormData(form),
  });

  const data = await response.json();

  if (!response.ok) {
    onError(data);
    return;
  }

  onSuccess(data);
}

function setupModal(overlay, openBtn, closeBtn, { onOpen, onClose } = {}) {
  function open() {
    overlay.classList.add("active");
    onOpen?.();
  }

  function close() {
    overlay.classList.remove("active");
    onClose?.();
  }

  openBtn?.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  return { open, close };
}

// --- Features ---

function initSlider() {
  const slidesEl = getEl("slides");
  const dotsWrap = getEl("dots");

  if (!slidesEl || !dotsWrap) return;

  const dotsEl = dotsWrap.children;
  let current = 0;
  const total = dotsEl.length || 3;

  function goTo(n) {
    current = (n + total) % total;
    slidesEl.style.transform = `translateX(-${current * 100}%)`;
    Array.from(dotsEl).forEach((d, i) =>
      d.classList.toggle("active", i === current),
    );
  }

  window.next = () => goTo(current + 1);
  window.prev = () => goTo(current - 1);
  window.goTo = goTo;

  setInterval(window.next, 15000);
}

function initLoginModal() {
  const modalOverlay = getEl("modalOverlay");
  if (!modalOverlay) return;

  setupModal(modalOverlay, getEl("openModal"), getEl("closeModal"), {
    onOpen: clearLoginErrors,
  });

  const password = getEl("password");
  getEl("togglePassword")?.addEventListener("click", () => {
    password.type = password.type === "password" ? "text" : "password";
  });

  getEl("goToRegister")?.addEventListener("click", (e) => {
    e.preventDefault();
    modalOverlay.classList.remove("active");
    clearRegisterErrors();
    getEl("registerOverlay")?.classList.add("active");
  });

  const loginForm = getEl("loginForm");
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearLoginErrors();

    try {
      await submitForm(loginForm, {
        onSuccess: () => window.location.reload(),
        onError: renderLoginErrors,
      });
    } catch (error) {
      setError("loginGeneralError", "Something went wrong. Please try again.");
      console.error(error);
    }
  });
}

function initRegisterModal() {
  const registerOverlay = getEl("registerOverlay");
  if (!registerOverlay) return;

  const loginOverlay = getEl("modalOverlay");
  const steps = document.querySelectorAll(".register-step");
  const progressLines = document.querySelectorAll(".progress-line");
  const prevStepBtn = getEl("prevStepBtn");
  const regEmail = getEl("regEmail");
  const regPassword = getEl("regPassword");
  const regConfirmPassword = getEl("regConfirmPassword");
  const regUsername = getEl("regUsername");
  const registerForm = getEl("registerForm");

  let currentStep = 1;

  function updateRequiredFields() {
    steps.forEach((step) => {
      const isActive = step.classList.contains("active");
      step.querySelectorAll("input").forEach((input) => {
        input.required =
          isActive &&
          input.type !== "file" &&
          ["email", "password", "password_confirmation", "username"].includes(
            input.name,
          );
      });
    });
  }

  function showStep(step) {
    steps.forEach((item, i) => item.classList.toggle("active", i + 1 === step));
    progressLines.forEach((line, i) =>
      line.classList.toggle("active", i < step),
    );
    if (prevStepBtn) prevStepBtn.style.display = step > 1 ? "block" : "none";
    currentStep = step;
    updateRequiredFields();
  }

  const { close: closeRegisterModal } = setupModal(
    registerOverlay,
    getEl("openRegister"),
    getEl("closeRegister"),
    {
      onOpen: () => {
        clearRegisterErrors();
        showStep(1);
      },
    },
  );

  getEl("nextStep1")?.addEventListener("click", () => {
    clearRegisterErrors();
    if (!regEmail?.value.trim()) {
      setError("registerEmailError", "Email is required.");
      regEmail?.focus();
      return;
    }
    showStep(2);
  });

  getEl("nextStep2")?.addEventListener("click", () => {
    clearRegisterErrors();
    if (!regPassword?.value.trim()) {
      setError("registerPasswordError", "Password is required.");
      regPassword?.focus();
      return;
    }
    if (!regConfirmPassword?.value.trim()) {
      setError(
        "registerPasswordConfirmationError",
        "Please confirm your password.",
      );
      regConfirmPassword?.focus();
      return;
    }
    if (regPassword.value !== regConfirmPassword.value) {
      setError("registerPasswordConfirmationError", "Passwords do not match.");
      regConfirmPassword?.focus();
      return;
    }
    showStep(3);
  });

  prevStepBtn?.addEventListener("click", () => {
    if (currentStep > 1) showStep(currentStep - 1);
  });

  document.querySelectorAll(".eye-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const target = getEl(button.dataset.target);
      if (target)
        target.type = target.type === "password" ? "text" : "password";
    });
  });

  const avatarUpload = getEl("avatarUpload");
  const avatarPreview = getEl("avatarPreview");
  if (avatarUpload && avatarPreview) {
    avatarUpload.addEventListener("change", () => {
      const file = avatarUpload.files?.[0];
      if (!file) {
        avatarPreview.src = "";
        avatarPreview.style.display = "none";
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        avatarPreview.src = e.target?.result || "";
        avatarPreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    });
  }

  registerForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearRegisterErrors();

    if (!regUsername?.value.trim()) {
      showStep(3);
      setError("registerUsernameError", "Username is required.");
      regUsername?.focus();
      return;
    }

    try {
      await submitForm(registerForm, {
        onSuccess: () => window.location.reload(),
        onError: renderRegisterErrors,
      });
    } catch (error) {
      setError(
        "registerGeneralError",
        "Something went wrong. Please try again.",
      );
      console.error(error);
    }
  });

  getEl("goToLogin")?.addEventListener("click", (e) => {
    e.preventDefault();
    closeRegisterModal();
    clearLoginErrors();
    loginOverlay?.classList.add("active");
  });

  showStep(1);
}

function initProfileModal() {
  const profileOverlay = getEl("profileOverlay");
  if (!profileOverlay) return;

  const { close: closeProfileModal } = setupModal(
    profileOverlay,
    getEl("openProfileModal"),
    getEl("closeProfileModal"),
    {
      onOpen: clearProfileErrors,
    },
  );

  const avatarUpload = getEl("profileAvatarUpload");
  const avatarPreview = getEl("profileAvatarPreview");
  if (avatarUpload && avatarPreview) {
    avatarUpload.addEventListener("change", () => {
      const file = avatarUpload.files?.[0];
      if (!file) {
        avatarPreview.src = "";
        avatarPreview.style.display = "none";
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        avatarPreview.src = e.target?.result || "";
        avatarPreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    });
  }

  const profileForm = getEl("profileForm");
  profileForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearProfileErrors();

    try {
      await submitForm(profileForm, {
        onSuccess: (data) => {
          if (data.user?.avatarUrl) {
            document
              .querySelectorAll(".profile-icon-btn img, .profile-avatar")
              .forEach((img) => {
                img.src = data.user.avatarUrl;
              });
            if (avatarPreview) {
              avatarPreview.src = data.user.avatarUrl;
              avatarPreview.style.display = "block";
            }
          }
          closeProfileModal();
        },
        onError: renderProfileErrors,
      });
    } catch (error) {
      setError(
        "profileGeneralError",
        "Something went wrong. Please try again.",
      );
      console.error(error);
    }
  });
}

function initProgressBars() {
  const bars = document.querySelectorAll(".progress-bar");
  if (!bars.length) return;

  window.addEventListener("load", () => {
    bars.forEach((bar) => {
      bar.style.width = (bar.getAttribute("data-progress") || "0") + "%";
    });
  });
}

function initSidebar() {
  const rightSidebar = getEl("rightSidebar");
  const sidebarOverlay = getEl("sidebarOverlay");

  if (!rightSidebar || !sidebarOverlay) return;

  function open() {
    rightSidebar.classList.add("active");
    sidebarOverlay.classList.add("active");
  }

  function close() {
    rightSidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
  }

  getEl("openSidebar")?.addEventListener("click", (e) => {
    e.preventDefault();
    open();
  });

  getEl("closeSidebar")?.addEventListener("click", close);
  sidebarOverlay.addEventListener("click", close);
}

function initEmptyState() {
  const emptyState = getEl("emptyState");
  if (!emptyState) return;

  window.showEmptyState = () => (emptyState.style.display = "flex");
  window.hideEmptyState = () => (emptyState.style.display = "none");
}

function initSortDropdown() {
  const sortDropdown = document.querySelector(".sort-dropdown");
  const sortToggle = getEl("sortToggle");
  const sortOptions = document.querySelectorAll(".sort-option");
  const selectedSort = getEl("selectedSort");

  if (!sortDropdown || !sortToggle || !sortOptions.length || !selectedSort)
    return;

  sortToggle.addEventListener("click", () =>
    sortDropdown.classList.toggle("open"),
  );

  sortOptions.forEach((option) => {
    option.addEventListener("click", () => {
      sortOptions.forEach((item) => item.classList.remove("active"));
      option.classList.add("active");
      selectedSort.textContent = option.dataset.value;
      sortDropdown.classList.remove("open");
    });
  });

  document.addEventListener("click", (e) => {
    if (!sortDropdown.contains(e.target)) sortDropdown.classList.remove("open");
  });
}

function initPills() {
  document.querySelectorAll(".pill").forEach((pill) => {
    pill.addEventListener("click", () => pill.classList.toggle("active"));
  });
}

function initBreadcrumbLinks() {
  const currentPage = window.location.pathname;
  document.querySelectorAll(".link-path").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href !== "#" && currentPage.includes(href)) {
      link.classList.add("active");
    }
  });
}

function initCourseEnrollSection() {
  const headers = document.querySelectorAll(".dropdown-header");
  const cards = document.querySelectorAll(".option-card:not(.disabled)");
  const totalPriceEl = getEl("totalPrice");
  const sessionTypePriceEl = getEl("sessionTypePrice");
  const enrollBtn = getEl("enrollBtn");

  if (
    !headers.length ||
    !cards.length ||
    !totalPriceEl ||
    !sessionTypePriceEl ||
    !enrollBtn
  )
    return;

  const BASE_PRICE = 349;
  const state = {
    schedule: null,
    time: null,
    session: null,
    sessionPrice: 0,
    seats: 0,
  };

  headers.forEach((header) => {
    header.addEventListener("click", () =>
      header.closest(".dropdown-item")?.classList.toggle("open"),
    );
  });

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const { type, value, price = 0, seats = 999 } = card.dataset;

      document
        .querySelectorAll(`.option-card[data-type="${type}"]`)
        .forEach((item) => {
          item.classList.remove("selected");
        });
      card.classList.add("selected");

      if (type === "schedule") state.schedule = value;
      if (type === "time") state.time = value;
      if (type === "session") {
        state.session = value;
        state.sessionPrice = Number(price);
        state.seats = Number(seats);
      }

      const total = BASE_PRICE + state.sessionPrice;
      totalPriceEl.textContent = `$${total}`;
      sessionTypePriceEl.textContent = `+ $${state.sessionPrice}`;

      const ready =
        state.schedule && state.time && state.session && state.seats > 0;
      enrollBtn.disabled = !ready;
      enrollBtn.classList.toggle("enabled", ready);
    });
  });
}
