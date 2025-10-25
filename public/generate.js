// generate.js
import QRCode from "qrcode";

export async function handler(event) {
  try {
    const { text } = JSON.parse(event.body || "{}");
    if (!text) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing text" }) };
    }

    const qr = await QRCode.toDataURL(text);
    return {
      statusCode: 200,
      body: JSON.stringify({ qr }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}