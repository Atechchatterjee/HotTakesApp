"use client";
import clsx from "clsx";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { appwriteAccount, appwriteAvatars } from "utils/appwriteConfig";
import { AvatarDropDown } from "app/components/AvatarDropDown";

export default function Navbar() {
  const [currentURL, setCurrentURL] = useState<string>("");
  const [userInitials, setUserInitials] = useState<URL | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setCurrentURL(window.location.href);
    setUserInitials(appwriteAvatars.getInitials());

    appwriteAccount
      .get()
      .then(() => setLoggedIn(true))
      .catch(() => setLoggedIn(false));
  }, []);

  const checkURL = (givenURL: string) =>
    givenURL === currentURL.substring(currentURL.lastIndexOf("/"));

  const NavLinks = [
    { name: "Home", href: "/" },
    { name: "Login", href: "/login" },
    { name: "Feed", href: "/feed" },
    { name: "About", href: "/about" },
  ];

  return (
    <div className="flex flex-wrap pb-5 pt-5">
      <img src="logo.svg" alt="hot-takes-logo flex-1" />
      <div className="text-inactive font-regular flex flex-1 flex-wrap justify-end gap-10 text-[0.9rem]">
        {NavLinks.map(({ name, href }, i) => (
          <Link
            key={i}
            href={href}
            className={clsx(
              checkURL(href) ? "font-semibold text-accent" : "text-gray-300",
              "self-center hover:text-accent"
            )}
          >
            {name}
          </Link>
        ))}
        {loggedIn ? (
          <AvatarDropDown
            avatarImgSrc={userInitials?.href || ""}
          ></AvatarDropDown>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
