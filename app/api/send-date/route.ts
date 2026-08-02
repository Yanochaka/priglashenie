import { NextResponse } from "next/server";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function formatDateForMessage(date: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(`${date}T12:00:00`));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { date?: unknown; time?: unknown };
    const date = typeof body.date === "string" ? body.date : "";
    const time = typeof body.time === "string" ? body.time : "";

    if (!DATE_PATTERN.test(date) || !TIME_PATTERN.test(time)) {
      return NextResponse.json(
        { message: "Пожалуйста, выбери дату и время ещё раз." },
        { status: 400 },
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json(
        { message: "Бот ещё не подключён. Попроси автора приглашения закончить настройку." },
        { status: 503 },
      );
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: [
            "🌸 Яна выбрала дату для свидания!",
            "",
            `📅 ${formatDateForMessage(date)}`,
            `🕰 ${time}`,
            "",
            "Кажется, пора готовить идеальный вечер ✨",
          ].join("\n"),
        }),
        cache: "no-store",
      },
    );

    if (!telegramResponse.ok) {
      console.error("Telegram delivery failed with status", telegramResponse.status);
      return NextResponse.json(
        { message: "Telegram пока не принял сообщение. Попробуй ещё раз чуть позже." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Не получилось отправить выбор. Попробуй ещё раз." },
      { status: 500 },
    );
  }
}
