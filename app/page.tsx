"use client";

import { useMemo, useState } from "react";

type FlowerProps = {
  className: string;
  petals?: number;
};

function Flower({ className, petals = 12 }: FlowerProps) {
  return (
    <span className={`flower ${className}`} aria-hidden="true">
      {Array.from({ length: petals }).map((_, index) => (
        <i
          className="petal"
          key={index}
          style={{ "--petal": index } as React.CSSProperties}
        />
      ))}
      <i className="flower-core" />
    </span>
  );
}

function Hydrangea({ className }: { className: string }) {
  return (
    <span className={`hydrangea ${className}`} aria-hidden="true">
      {Array.from({ length: 15 }).map((_, index) => (
        <i
          className="hydrangea-bloom"
          key={index}
          style={{ "--bloom": index } as React.CSSProperties}
        />
      ))}
    </span>
  );
}

function Garden() {
  return (
    <div className="garden" aria-hidden="true">
      <div className="sprig sprig-left">
        <i className="stem stem-one" />
        <i className="stem stem-two" />
        <i className="leaf leaf-one" />
        <i className="leaf leaf-two" />
        <i className="leaf leaf-three" />
        <Flower className="flower-peony" petals={16} />
        <Flower className="flower-spray-one" petals={10} />
        <Flower className="flower-spray-two" petals={10} />
        <Hydrangea className="hydrangea-blue" />
      </div>

      <div className="sprig sprig-right">
        <i className="stem stem-three" />
        <i className="leaf leaf-four" />
        <i className="leaf leaf-five" />
        <Flower className="flower-rose" petals={14} />
        <Flower className="flower-spray-three" petals={10} />
        <Hydrangea className="hydrangea-pink" />
      </div>

      {Array.from({ length: 9 }).map((_, index) => (
        <i className={`floating-petal floating-petal-${index + 1}`} key={index} />
      ))}
    </div>
  );
}

function StepDots({ current }: { current: number }) {
  return (
    <div className="step-dots" aria-label={`Шаг ${current + 1} из 4`}>
      {[0, 1, 2, 3].map((step) => (
        <i key={step} className={step <= current ? "is-active" : ""} />
      ))}
    </div>
  );
}

function formatDate(date: string) {
  if (!date) return "";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    weekday: "long",
  }).format(new Date(`${date}T12:00:00`));
}

const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const WEEK_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const TIME_OPTIONS = [
  { value: "17:00", label: "ранний вечер" },
  { value: "18:30", label: "золотой час" },
  { value: "20:00", label: "вечер" },
  { value: "21:30", label: "поздний вечер" },
];

// GitHub Pages is static, so these values are intentionally bundled into the
// browser build at the site owner's explicit request.
const TELEGRAM_BOT_TOKEN = "8654526010:AAHrsbT8b2oIvmwz95WnJKs0IsyJI7BIFlc";
const TELEGRAM_CHAT_ID = "8906052538";

function toLocalIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function CalendarPicker({
  value,
  minDate,
  onChange,
}: {
  value: string;
  minDate: string;
  onChange: (value: string) => void;
}) {
  const initialDate = value ? new Date(`${value}T12:00:00`) : new Date(`${minDate}T12:00:00`);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  );

  const firstWeekDay = (visibleMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    0,
  ).getDate();
  const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const minimumMonth = new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
  const canGoBack = monthStart.getTime() > minimumMonth.getTime();

  const changeMonth = (offset: number) => {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + offset, 1),
    );
  };

  return (
    <div className="calendar-card">
      <div className="calendar-heading">
        <button
          type="button"
          className="calendar-arrow"
          onClick={() => changeMonth(-1)}
          disabled={!canGoBack}
          aria-label="Предыдущий месяц"
        >
          ←
        </button>
        <div>
          <strong>{MONTHS[visibleMonth.getMonth()]}</strong>
          <span>{visibleMonth.getFullYear()}</span>
        </div>
        <button
          type="button"
          className="calendar-arrow"
          onClick={() => changeMonth(1)}
          aria-label="Следующий месяц"
        >
          →
        </button>
      </div>

      <div className="calendar-grid calendar-weekdays" aria-hidden="true">
        {WEEK_DAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="calendar-grid calendar-days" role="grid" aria-label="Календарь">
        {Array.from({ length: firstWeekDay }).map((_, index) => (
          <i key={`empty-${index}`} aria-hidden="true" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dayDate = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
          const isoDate = toLocalIso(dayDate);
          const isSelected = isoDate === value;
          const isToday = isoDate === minDate;
          const isPast = isoDate < minDate;

          return (
            <button
              type="button"
              role="gridcell"
              key={isoDate}
              className={`${isSelected ? "is-selected" : ""} ${isToday ? "is-today" : ""}`}
              disabled={isPast}
              aria-selected={isSelected}
              aria-label={formatDate(isoDate)}
              onClick={() => onChange(isoDate)}
            >
              {day}
              {isToday && <small>сегодня</small>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [noIsGone, setNoIsGone] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");

  const minDate = useMemo(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    return new Date(today.getTime() - offset * 60_000)
      .toISOString()
      .split("T")[0];
  }, []);

  const goTo = (nextStep: number) => {
    setStep(nextStep);
  };

  const sendDateChoice = async () => {
    if (!date || !time || isSending) return;

    setIsSending(true);
    setSendError("");

    try {
      if (window.location.hostname.endsWith("github.io")) {
        const message = [
          "🌸 Яна выбрала дату для свидания!",
          "",
          `📅 ${new Intl.DateTimeFormat("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
            weekday: "long",
          }).format(new Date(`${date}T12:00:00`))}`,
          `🕰 ${time}`,
          "",
          "Кажется, пора готовить идеальный вечер ✨",
        ].join("\n");

        const telegramResponse = await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            body: new URLSearchParams({
              chat_id: TELEGRAM_CHAT_ID,
              text: message,
            }),
          },
        );

        const telegramResult = (await telegramResponse.json()) as {
          ok?: boolean;
        };

        if (!telegramResponse.ok || !telegramResult.ok) {
          throw new Error("Telegram не принял сообщение. Попробуй ещё раз.");
        }

        goTo(3);
        return;
      }

      const response = await fetch("/api/send-date", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Не получилось отправить выбор. Попробуй ещё раз.");
      }

      goTo(3);
    } catch (error) {
      setSendError(
        error instanceof Error ? error.message : "Не получилось отправить выбор. Попробуй ещё раз.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className={`experience experience-step-${step}`}>
      <div className="paper-texture" aria-hidden="true" />
      <Garden />

      <section className="invitation-card" aria-live="polite">
        <div className="card-corner card-corner-top" aria-hidden="true">✦</div>
        <div className="card-corner card-corner-bottom" aria-hidden="true">✦</div>
        <p className="letter-mark">маленькое послание для Яны</p>

        <div className="screen-shell" key={step}>
          {step === 0 && (
            <div className="screen screen-question">
              <p className="eyebrow">один очень важный вопрос</p>
              <h1>
                <span>Яна,</span>
                пойдёшь со мной
                <br />
                на свидание?
              </h1>
              <p className="subtitle">
                Обещаю красивый вечер, цветы и повод улыбаться ещё долго после него.
              </p>

              <div className={`answer-zone ${noIsGone ? "yes-only" : ""}`}>
                <button className="button button-primary" onClick={() => goTo(1)}>
                  Да, с удовольствием
                  <span aria-hidden="true">→</span>
                </button>
                {!noIsGone && (
                  <button className="button button-ghost" onClick={() => setNoIsGone(true)}>
                    Нет
                  </button>
                )}
              </div>

              <div className={`unavailable-note ${noIsGone ? "is-visible" : ""}`}>
                <span aria-hidden="true">🌸</span>
                Ой… кажется, эта опция сегодня не расцвела. Остаётся одна — и она прекрасная.
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="screen screen-serious">
              <div className="heart-seal" aria-hidden="true">
                <span>♥</span>
              </div>
              <p className="eyebrow">контрольный вопрос</p>
              <h1>
                Серьёзно
                <span className="question-marks">???</span>
              </h1>
              <p className="subtitle">
                Потому что я уже начал представлять, каким красивым будет наш вечер.
              </p>
              <button className="button button-primary button-wide" onClick={() => goTo(2)}>
                Да, абсолютно серьёзно
                <span aria-hidden="true">→</span>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="screen screen-date">
              <p className="eyebrow">теперь самое приятное</p>
              <h1>Выбери день, который станет нашим</h1>
              <p className="subtitle">
                Укажи дату и время, которые будут удобны именно тебе.
              </p>

              <div className="date-planner">
                <CalendarPicker value={date} minDate={minDate} onChange={setDate} />

                <div className="time-card">
                  <div className="time-heading">
                    <span className="time-icon" aria-hidden="true">◷</span>
                    <div>
                      <strong>Во сколько?</strong>
                      <span>выбери удобное время</span>
                    </div>
                  </div>

                  <div className="time-options">
                    {TIME_OPTIONS.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        className={time === option.value ? "is-selected" : ""}
                        onClick={() => setTime(option.value)}
                        aria-pressed={time === option.value}
                      >
                        <strong>{option.value}</strong>
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>

                  <label className="custom-time">
                    <span>или своё время</span>
                    <input
                      type="time"
                      value={time}
                      onChange={(event) => setTime(event.target.value)}
                      aria-label="Указать другое время"
                    />
                  </label>
                </div>
              </div>

              {date && time && (
                <p className="date-preview">
                  Тогда встречаемся <strong>{formatDate(date)}</strong> в <strong>{time}</strong>
                </p>
              )}

              <button
                className="button button-primary button-wide"
                disabled={!date || !time || isSending}
                onClick={sendDateChoice}
              >
                {isSending ? "Отправляю твой выбор…" : "Всё выбрано — отправить"}
                <span aria-hidden="true">→</span>
              </button>

              {sendError && (
                <p className="send-error" role="alert">
                  {sendError}
                </p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="screen screen-final">
              <div className="final-bloom" aria-hidden="true">
                <span>♥</span>
              </div>
              <p className="eyebrow">значит, договорились</p>
              <h1>
                Яночка,
                <br />
                спасибо тебе
              </h1>
              <p className="final-copy">
                Я сделаю всё на высшем уровне. Тебе останется только быть собой и взять с собой
                хорошее настроение — о месте, деталях, цветах и маленьких сюрпризах позабочусь я.
              </p>

              <div className="date-ticket">
                <span className="ticket-label">наше свидание</span>
                <strong>{formatDate(date)}</strong>
                <span>в {time}</span>
              </div>

              <p className="signature">Очень жду наш вечер <span>♥</span></p>
              <p className="delivered-note">Твой выбор уже прилетел мне в Telegram</p>

              <div className="petal-burst" aria-hidden="true">
                {Array.from({ length: 12 }).map((_, index) => (
                  <i key={index} style={{ "--burst": index } as React.CSSProperties} />
                ))}
              </div>
            </div>
          )}
        </div>

        <StepDots current={step} />
      </section>

      <p className="bottom-note">создано с особым вниманием к одной особенной девушке</p>
    </main>
  );
}
