import React from "react";
import {
  BsFacebook,
  BsInstagram,
  BsLinkedin,
  BsTwitterX,
} from "react-icons/bs";
function Footer() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  return (
    <>
      <footer className="realtive left-0 bottom-0 h-[10vh] flex flex-col sm:flex-row items-center justify-between text-white bg-gray-800 py-5 sm:px-20">
        <section className="text-lg">
          Copyright {year} | all rights reserved{" "}
        </section>
        <section className="flex items-center justify-center gap-5 text-2xl text-white">
          <a
            href="#"
            className="hover:text-yellow-500 transition-all ease-in-out duration-300"
          >
            <BsFacebook />
          </a>
          <a
            href="#"
            className="hover:text-yellow-500 transition-all ease-in-out duration-300"
          >
            <BsLinkedin />
          </a>
          <a
            href="#"
            className="hover:text-yellow-500 transition-all ease-in-out duration-300"
          >
            <BsInstagram />
          </a>
          <a
            href="#"
            className="hover:text-yellow-500 transition-all ease-in-out duration-300"
          >
            <BsTwitterX />
          </a>
        </section>
      </footer>
    </>
  );
}

export default Footer;
