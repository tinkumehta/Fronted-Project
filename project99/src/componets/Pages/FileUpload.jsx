import { useState } from 'react';
import { ID } from 'appwrite';
import { checkAuth, storage } from '../../appwrite/auth';
import config from '../../appwrite/configer';


function FileUpload() {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (file) => {
       try {
        await checkAuth();

        const response = await storage.createFile(
            config.appwriteStorageId,
            ID.unique(),
            file
        );

       // console.log('Upload successful:', response);
        return response;
        
       } catch (error) {
        console.error('Upload failed:', error);
        throw error;
       }
    };

    const handleUpload =  async (file) => {
        try {
            return await handleFileUpload(file);
        } catch (error) {
            if (error.code === 401) {
                // Force logout and redirect
                await account.deleteSession('current');
                window.location.href = '/login';
              }
              throw error;
        }
    }

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    try {
      const response = await handleUpload(file);
    //  console.log(response + "url");
      
      const previewUrl = storage.getFilePreview(
        config.appwriteStorageId,
        response.$id
      );
   
      setPreviewUrl(previewUrl)
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  
  
    return (
      <>
        <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>

      </form>
       <div className="photo-grid">
               <img
                   src={file}
                   alt="this is image"
                   className="photo-thumbnail"
               />
   </div>
   </>
    );
}

export default FileUpload