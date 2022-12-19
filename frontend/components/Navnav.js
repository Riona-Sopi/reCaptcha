import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Cursor from "../Cursor";
import { FaBars, FaTimes } from "react-icons/fa";
function Navnav({ setLangType, langType }) {
  $(function () {
    $(document).scroll(function () {
      var $nav = $(".Nav2");
      $nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
    });
  });

  const navRef = useRef();
  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };

  const handleLanguageChange = (e) => {
    if (setLangType) {
      setLangType(e.target.value);
      localStorage.setItem("lang", e.target.value);
    }
  };

  return (
    <div className="Nav2 fixed-top">
      <Cursor />
      <header className="d-flex justify-content-center">
        <div>
          <div className="navlist mr-auto">
            <nav ref={navRef}>
              <Link href="/brendet">
                <a className="navCom">BRENDE</a>
              </Link>

              <div className="navsearch d-flex">
            
                <select
                  onChange={handleLanguageChange}
                  style={{ marginLeft: 100 }}
                  value={langType ? langType : 0}
                >
                  <option className="languageS1 text-left" value={0}>
                    SHQ
                  </option>
                  <option className="languageS1 text-left" value={1}>
                    EN
                  </option>
                </select>
              </div>

              <button className="nav-btn nav-close-btn" onClick={showNavbar}>
                <FaTimes />
              </button>
            </nav>
          </div>
        </div>
        <button className="nav-btn" onClick={showNavbar}>
          <FaBars className="faBars" />
        </button>
      </header>
    </div>
  );
}

export default Navnav;
