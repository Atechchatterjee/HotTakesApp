"use client";
import { NextPage } from "next";
import React from "react";
import Navbar from "app/components/Navbar";
import Button from "app/components/Button";
import { appwriteAccount } from "utils/appwriteConfig";
import { Sora } from "next/font/google";

const sora = Sora({ subsets: ["latin"], weight: ["700"] });

const Login: NextPage = () => {
  return (
    <>
      <Navbar />
      <div className="mt-[7rem] flex gap-10">
        <div className="flex flex-col gap-12 pr-[10%]">
          <h1
            className={`${sora.className}  bg-gradient-to-r from-white  to-primary bg-clip-text
          text-6xl font-semibold leading-[1.15] text-transparent
          `}
          >
            Want to be a part of these communities?
          </h1>
          <Button
            variant="primary"
            onClick={() => {
              try {
                appwriteAccount.createOAuth2Session(
                  "github",
                  "http://localhost:3000/dashboard", // success URL
                  "http://localhost:3000/login" // failure URL
                );
              } catch (err) {
                console.error("Appwrite Github OAuth Failed!");
              }
            }}
          >
            Github SignIn
          </Button>
        </div>
        <img
          src="login-illus.svg"
          alt="login-illus"
          className="z-[-1] scale-[115%]"
        />
      </div>
    </>
  );
};

export default Login;
