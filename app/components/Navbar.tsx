"use client";
import clsx from "clsx";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Navbar() {
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
    <div className="flex flex-wrap pb-5 pt-5">
      <img src="logo.svg" alt="hot-takes-logo flex-1" />
      <div className="text-inactive flex flex-1 flex-wrap justify-end gap-10 font-semibold">
        {NavLinks.map(({ name, href }, i) => (
          <Link
            key={i}
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
}
