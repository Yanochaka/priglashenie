import type { Metadata } from "next";
import "./globals.css";

const title = "Для Яны — один важный вопрос";
const description =
  "Нежное приглашение на свидание, созданное специально для Яны.";
const imageUrl = "https://yanochaka.github.io/priglashenie/og.png";

export const metadata: Metadata = {
  metadataBase: new URL("https://yanochaka.github.io/priglashenie/"),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "ru_RU",
    images: [
      {
        url: imageUrl,
        width: 1536,
        height: 1024,
        alt: "Яна, пойдёшь со мной на свидание?",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [imageUrl],
  },
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
