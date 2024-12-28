import React, { useState } from "react";
import { Client, Storage, ID } from "appwrite";
import conf from "../appwrite/conf";

const Uploader = () => {
  // Appwrite configuration
  const client = new Client()
    .setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteProjectId);

  const storage = new Storage(client);

  // State for tracking upload status and displaying image
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fileUrl, setFileUrl] = useState(""); // URL of the uploaded file

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSuccessMessage("");
    setErrorMessage("");
    setFileUrl(""); // Clear previous image URL
  };
  console.log(handleFileChange);
  

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    setUploading(true);

    try {
      const response = await storage.createFile(
        conf.appwriteBucketID, // Replace with your bucket ID
        ID.unique(),
        file
      );

      // Generate a public URL to view the uploaded file
      const viewUrl = client.endpoint + `/storage/buckets/675e8bae0030a28402d4/files/${response.$id}/view?project=675a982c001472432a72`;
      setFileUrl(viewUrl);

      setSuccessMessage("File uploaded successfully!");
      setFile(null);
    } catch (error) {
      setErrorMessage(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 
      className="text-xl m-2 text-yellow-300 flex justify-center">
        Appwrite File Uploader
        </h1>
      <input 
        type="file" 
        className="h-full" 
        onChange={handleFileChange}
         />
      <button 
        onClick={handleUpload} 
        disabled={uploading}
        className="rounded"
        >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {successMessage && <p className="text-green-600">{successMessage}</p>}
      {errorMessage && <p className="text-red-700">{errorMessage}</p>}

      {/* Display the uploaded image */}
      {fileUrl && (
        <div>
          <h2>Uploaded Image:</h2>
          <img src={fileUrl} alt="Uploaded File" style={{ maxWidth: "100%", height: "auto" }} />
        </div>
      )}
    </div>
  );
};

export default Uploader;
