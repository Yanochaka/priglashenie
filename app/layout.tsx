import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Для Яны — один важный вопрос",
  description: "Нежное приглашение на свидание, созданное специально для Яны.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
