const inputText = document.getElementById("inputText");
const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");
const downloadBtn = document.getElementById("downloadBtn");
const qrImage = document.getElementById("qrImage");

generateBtn.onclick = async () => {
  const text = inputText.value.trim();
  if (!text) return alert("Please enter a URL or email.");

  const res = await fetch("/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await res.json();
  if (data.qr) {
    qrImage.src = data.qr;
    downloadBtn.classList.remove("hidden");
    downloadBtn.onclick = () => downloadQR(data.qr);
  }
};

clearBtn.onclick = () => {
  inputText.value = "";
  qrImage.src = "moon.png";
  downloadBtn.classList.add("hidden");
};

function downloadQR(dataUrl) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = "qr-code.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

document.querySelectorAll(".donate").forEach((btn) => {
  btn.onclick = () => {
    const amount = btn.dataset.amount;
    const paypalUrl = `https://www.paypal.com/donate?business=daniel.oceno@gmail.com&amount=${amount}&currency_code=USD`;
    window.open(paypalUrl, "_blank");
  };
});

// Update year automatically
document.getElementById("year").textContent = new Date().getFullYear();

// Modal functionality
const privacyBtn = document.getElementById("privacy-btn");
const privacyModal = document.getElementById("privacy-modal");
const closeModalBtn = document.getElementById("close-modal");

privacyBtn.addEventListener("click", () => {
  privacyModal.style.display = "block";
});

closeModalBtn.addEventListener("click", () => {
  privacyModal.style.display = "none";
});

// Close modal if user clicks outside content
window.addEventListener("click", (e) => {
  if (e.target === privacyModal) {
    privacyModal.style.display = "none";
  }
});
