import React, { useState, createRef } from "react";
import Draggable from "react-draggable";
import closeIcon from "../../assets/icons/close-icon.png";
import axios from "axios";
import SetupInfo from "../SetupInfo/SetupInfo";

export default function Setup(props) {
  const { setupOn, handleSetupIconClick, activeWindow, setSetupToActive } =
    props;
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const formRef = createRef();
  const handleLogin = () => {
    const loginInfo = {
      username: formRef.current.username.value,
      password: formRef.current.password.value,
    };
    console.log(loginInfo);
    axios.post("http://localhost:8081/login", loginInfo).then((response) => {
      console.log(response);
      if (response.data.error) {
        setError(response.data.error);
        formRef.current.reset();
        return;
      }
      sessionStorage.setItem("login", response.data.token);
      formRef.current.reset();
      setError("");
      setLoggedIn(true);
    });
  };
  return (
    <Draggable
      allowAnyClick={false}
      bounds="parent"
      handle=".setup__header-grabbable"
    >
      <div
        className={`setup__container ${
          setupOn ? "" : "setup__container--hidden"
        } ${"setup" === activeWindow ? "active" : ""}`}
        onMouseDownCapture={() => setSetupToActive()}
      >
        <div className="setup__header">
          <p className="setup__header-title">Setup</p>
          <div className="setup__header-grabbable"></div>
          <button className="setup__close-button">
            <img src={closeIcon} onClick={() => handleSetupIconClick()} />
          </button>
        </div>
        {loggedIn ? (
          <SetupInfo />
        ) : (
          <>
            <form ref={formRef}>
              <div>
                <label>Username</label>
                <input className="setup__login-input" name="username" />
              </div>
              <div>
                <label>Password</label>
                <input
                  className="setup__login-input"
                  type="password"
                  name="password"
                />
              </div>
              <button
                className="setup__button"
                type="button"
                onClick={handleLogin}
              >
                Login
              </button>
            </form>
            {error && <p>{error}</p>}
          </>
        )}
      </div>
    </Draggable>
  );
}
