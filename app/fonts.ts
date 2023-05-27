import { Sora, Nunito, Inter } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-inter",
});

export const sora = Sora({
  subsets: ["latin"],
  display: "auto",
  weight: "variable",
  variable: "--font-sora",
});

export const nunito = Nunito({
  subsets: ["latin"],
  display: "auto",
  weight: "variable",
  variable: "--font-nunito",
});
