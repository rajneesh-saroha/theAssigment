import React, { useEffect } from "react";
import AddData from "./AddData";
import Header from "./Header";
import "./Header.css";
import { useHistory } from "react-router-dom";

function Dashboard() {
  return (
    <>
      <Header />
      <AddData />;
    </>
  );
}

export default Dashboard;
