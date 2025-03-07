import {Client, Account, ID, Databases, Permission, Query} from 'appwrite'
import conf from './conf';

export const client = new Client();

client
    .setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteProjectId);

export const account = new Account(client);
export const databases = new Databases(client);



export {ID} from 'appwrite'

export async function get() {
    try {
        return await account.get();
    } catch (error) {
        throw new Error('Not authenticated');
    }
}

export const createDocument = async (title, description) => {
    try {
        const user = await get();
        return await databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            ID.unique(),
            {
                userId: user.$id,
                title,
                description
            },
            [
                Permission.read(Permission.user(user.$id)),
                Permission.write(Permission.user(user.$id))
            ]
        );
    } catch (error) {
        throw new Error(error.message || 'Document creation failed');
    }
};

export const getDocuments = async () => {
    const user = await get();
    return databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal('userId', user.$id)]
    );
};

export const updateDocument = async (documentId, title, description) => {
    try {
        return await databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            documentId,
            { title, description }
        );
    } catch (error) {
        throw new Error(error.message || 'Update failed');
    }
};

export const deleteDocument = async (documentId) => {
    try {
        return await databases.deleteDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            documentId
        );
    } catch (error) {
        throw new Error(error.message || 'Deletion failed');
    }
};