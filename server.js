const express = require("express");
const QRCode = require("qrcode");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    // 🔥 Generate higher-resolution QR code (512x512)
    const qrDataUrl = await QRCode.toDataURL(text, {
      width: 512,
      margin: 1,
      scale: 10, // add this line for higher internal scaling
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    res.json({ qr: qrDataUrl });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ QR Generator running at http://localhost:${PORT}`);
});
