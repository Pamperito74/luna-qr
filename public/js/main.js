(() => {
  const q = (id) => document.getElementById(id);

  const state = {
    qrDataUrl: null,
    qrSvg: null,
    lastInput: "",
    logoImage: null,
    previousFocus: null,
    qrLoaderPromise: null,
  };

  const input = q("inputText");
  const qrForm = q("qrForm");
  const formMessage = q("formMessage");
  const clearBtn = q("clearBtn");
  const downloadBtn = q("downloadBtn");
  const downloadSvgBtn = q("downloadSvgBtn");
  const logoInput = q("logoInput");
  const logoSizeRange = q("logoSizeRange");
  const logoSizeValue = q("logoSizeValue");
  const removeLogoBtn = q("removeLogoBtn");
  const qrImage = q("qrImage");
  const donateButtonsContainer = q("donate-buttons");
  const year = q("year");
  const eccSelect = q("eccSelect");
  const sizeRange = q("sizeRange");
  const marginRange = q("marginRange");
  const bgModeSelect = q("bgModeSelect");
  const sizeValue = q("sizeValue");
  const marginValue = q("marginValue");

  const themeSelect = q("themeSelect");
  const generateBtn = q("generateBtn");

  const modal = q("privacy-modal");
  const privacyBtn = q("privacy-btn");
  const privacyChoicesBtn = q("privacy-choices-btn");
  const closeModalBtn = q("close-modal");
  const privacyChoicesHeading = q("privacy-choices");

  const setMessage = (message, isError = false) => {
    formMessage.textContent = message;
    formMessage.style.color = isError ? "#ffb4b4" : "";
  };

  const updateActionStates = () => {
    const hasInput = input.value.trim().length > 0;
    const hasQrPng = Boolean(state.qrDataUrl);
    const hasQrSvg = Boolean(state.qrSvg);
    const hasLogo = Boolean(state.logoImage);

    generateBtn.disabled = !hasInput;
    clearBtn.disabled = !hasInput && !hasQrPng && !hasLogo;

    downloadBtn.disabled = !hasQrPng;
    downloadSvgBtn.disabled = !hasQrSvg;
  };

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Failed to load image"));
      image.src = src;
    });

  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });

  const ensureQrCodeReady = async () => {
    if (typeof QRCode !== "undefined") return true;
    if (state.qrLoaderPromise) return state.qrLoaderPromise;

    const fallbackSources = [
      "js/vendor/qrcode.min.js",
      "https://unpkg.com/qrcode@1.3.0/build/qrcode.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/qrcode/1.3.0/qrcode.min.js",
    ];

    state.qrLoaderPromise = (async () => {
      for (const src of fallbackSources) {
        try {
          await loadScript(src);
          if (typeof QRCode !== "undefined") return true;
        } catch (_err) {
          // Try next source.
        }
      }
      return false;
    })();

    return state.qrLoaderPromise;
  };

  const currentOptions = () => {
    const bgMode = bgModeSelect.value;
    const light =
      bgMode === "transparent" ? "#0000" : bgMode === "dark" ? "#081110" : "#ffffff";
    const dark = bgMode === "dark" ? "#f4fbff" : "#03080f";
    return {
      width: Number(sizeRange.value),
      margin: Number(marginRange.value),
      errorCorrectionLevel: eccSelect.value,
      color: {
        dark,
        light,
      },
    };
  };

  const toDataUrl = (text, options) =>
    new Promise((resolve, reject) => {
      QRCode.toDataURL(text, options, (err, url) => {
        if (err) reject(err);
        else resolve(url);
      });
    });

  const toSvg = (text, options) =>
    new Promise((resolve, reject) => {
      if (typeof QRCode.toString !== "function") {
        reject(new Error("SVG export is unavailable"));
        return;
      }
      QRCode.toString(text, { ...options, type: "svg" }, (err, value) => {
        if (err) reject(err);
        else resolve(value);
      });
    });

  const addLogoOverlay = async (qrDataUrl) => {
    if (!state.logoImage) return qrDataUrl;

    const qrBase = await loadImage(qrDataUrl);
    const canvas = document.createElement("canvas");
    canvas.width = qrBase.naturalWidth || qrBase.width;
    canvas.height = qrBase.naturalHeight || qrBase.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return qrDataUrl;

    ctx.drawImage(qrBase, 0, 0);

    const logoScale = Number(logoSizeRange.value) / 100;
    const target = Math.round(Math.min(canvas.width, canvas.height) * logoScale);
    const padding = Math.round(target * 0.18);
    const bgSize = target + padding * 2;
    const x = Math.round((canvas.width - target) / 2);
    const y = Math.round((canvas.height - target) / 2);
    const bgX = x - padding;
    const bgY = y - padding;
    const radius = Math.round(bgSize * 0.18);

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(bgX + radius, bgY);
    ctx.lineTo(bgX + bgSize - radius, bgY);
    ctx.quadraticCurveTo(bgX + bgSize, bgY, bgX + bgSize, bgY + radius);
    ctx.lineTo(bgX + bgSize, bgY + bgSize - radius);
    ctx.quadraticCurveTo(bgX + bgSize, bgY + bgSize, bgX + bgSize - radius, bgY + bgSize);
    ctx.lineTo(bgX + radius, bgY + bgSize);
    ctx.quadraticCurveTo(bgX, bgY + bgSize, bgX, bgY + bgSize - radius);
    ctx.lineTo(bgX, bgY + radius);
    ctx.quadraticCurveTo(bgX, bgY, bgX + radius, bgY);
    ctx.closePath();
    ctx.fill();

    ctx.drawImage(state.logoImage, x, y, target, target);
    return canvas.toDataURL("image/png");
  };

  const generateQr = async (text) => {
    const options = currentOptions();
    try {
      const url = await toDataUrl(text, options);
      const composedUrl = await addLogoOverlay(url);
      qrImage.src = composedUrl;
      state.qrDataUrl = composedUrl;
      state.lastInput = text;
      downloadBtn.classList.remove("hidden");
      downloadBtn.disabled = false;
      setMessage(
        state.logoImage
          ? "QR code generated with center logo."
          : "QR code generated."
      );

      try {
        state.qrSvg = await toSvg(text, options);
        downloadSvgBtn.classList.remove("hidden");
        downloadSvgBtn.disabled = false;
      } catch (_svgErr) {
        state.qrSvg = null;
        downloadSvgBtn.classList.add("hidden");
        downloadSvgBtn.disabled = true;
      }
      updateActionStates();
    } catch (_err) {
      setMessage("QR generation failed. Please try again.", true);
    }
  };

  qrForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const value = input.value.trim();
    if (!value) {
      setMessage("Please enter text, URL, or email first.", true);
      input.focus();
      return;
    }

    const qrReady = await ensureQrCodeReady();
    if (!qrReady) {
      setMessage(
        "QR library is unavailable. Please disable blocker settings or try again.",
        true
      );
      return;
    }

    await generateQr(value);
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    qrImage.src = "assets/moon.webp";
    state.qrDataUrl = null;
    state.qrSvg = null;
    state.lastInput = "";
    downloadBtn.classList.add("hidden");
    downloadSvgBtn.classList.add("hidden");
    logoInput.value = "";
    state.logoImage = null;
    removeLogoBtn.classList.add("hidden");
    setMessage("");
    input.focus();
    updateActionStates();
  });

  downloadBtn.addEventListener("click", () => {
    if (!state.qrDataUrl) {
      setMessage("Generate a QR code before downloading.", true);
      return;
    }

    const a = document.createElement("a");
    a.href = state.qrDataUrl;
    a.download = "luna-qr-code.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  downloadSvgBtn.addEventListener("click", () => {
    if (!state.qrSvg) {
      setMessage("Generate a QR code before downloading.", true);
      return;
    }
    const blob = new Blob([state.qrSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "luna-qr-code.svg";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    if (state.logoImage) {
      setMessage("SVG exported without embedded logo. Use PNG to keep the logo.");
    }
  });

  const liveRegenerate = async () => {
    sizeValue.textContent = sizeRange.value;
    marginValue.textContent = marginRange.value;
    logoSizeValue.textContent = logoSizeRange.value;
    updateActionStates();
    if (!state.lastInput) return;
    await generateQr(state.lastInput);
  };

  [eccSelect, sizeRange, marginRange, bgModeSelect, logoSizeRange].forEach((el) => {
    el.addEventListener("input", liveRegenerate);
    el.addEventListener("change", liveRegenerate);
  });

  logoInput.addEventListener("change", async () => {
    const file = logoInput.files && logoInput.files[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      state.logoImage = await loadImage(dataUrl);
      removeLogoBtn.classList.remove("hidden");
      if (state.lastInput) await generateQr(state.lastInput);
      else setMessage("Logo loaded. Generate to apply.");
      updateActionStates();
    } catch (_err) {
      setMessage("Could not load logo file.", true);
    }
  });

  removeLogoBtn.addEventListener("click", async () => {
    state.logoImage = null;
    logoInput.value = "";
    removeLogoBtn.classList.add("hidden");
    if (state.lastInput) await generateQr(state.lastInput);
    else setMessage("Logo removed.");
    updateActionStates();
  });

  input.addEventListener("input", updateActionStates);

  const donationAmounts = [1, 5, 10];
  donationAmounts.forEach((amount) => {
    const button = document.createElement("button");
    button.className = "donate-button";
    button.type = "button";
    button.innerHTML = `$${amount}`;
    button.setAttribute("aria-label", `Donate ${amount} US dollars with PayPal`);
    button.addEventListener("click", () => {
      const donationUrl = `https://www.paypal.com/donate?business=daniel.oceno@gmail.com&amount=${amount}&currency_code=USD`;
      window.open(donationUrl, "_blank", "noopener,noreferrer");
    });
    donateButtonsContainer.appendChild(button);
  });

  const openModal = () => {
    state.previousFocus = document.activeElement;
    modal.setAttribute("aria-hidden", "false");
    closeModalBtn.focus();
  };

  const closeModal = () => {
    modal.setAttribute("aria-hidden", "true");
    if (state.previousFocus instanceof HTMLElement) {
      state.previousFocus.focus();
    }
  };

  privacyBtn.addEventListener("click", openModal);
  privacyChoicesBtn.addEventListener("click", () => {
    openModal();
    if (privacyChoicesHeading instanceof HTMLElement) {
      privacyChoicesHeading.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
  closeModalBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });

  const root = document.documentElement;
  const storedTheme = localStorage.getItem("luna-theme");
  if (storedTheme) {
    root.setAttribute("data-theme", storedTheme);
    themeSelect.value = storedTheme;
  }

  themeSelect.addEventListener("change", () => {
    const selectedTheme = themeSelect.value;
    root.setAttribute("data-theme", selectedTheme);
    localStorage.setItem("luna-theme", selectedTheme);
  });

  year.textContent = String(new Date().getFullYear());
  updateActionStates();
})();
