import React, { useState, useEffect } from "react";
import axios from "axios";
import SetupFiles from "../SetupFiles/SetupFiles";

export default function SetupInfo() {
  const [files, setFiles] = useState([]);

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
  console.log("type", typeof files);
  return (
    <>
      {files && (
        // <div>
        //   Files:
        //   {files.map((file) => (
        //     <p key={file}>{file}</p>
        //   ))}
        // </div>
        <div>
          {files.map((file) => (
            <SetupFiles key={file} file={file} setFiles={setFiles} />
          ))}
        </div>
      )}
    </>
  );
}
