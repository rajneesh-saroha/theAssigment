import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Table from "./Table";
import "./Header.css";
import { useHistory } from "react-router-dom";

function AddData() {
  const history = useHistory();

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [identityImage, setIdentityImage] = useState("");
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    if (sessionStorage.getItem("accessToken")) {
      fetch("http://localhost:4000/getData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + sessionStorage.getItem("accessToken"),
        },
      }).then((res) => {
        if (res.status == 201) {
          res.json().then((response) => {
            sessionStorage.setItem("accessToken", response.accessToken);

            response.data && setTableData(response.data);
          });
        } else if (res.status == 403) {
          sessionStorage.removeItem("accessToken");

          history.replace("/adminLogin");
        }
      });
    }
  }, []);
  const addUser = (e) => {
    e.preventDefault();
    fetch("http://localhost:4000/addData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + sessionStorage.getItem("accessToken"),
      },
      body: JSON.stringify({
        fullName: name,
        email: email,
        identityImg: identityImage,
      }),
    }).then((res) => {
      if (res.status == 201) {
        res.json().then((response) => {
          sessionStorage.setItem("accessToken", response.accessToken);

          response.data && setTableData((prev) => [...prev, response.data]);
        });
      } else if (res.status == 403) {
        sessionStorage.removeItem("accessToken");

        history.replace("/adminLogin");
      } else {
        alert("Sorry, data not added");
      }
    });
  };

  const change = (e) => {
    if (e.target.id === "raised-button-file") {
      if (e.target.files[0] == undefined) {
        //    setImageError("error")
      }
      if (e.target.files[0]) {
        const file = e.target.files[0];
        const fileName = file.name;

        var idxDot = fileName.lastIndexOf(".") + 1;
        var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
        if (!(extFile == "jpg" || extFile == "jpeg" || extFile == "png")) {
          alert("Only jpg/jpeg and png files are allowed!");
          e.target.value = "";
          //   setImageError("error")
        } else if (file.size > 3145728) {
          alert("Image size greater than 3mb not allowed!");
          e.target.value = "";
          //   setImageError("error")
        } else {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            setIdentityImage(reader.result);
          };
        }
      }
    }
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setNameError(
          value.match(/^([a-zA-Z]+(([.][a-zA-Z ])?[a-zA-Z]*)){3,}/)
            ? ""
            : "Name should be min 3 characters long"
        );
        setName(value);
        break;

      case "email":
        setEmailError(
          value.match(
            /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
          )
            ? ""
            : "Invalid Email Address"
        );
        setEmail(value);
        break;
    }
  };
  return (
    <div className="dashboard_container">
      <div className="table">
        <Table tableData={tableData} />
      </div>
      <div className="form">
        <CardContent>
          <form autoCapitalize="off" onSubmit={(e) => addUser(e)}>
            <TextField
              id="name"
              label="Enter your Name"
              name="name"
              fullWidth
              type="text"
              size="small"
              variant="outlined"
              error={nameError}
              helperText={nameError}
              autoFocus
              required
              onChange={(e) => change(e)}
              inputProps={{ style: { fontSize: 12 } }}
              style={{
                marginBottom: 15,
                width: "80%",
                borderRadius: "1px",
              }}
            />
            <TextField
              id="email"
              label="Enter your email"
              name="email"
              fullWidth
              size="small"
              variant="outlined"
              type="email"
              error={emailError}
              helperText={emailError}
              required
              onChange={(e) => change(e)}
              inputProps={{ style: { fontSize: 12 } }}
              style={{
                marginBottom: 15,
                width: "80%",
                borderRadius: "1px",
              }}
            />
            <input
              accept=".jpg,.jpeg,.png"
              id="raised-button-file"
              name="ProfilePicture"
              style={{ float: "left" }}
              helperText="Image size greater than 3mb not allowed."
              type="file"
              // required
              onChange={(e) => {
                change(e);
              }}
            />
            <br />
            <Button
              variant="contained"
              // style={button_style}
              type="submit"
              color="primary"
              disabled={nameError || emailError || !name || !email}
            >
              Add User
            </Button>
          </form>
        </CardContent>
      </div>
    </div>
  );
}

export default AddData;
