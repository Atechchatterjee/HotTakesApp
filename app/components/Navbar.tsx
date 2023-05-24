import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="flex flex-wrap pb-5 pt-5">
      <img src="logo.svg" alt="hot-takes-logo flex-1" />
      <div className="flex flex-1 flex-wrap justify-end gap-10 font-semibold text-inactive">
        <Link href="/" className="hover:text-accent">
          Home
        </Link>
        <Link href="/login" className="hover:text-accent">
          Login
        </Link>
        <Link className="hover:text-accent" href={""}>
          About
        </Link>
        <Link className="hover:text-accent" href={""}>
          Feed
        </Link>
        <Link className="hover:text-accent" href={"/dashboard"}>
          Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
