import React from "react";

const Navbar = () => {
  return (
    <div className="flex flex-wrap pb-5 pt-5">
      <img src="logo.svg" alt="hot-takes-logo flex-1" />
      <div className="flex flex-1 flex-wrap justify-end gap-10 font-semibold text-inactive">
        <a href="/" className="hover:text-accent">
          Home
        </a>
        <a href="/login" className="hover:text-accent">
          Login
        </a>
        <a className="hover:text-accent">About</a>
        <a className="hover:text-accent">Feed</a>
      </div>
    </div>
  );
};

export default Navbar;
