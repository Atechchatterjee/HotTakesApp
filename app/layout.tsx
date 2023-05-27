import "styles/globals.css";
import { nunito } from "app/fonts";

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Hot Takes</title>
      </head>
      <body className={`${nunito.className}`}>{children}</body>
    </html>
  );
}
