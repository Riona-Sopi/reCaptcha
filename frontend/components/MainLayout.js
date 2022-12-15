import React from "react";
import Navbar from "../components/Navnav";
import Footer from "../components/Footer";
const MainLayout = ({ children, setLangType, langType }) => {
  return (
    <div className="layout1">
      <Navbar setLangType={setLangType} langType={langType} />
      {children}
      {/* <Footer/> */}
    </div>
  );
};

export default MainLayout;
