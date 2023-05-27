"use client";
import React from "react";
import Navbar from "app/components/Navbar";
import { Button } from "app/components/ui/button";
import { appwriteAccount } from "utils/appwriteConfig";
import { sora } from "app/fonts";

export default function Login() {
  const handleGithubSign = () => {
    try {
      appwriteAccount.createOAuth2Session(
        "github",
        "http://localhost:3000/dashboard", // success URL
        "http://localhost:3000/login" // failure URL
      );
    } catch (err) {
      console.error("Appwrite Github OAuth Failed!");
    }
  };

  const handleGoogleSign = () => {
    try {
      appwriteAccount.createOAuth2Session(
        "google",
        "http://localhost:3000/dashboard", // success URL
        "http://localhost:3000/login" // failure URL
      );
    } catch (err) {
      console.error("Appwrite Google OAuth Failed!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="mt-[7rem] flex gap-5">
        <div className="flex flex-col gap-5 pr-[15%]">
          <h1
            className={`${sora.className} bg-gradient-to-r from-accent  to-white bg-clip-text
          text-5xl font-bold leading-[1.25] text-transparent
          `}
          >
            Want to be a part of these communities?
          </h1>
          <div className="absolute z-[-1] mt-[-10rem] h-96 w-96 rounded-full bg-primary blur-[20em]" />
          <p className="text-[1.1rem]">
            Or become an{" "}
            <span className={`${sora.className} font-semibold text-accent`}>
              Author
            </span>{" "}
          </p>
          <div className="mt-[2em] flex flex-col gap-12 rounded-lg bg-gradient-to-b from-[#1A163D] to-[#181339] p-10">
            <h2
              className={`${sora.className} bg-gradient-to-r from-white  to-primary bg-clip-text text-3xl font-semibold leading-[1.15] text-transparent`}
            >
              Normie
            </h2>
            <p className="text-[1.1rem] leading-[1.8rem]">
              <span className={`${sora.className} font-semibold`}>
                “Normies”{" "}
              </span>
              <span>
                refer to normal users who are a part of various communities but
                do not have their own communities. It is a long established fact
                that a reader will be distracted by the readable content of a
                page when looking at its layout.
              </span>
            </p>
            <div className="flex flex-col gap-3">
              <Button variant="secondary" onClick={handleGithubSign} size="xl">
                <div className="flex w-full justify-center gap-5">
                  <img src="github-icon.svg" alt="github-icon" />
                  <span>Github SignIn</span>
                </div>
              </Button>
              <p
                className={`${sora.className} text-center text-[0.8rem] font-semibold`}
              >
                OR
              </p>
              <Button variant="primary" onClick={handleGoogleSign} size="xl">
                <div className="flex justify-center gap-5">
                  <img src="google-icon.svg" alt="google-icon" />
                  <span>Google SignIn</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
        <img
          src="login-illus.svg"
          alt="login-illus"
          className="z-[-1] scale-[110%]"
        />
      </div>
    </>
  );
}
