import * as React from "react";
import NavBar from "./navbar";

export default ({ children }) => (
  <div>
    <NavBar />
    <div
      style={{
        margin: "0px auto",
        display: "block",
        padding: "15px"
      }}
    >
      {children}
    </div>
  </div>
);
