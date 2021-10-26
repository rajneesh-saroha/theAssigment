import React from "react";
import "./Header.css";
import { useHistory } from "react-router-dom";

function Header() {
  const history = useHistory();
  const logout = async () => {
    const response = await fetch("http://localhost:4000/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + sessionStorage.getItem("accessToken"),
      },
    });
    if (response.status == 201) {
      sessionStorage.removeItem("accessToken");

      history.replace("/adminLogin");
    } else {
      alert("error logging out");
    }
  };
  return (
    <div className="header">
      <div className="header_title">ADMIN DASHBOARD</div>
      <div className="header_logout" onClick={logout}>
        LOGOUT
      </div>
    </div>
  );
}

export default Header;
