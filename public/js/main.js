(() => {
  // ---------------------------
  // Disable right-click / copying
  // ---------------------------
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("copy", (e) => e.preventDefault());
  document.addEventListener("cut", (e) => e.preventDefault());
  document.addEventListener("paste", (e) => e.preventDefault());
  const donateButtonsContainer = document.getElementById("donate-buttons");

  const q = (e) => document.getElementById(e),
    input = q("inputText"),
    gen = q("generateBtn"),
    clr = q("clearBtn"),
    dl = q("downloadBtn"),
    img = q("qrImage"),
    modal = q("privacy-modal"),
    pBtn = q("privacy-btn"),
    cBtn = q("close-modal");

  // Generate QR code
  gen.onclick = () => {
    const t = input.value.trim();
    if (!t) return alert("Please enter a URL or email.");

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

  // Clear input
  clr.onclick = () => {
    input.value = "";
    img.src = "assets/moon.webp";
    dl.classList.add("hidden");
  };

  // Donate buttons
  const donationAmounts = [1, 5, 10];
  donationAmounts.forEach((amount) => {
    const button = document.createElement("button");
    button.className = "donate-buttons button";
    button.dataset.amount = amount;
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" viewBox="0 0 24 24"><path d="M23.5 6.5c-.3-2.3-2.4-3.5-5.6-3.5h-8.8c-.4 0-.8.3-.9.7l-3.2 15.3c-.1.5.3.9.8.9h3.8l.8-4h2.4c4.6 0 8.1-2.3 9.1-6.4.1-.5.2-1 .2-1.5z" fill="skyblue"/></svg>$${amount}`;
    button.onclick = () => {
      window.open(
        `https://www.paypal.com/donate?business=daniel.oceno@gmail.com&amount=${amount}&currency_code=USD`,
        "_blank"
      );
    };
    donateButtonsContainer.appendChild(button);
  });
  
  // Year
  q("year").textContent = new Date().getFullYear();

  // Privacy modal
  pBtn.onclick = () => (modal.style.display = "block");
  cBtn.onclick = () => (modal.style.display = "none");
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };
})();
