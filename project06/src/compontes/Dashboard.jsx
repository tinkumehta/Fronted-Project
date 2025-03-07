import React, {useEffect, useState} from "react";
import {createDocument, deleteDocument, getDocuments, updateDocument, get} from '../appwrite/config'


function Dashboard() {
    
    const [documents, setDocuments] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [editDoc, setEditDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                await get();
                const { documents } = await getDocuments();
                setDocuments(documents);
            } catch (error) {
                console.log("A error for fetchData ", error);
                
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const newDoc = await createDocument(title, description);
            setDocuments(prev => [...prev, newDoc]);
            setTitle('');
            setDescription('');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updatedDoc = await updateDocument(editDoc.$id, editDoc.title, editDoc.description);
            setDocuments(documents.map(doc => 
                doc.$id === updatedDoc.$id ? updatedDoc : doc
            ));
            setEditDoc(null);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async (documentId) => {
        try {
            await deleteDocument(documentId);
            setDocuments(documents.filter(doc => doc.$id !== documentId));
        } catch (error) {
            setError(error.message);
        }
    };

        if(loading) return <div className="auth-container">Loading...</div>;

    return (
        <div className="auth-container">
            <div className="dashboard">
                <div className="dashboard-header">
                    <h1>My Documents</h1>
                    
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={editDoc ? handleUpdate : handleCreate} className="document-form">
                    <input
                        type="text"
                        placeholder="Title"
                        value={editDoc ? editDoc.title : title}
                        onChange={(e) => 
                            editDoc 
                                ? setEditDoc({...editDoc, title: e.target.value})
                                : setTitle(e.target.value)
                        }
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={editDoc ? editDoc.description : description}
                        onChange={(e) =>
                            editDoc
                                ? setEditDoc({...editDoc, description: e.target.value})
                                : setDescription(e.target.value)
                        }
                        required
                    />
                    <div className="form-actions">
                        <button type="submit" className="submit-btn">
                            {editDoc ? 'Update Document' : 'Create Document'}
                        </button>
                        {editDoc && (
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setEditDoc(null)}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                <div className="documents-list">
                    {documents.map((doc) => (
                        <div key={doc.$id} className="document-card">
                            <h3>{doc.title}</h3>
                            <p>{doc.description}</p>
                            <div className="document-actions">
                                <button
                                    className="edit-btn"
                                    onClick={() => setEditDoc(doc)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(doc.$id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;