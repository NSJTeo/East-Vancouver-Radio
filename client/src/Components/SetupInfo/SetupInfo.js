import React, { useState, useEffect, createRef } from "react";
import axios from "axios";
import SetupFiles from "../SetupFiles/SetupFiles";

export default function SetupInfo() {
  //
  const [files, setFiles] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null);
  //
  const uploadRef = createRef();
  //
  const handleInput = (event) => {
    setFileToUpload(event.target.files[0]);
  };
  const uploadFileForm = document.getElementById("upload-file-form");
  const handleUpload = () => {
    const token = sessionStorage.getItem("login");
    const data = new FormData();
    data.append("file", fileToUpload);
    axios
      .post("http://localhost:8080/upload", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFiles(JSON.parse(response.data));
        setFileToUpload(null);
        uploadFileForm.reset();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //
  useEffect(() => {
    const token = sessionStorage.getItem("login");
    axios
      .get("http://localhost:8080/system-information", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFiles(JSON.parse(response.data));
      });
  }, []);

  return (
    <>
      {files && (
        <div>
          {files.map((file) => (
            <SetupFiles key={file} file={file} setFiles={setFiles} />
          ))}
        </div>
      )}
      <form id="upload-file-form" className="setup-info__form">
        <label className="setup-info__form-label" htmlFor="file">
          Choose file to upload:
        </label>
        <input
          name="file"
          type="file"
          accept="audio/mpeg"
          onChange={handleInput}
          ref={uploadRef}
        />
        {fileToUpload && (
          <button
            className="setup-info__button"
            type="button"
            onClick={handleUpload}
          >
            Upload
          </button>
        )}
      </form>
    </>
  );
}
