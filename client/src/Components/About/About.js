import React from "react";
import AboutHeader from "../AboutHeader/AboutHeader";
import Draggable from "react-draggable";

export default function About(props) {
  const { aboutOn, handleAboutIconClick, activeWindow, setAboutToActive } =
    props;
  return (
    <Draggable
      allowAnyClick={false}
      bounds="parent"
      handle=".about-header__grabbable"
    >
      <div
        className={`about__container ${
          aboutOn ? "" : "about__container--hidden"
        } ${"about" === activeWindow ? "active" : ""}`}
        onMouseDownCapture={() => setAboutToActive()}
      >
        <AboutHeader handleAboutIconClick={handleAboutIconClick} />
        <div className="about__main">
          <p>Welcome to my website!</p>
          <p>
            This is my Capstone project for the BrainStation Web Development
            program. You can follow me on{" "}
            <a href="https://soundcloud.com/teo-mattress">SoundCloud</a> or
            reach me at my <a href="mailto:n.teomacdonald@gmail.com">email.</a>{" "}
            Thank you for visiting and listening. Have a good day.
          </p>
          <p>- Nicholas M</p>
        </div>
      </div>
    </Draggable>
  );
}
