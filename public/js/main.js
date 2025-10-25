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
  gen.onclick = async () => {
    const t = input.value.trim();
    if (!t) return alert("Please enter a URL or email.");
    const r = await fetch("/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t }),
      }),
      n = await r.json();
    if (n.qr) {
      img.src = n.qr;
      dl.classList.remove("hidden");
      dl.onclick = () => {
        const a = document.createElement("a");
        a.href = n.qr;
        a.download = "qr-code.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
      };
    }
  };
  clr.onclick = () => {
    input.value = "";
    img.src = "moon.webp";
    dl.classList.add("hidden");
  };
  document.querySelectorAll(".donate").forEach((e) => {
    e.onclick = () =>
      window.open(
        `https://www.paypal.com/donate?business=daniel.oceno@gmail.com&amount=${e.dataset.amount}&currency_code=USD`,
        "_blank"
      );
  });
  q("year").textContent = new Date().getFullYear();
  pBtn.onclick = () => (modal.style.display = "block");
  cBtn.onclick = () => (modal.style.display = "none");
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };
})();
