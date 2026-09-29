const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("CHRISCANDLE bot server is working!");
});

app.post("/api/order", async (req, res) => {
  try {
    const { product, quantity, total } = req.body;

    const message =
      `🕯️ НОВЕ ЗАМОВЛЕННЯ — CHRISCANDLE\n\n` +
      `🕯️ Свічка: ${product}\n` +
      `🔢 Кількість: ${quantity}\n` +
      `💰 Сума: ${total} грн`;

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

    const result = await response.json();

    if (!result.ok) {
      return res.status(500).json({
        success: false
      });
    }

    res.json({
      success: true
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`CHRISCANDLE server running on port ${PORT}`);
});
