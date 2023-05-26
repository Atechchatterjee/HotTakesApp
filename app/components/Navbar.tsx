"use client";
import clsx from "clsx";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { nunito } from "app/fonts";

const Navbar = () => {
  const [currentURL, setCurrentURL] = useState<string>("");

  useEffect(() => {
    setCurrentURL(window.location.href);
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
    <div className={`${nunito.className} flex flex-wrap pb-5 pt-5`}>
      <img src="logo.svg" alt="hot-takes-logo flex-1" />
      <div className="flex flex-1 flex-wrap justify-end gap-10 font-semibold text-inactive">
        {NavLinks.map(({ name, href }) => (
          <Link
            href={href}
            className={clsx(
              checkURL(href) && "font-bold text-accent",
              "hover:text-accent"
            )}
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
