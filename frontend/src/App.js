import React, { useState } from "react";
import axios from "axios";
import FileUpload from "./FileUpload";
import ModelViewer from "./ModelViewer";
import { ToastContainer, toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const API_BASE_URL = "http://localhost:5120";

const App = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false); // Track if files have been fetched

  // Fetch files when "View Files" is clicked
  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/files`);
      setFiles(response.data.files || []);
      setFetched(true); // Mark that files have been fetched
    } catch (error) {
      toast.error("Failed to load files.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file deletion
  const handleDelete = async (filename) => {
    try {
      await axios.delete(`${API_BASE_URL}/models/${filename}`);
      setFiles((prevFiles) => prevFiles.filter((file) => file !== filename));
      toast.success("File deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete file.");
    }
  };

  return (
    <div className="container">
      {selectedFile ? (
        <div className="full-screen">
          <ModelViewer
            filename={selectedFile}
            onBack={() => setSelectedFile(null)}
          />
        </div>
      ) : (
        <>
          <h1 className="title">3D CAD Viewer - SAMBOY</h1>
          <FileUpload fetchFiles={fetchFiles} />

          {/* "View Files" Button */}
          <div className="button-container">
            <button
              className="view-btn"
              onClick={fetchFiles}
              disabled={loading}
            >
              {loading ? "Loading..." : "View Files"}
            </button>
          </div>

          {/* File List */}
          <div className="file-list-container">
            {files.length > 0 ? (
              <ul className="file-list">
                {files.map((file) => (
                  <li key={file} className="file-item">
                    <button
                      className="file-btn"
                      onClick={() => setSelectedFile(file)}
                    >
                      {file}
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(file)}
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              fetched &&
              !loading && (
                <p className="no-files">
                  No files available. Upload some files to view.
                </p>
              )
            )}
          </div>
        </>
      )}
      <ToastContainer />
      <footer className="footer">
        <p>
          Developed by <strong>Sameer Shaik</strong> | Email:{" "}
          <a href="mailto:sameer_s@srmap.edu.in">sameer_s@srmap.edu.in</a>
        </p>
      </footer>
    </div>
  );
};

export default App;
