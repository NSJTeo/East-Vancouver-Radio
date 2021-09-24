import React from "react";
import axios from "axios";

export default function SetupFiles(props) {
  const { file, setFiles } = props;
  const handleDelete = () => {
    const token = sessionStorage.getItem("login");
    console.log("delete");
    axios
      .delete(`http://localhost:8081/system-information/${file}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setFiles(JSON.parse(response.data));
      });
  };
  return (
    <div className="setup-files__container">
      <p>{file}</p>
      <button className="setup-files__delete-button" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
}
