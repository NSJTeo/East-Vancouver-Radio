import React, { useState, useEffect } from "react";
import axios from "axios";

export default function SetupInfo() {
  const [files, setFiles] = useState(null);
  useEffect(() => {
    const token = sessionStorage.getItem("login");
    axios
      .get("http://localhost:8081/system-information", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFiles(response.data);
      });
  }, []);
  return (
    <>
      {files && (
        <div>
          Files:
          {files.map((file) => (
            <p key={file}>{file}</p>
          ))}
        </div>
      )}
    </>
  );
}
