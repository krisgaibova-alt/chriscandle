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


/* =========================
   🕯️ ЗАМОВЛЕННЯ
========================= */

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
      console.error("Telegram error:", result);
      return res.status(500).json({ success: false });
    }

    res.json({ success: true });

  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ success: false });
  }
});


/* =========================
   💌 ВІДГУК
========================= */

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
      console.error("Telegram error:", result);
      return res.status(500).json({ success: false });
    }

    res.json({ success: true });

  } catch (error) {
    console.error("Review error:", error);
    res.status(500).json({ success: false });
  }
});


/* =========================
   🆘 ПІДТРИМКА
========================= */

app.post("/api/support", async (req, res) => {
  try {
    const {
      name,
      contact,
      email,
      topic,
      message: userMessage
    } = req.body;

    const message =
      `🆘 НОВЕ ЗВЕРНЕННЯ В ПІДТРИМКУ — CHRISCANDLE\n\n` +
      `👤 Ім'я: ${name}\n` +
      `📱 Контакт: ${contact}\n` +
      `📧 Email: ${email}\n` +
      `📌 Тема: ${topic}\n\n` +
      `💬 Повідомлення:\n${userMessage}`;

    const result = await sendTelegram(message);

    if (!result.ok) {
      console.error("Telegram support error:", result);
      return res.status(500).json({ success: false });
    }

    res.json({ success: true });

  } catch (error) {
    console.error("Support error:", error);
    res.status(500).json({ success: false });
  }
});


/* =========================
   🚀 ЗАПУСК СЕРВЕРА
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`CHRISCANDLE server running on port ${PORT}`);
});const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;


/* =========================
   🏠 ГОЛОВНА
========================= */

app.get("/", (req, res) => {
  res.send("CHRISCANDLE bot server is working!");
});


/* =========================
   💬 SUPABASE
========================= */

async function supabaseFetch(path, options = {}) {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
}


/* =========================
   📱 TELEGRAM
========================= */

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


/* =========================
   🕯️ ЗАМОВЛЕННЯ
========================= */

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
      console.error("Telegram error:", result);
      return res.status(500).json({ success: false });
    }

    res.json({ success: true });

  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ success: false });
  }
});


/* =========================
   💌 ОТРИМАТИ ВІДГУКИ
========================= */

app.get("/api/reviews", async (req, res) => {
  try {
    const response = await supabaseFetch(
      "reviews?select=id,name,rating,review,created_at&order=created_at.desc"
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Supabase GET error:", errorText);

      return res.status(500).json({
        success: false
      });
    }

    const reviews = await response.json();

    res.json({
      success: true,
      reviews
    });

  } catch (error) {
    console.error("Reviews loading error:", error);

    res.status(500).json({
      success: false
    });
  }
});


/* =========================
   💌 НОВИЙ ВІДГУК
========================= */

app.post("/api/review", async (req, res) => {
  try {
    const {
      name,
      rating,
      review
    } = req.body;

    const cleanName = String(name || "").trim();
    const cleanReview = String(review || "").trim();
    const cleanRating = Number(rating);

    if (
      !cleanName ||
      !cleanReview ||
      !Number.isInteger(cleanRating) ||
      cleanRating < 1 ||
      cleanRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Неправильні дані відгуку"
      });
    }

    if (cleanName.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Ім'я занадто довге"
      });
    }

    if (cleanReview.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Відгук занадто довгий"
      });
    }


    /* Зберігаємо відгук у Supabase */

    const saveResponse = await supabaseFetch("reviews", {
      method: "POST",
      headers: {
        Prefer: "return=representation"
      },
      body: JSON.stringify({
        name: cleanName,
        rating: cleanRating,
        review: cleanReview
      })
    });

    if (!saveResponse.ok) {
      const errorText = await saveResponse.text();

      console.error("Supabase review error:", errorText);

      return res.status(500).json({
        success: false
      });
    }

    const savedReview = await saveResponse.json();


    /* Надсилаємо повідомлення в Telegram */

    try {
      const message =
        `💌 НОВИЙ ВІДГУК — CHRISCANDLE\n\n` +
        `👤 Ім'я: ${cleanName}\n` +
        `⭐ Оцінка: ${cleanRating}/5\n` +
        `💬 Відгук: ${cleanReview}`;

      const telegramResult = await sendTelegram(message);

      if (!telegramResult.ok) {
        console.error("Telegram review error:", telegramResult);
      }

    } catch (telegramError) {
      console.error("Telegram notification error:", telegramError);
    }


    res.json({
      success: true,
      review: savedReview[0]
    });

  } catch (error) {
    console.error("Review error:", error);

    res.status(500).json({
      success: false
    });
  }
});


/* =========================
   🆘 ПІДТРИМКА
========================= */

app.post("/api/support", async (req, res) => {
  try {
    const {
      name,
      contact,
      email,
      topic,
      message: userMessage
    } = req.body;

    const message =
      `🆘 НОВЕ ЗВЕРНЕННЯ В ПІДТРИМКУ — CHRISCANDLE\n\n` +
      `👤 Ім'я: ${name}\n` +
      `📱 Контакт: ${contact}\n` +
      `📧 Email: ${email}\n` +
      `📌 Тема: ${topic}\n\n` +
      `💬 Повідомлення:\n${userMessage}`;

    const result = await sendTelegram(message);

    if (!result.ok) {
      console.error("Telegram support error:", result);

      return res.status(500).json({
        success: false
      });
    }

    res.json({
      success: true
    });

  } catch (error) {
    console.error("Support error:", error);

    res.status(500).json({
      success: false
    });
  }
});


/* =========================
   🚀 ЗАПУСК СЕРВЕРА
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`CHRISCANDLE server running on port ${PORT}`);
});
