import React, { useState, createRef } from "react";
import Draggable from "react-draggable";

import axios from "axios";
import SetupInfo from "../SetupInfo/SetupInfo";
import SetupHeader from "../SetupHeader/SetupHeader";

export default function Setup(props) {
  //
  const { setupOn, handleSetupIconClick, activeWindow, setSetupToActive } =
    props;
  //
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(false);
  //
  const formRef = createRef();
  //
  const handleLogin = () => {
    const loginInfo = {
      username: formRef.current.username.value,
      password: formRef.current.password.value,
    };
    axios
      .post("http://localhost:8080/login", loginInfo)
      .then((response) => {
        console.log("token: ", response.data.token);
        sessionStorage.setItem("login", response.data.token);
        formRef.current.reset();
        setError(false);
        setLoggedIn(true);
      })
      .catch((error) => {
        console.log(error);
        formRef.current.reset();
        setError(true);
        setLoggedIn(false);
      });
  };
  return (
    <Draggable
      allowAnyClick={false}
      bounds="parent"
      handle=".setup-header__grabbable"
    >
      <div
        className={`setup__container ${
          setupOn ? "" : "setup__container--hidden"
        } ${loggedIn ? "setup__logged-in" : ""} ${
          "setup" === activeWindow ? "active" : ""
        }`}
        onMouseDownCapture={() => setSetupToActive()}
      >
        <SetupHeader handleSetupIconClick={handleSetupIconClick} />
        {loggedIn ? (
          <SetupInfo />
        ) : (
          <>
            <form className="setup__form" ref={formRef}>
              <div className="setup__label-input-container">
                <label className="setup__login-label">Username</label>
                <input className="setup__login-input" name="username" />
              </div>
              <div className="setup__label-input-container">
                <label className="setup__login-label">Password</label>
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
            {error && <p>Try again.</p>}
          </>
        )}
      </div>
    </Draggable>
  );
}
