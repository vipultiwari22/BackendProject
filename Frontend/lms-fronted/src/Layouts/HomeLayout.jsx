import React from "react";
import { FiMenu } from "react-icons/fi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";
function HomeLayout({ children }) {
  function changeWidth() {
    const drwaerSide = document.getElementsByClassName("drawer-side");
    drwaerSide[0].style.width = 0;
  }

  function hideDrawer() {
    const element = document.getElementsByClassName("drawer-togge");
    element[0].checked = false;
    changeWidth();
  }

  return (
    <>
      <div className="min-h-[90vh]">
        <div className="drawer absolute left-0 z-50 w-0">
          <input type="checkbox" className="drawer-toggle" id="my-drawer" />
          <div className="drawer-content">
            <label htmlFor="my-drawer" className="cursor-pointer relative">
              <FiMenu
                onClick={changeWidth}
                size={"32px"}
                className="font-bold text-white m-4"
              />
            </label>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <ul className="menu p-4 width-48 sm:w-80 bg-base-100 text-base-content relative">
              <li className="w-fit absolute right-2 z-50">
                <button>
                  <AiFillCloseCircle onClick={hideDrawer} size={"24px"} />
                </button>
              </li>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/About">About Us</Link>
              </li>
              <li>
                <Link to="/contactUs">Contact Us</Link>
              </li>
              <li>
                <Link to="/course">All Courses</Link>
              </li>
            </ul>
          </div>
        </div>
        {children}
        <Footer />
      </div>
    </>
  );
}

export default HomeLayout;
