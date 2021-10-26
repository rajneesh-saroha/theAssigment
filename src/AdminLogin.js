import React, { useState } from "react";
import "./AdminLogin.css";
import Avatar from "@mui/material/Avatar";
import { useHistory } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function AdminLogin() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signIn = () => {
    fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        username: email,
      }),
    }).then((response) => {
      if (response.status == 201) {
        response.json().then((res) => {
          sessionStorage.setItem("accessToken", res.accessToken);
          history.replace("/dashboard");
        });
      } else {
        alert("invalid credentials");
        // setEmail("");
        // setPassword("");
      }
    });
  };

  return (
    <div className="login">
      <div className="login_logo">ADMIN LOGIN</div>

      <div className="login__container">
        <Avatar>
          <LockOutlinedIcon />
        </Avatar>
        <TextField
          label="E-mail"
          variant="outlined"
          style={{ marginBottom: 10, marginTop: 30 }}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <span></span>
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          style={{ marginBottom: 10 }}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Button
          variant="contained"
          style={{
            margin: "10px 0px",
            backgroundColor: "#f0c14b",
            color: "black",
            width: "100%",
          }}
          disabled={!(email && password)}
          onClick={signIn}
        >
          Sign in
        </Button>
      </div>
    </div>
  );
}
