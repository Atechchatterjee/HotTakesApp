import { Sora, Nunito } from "next/font/google";

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
