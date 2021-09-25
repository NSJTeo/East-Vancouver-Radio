import React, { useState, useEffect } from "react";
import axios from "axios";
import SetupFiles from "../SetupFiles/SetupFiles";

export default function SetupInfo() {
  const [files, setFiles] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("login");
    axios
      .get("http://localhost:8081/system-information", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFiles(JSON.parse(response.data));
      });
  }, []);

  const handleInput = (event) => {
    setFileToUpload(event.target.files[0]);
  };

  const handleUpload = () => {
    const token = sessionStorage.getItem("login");
    const data = new FormData();
    data.append("file", fileToUpload);
    axios
      .post("http://localhost:8081/upload", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFiles(JSON.parse(response.data));
      });
  };

  return (
    <>
      {files && (
        <div>
          {files.map((file) => (
            <SetupFiles key={file} file={file} setFiles={setFiles} />
          ))}
        </div>
      )}
      <label for="file">Choose file to upload</label>
      <input
        name="file"
        type="file"
        accept="audio/mpeg"
        onChange={handleInput}
      />
      {fileToUpload && (
        <button type="button" onClick={handleUpload}>
          Upload
        </button>
      )}
    </>
  );
}
