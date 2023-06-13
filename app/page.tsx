"use client";
import Head from "next/head";
import Navbar from "app/components/Navbar";
import { Button } from "app/components/ui/button";
import BodyWrapper from "./components/BodyWrapper";
import { appwriteAvatars } from "utils/appwriteConfig";

import { sora } from "app/fonts";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  useEffect(() => {
    const result = appwriteAvatars.getInitials();
    console.table(result);
  }, []);

  const router = useRouter();

  return (
    <BodyWrapper>
      <Head>
        <title>Hot Takes App</title>
      </Head>
      <Navbar />
      <div className="absolute z-[-1] mt-[5rem] h-96 w-96 rounded-full bg-primary blur-[14em]" />
      <div className="landing-page flex w-[95%] flex-row gap-10 pt-40">
        <div className="flex flex-col flex-wrap gap-10 pr-40">
          <h1
            className={`${sora.className} bg-gradient-to-r from-accent to-white bg-clip-text text-[3.2rem] font-bold leading-[1.2]  text-transparent`}
          >
            Give Your Hot Takes
            <br />
            on trendiest Tech Topics
          </h1>
          <p className="text-[1.15rem] leading-relaxed text-gray-300">
            Hot Takes App is centred around the concept of building communities
            to host discussions on the trendiest tech topics in this world. Be a
            part of these communities and have your own fair share of hot takes.
          </p>
          <div className="flex flex-wrap gap-5">
            <Button variant="primary" size="xl">
              <div className="flex gap-2">
                <img
                  src="explore-icon.svg"
                  alt="explore-icon"
                  className="scale-75"
                />
                <span
                  className="self-center"
                  onClick={() => router.push("/dashboard")}
                >
                  Explore
                </span>
              </div>
            </Button>
            <Button
              variant="secondary"
              size="xl"
              onClick={() => router.push("/login")}
            >
              Get Started
            </Button>
          </div>
        </div>
        <img
          src="landing-illus.svg"
          alt="landing-illus"
          className="scale-[120%]"
        />
      </div>
    </BodyWrapper>
  );
}
