import Navbar from "./Navbar";
import React from "react";

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="container">{children}</div>
    </>
  );
};

export default Layout;
