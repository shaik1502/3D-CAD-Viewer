import React, { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./FileUpload.css";

const API_BASE_URL = "http://localhost:5120";

const FileUpload = ({ fetchFiles }) => {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("File uploaded successfully!");
      fetchFiles();
    } catch (error) {
      toast.error("File upload failed.");
    }
  };

  return (
    <div
      className={`drag-drop-area ${dragging ? "dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <p>Drag & Drop or Click to Upload</p>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUpload;
