const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CHRISCANDLE bot server is working!");
});

async function sendTelegram(message) {
  const response = await fetch(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: process.env.CHAT_ID,
        text: message
      })
    }
  );

  return await response.json();
}

app.post("/api/order", async (req, res) => {
  try {
    const {
      name,
      product,
      quantity,
      contact,
      wishes,
      total
    } = req.body;

    const message =
      `🕯️ НОВЕ ЗАМОВЛЕННЯ — CHRISCANDLE\n\n` +
      `👤 Ім'я: ${name}\n` +
      `🕯️ Свічка: ${product}\n` +
      `🔢 Кількість: ${quantity}\n` +
      `📱 Контакт: ${contact}\n` +
      `💬 Побажання: ${wishes || "—"}\n` +
      `💰 Сума: ${total} грн`;

    const result = await sendTelegram(message);

    if (!result.ok) {
      return res.status(500).json({ success: false });
    }

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.post("/api/review", async (req, res) => {
  try {
    const {
      name,
      rating,
      review
    } = req.body;

    const message =
      `💌 НОВИЙ ВІДГУК — CHRISCANDLE\n\n` +
      `👤 Ім'я: ${name}\n` +
      `⭐ Оцінка: ${rating}/5\n` +
      `💬 Відгук: ${review}`;

    const result = await sendTelegram(message);

    if (!result.ok) {
      return res.status(500).json({ success: false });
    }

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`CHRISCANDLE server running on port ${PORT}`);
});
