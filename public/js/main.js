(() => {
  const q = (e) => document.getElementById(e),
    input = q("inputText"),
    gen = q("generateBtn"),
    clr = q("clearBtn"),
    dl = q("downloadBtn"),
    img = q("qrImage"),
    modal = q("privacy-modal"),
    pBtn = q("privacy-btn"),
    cBtn = q("close-modal");

  // Generate QR code entirely in the browser
  gen.onclick = () => {
    const t = input.value.trim();
    if (!t) return alert("Please enter a URL or email.");

    // Use QRCode.js to generate base64 QR code
    QRCode.toDataURL(t, { width: 200 }, (err, url) => {
      if (err) return console.error(err);

      img.src = url;
      dl.classList.remove("hidden");

      dl.onclick = () => {
        const a = document.createElement("a");
        a.href = url;
        a.download = "qr-code.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
      };
    });
  };

  // Clear input and reset QR image
  clr.onclick = () => {
    input.value = "";
    img.src = "assets/moon.webp";
    dl.classList.add("hidden");
  };

  // Donate buttons
  document.querySelectorAll(".donate").forEach((e) => {
    e.onclick = () =>
      window.open(
        `https://www.paypal.com/donate?business=daniel.oceno@gmail.com&amount=${e.dataset.amount}&currency_code=USD`,
        "_blank"
      );
  });

  // Current year
  q("year").textContent = new Date().getFullYear();

  // Privacy modal
  pBtn.onclick = () => (modal.style.display = "block");
  cBtn.onclick = () => (modal.style.display = "none");
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };
})();
