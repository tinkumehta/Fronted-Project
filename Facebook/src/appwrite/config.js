import {Account, ID, Client, Databases, Storage, Query} from 'appwrite'
import conf from '../conf/conf'


 export class Service {
    client = new Client();
    database;
    bucket;

    constructor() {
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId)

        this.database = new Databases(this.client)
        this.bucket = new Storage(this.client)
    }

    async createPost({title, slug, content, featuredImage, status, userId}){
        try {
            return await this.database.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title, 
                    content,
                    featuredImage,
                    status,
                    userId,
                }
            )
        } catch (error) {
            throw error;
        }
    }

    async updatePost(slug, {title, content, featuredImage, status}){
        try {
            return await this.database.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status
                }
            )
        } catch (error) {
            throw error;
        }
    }

    async deletePost (slug) {
        try {
            await this.database.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
            return true
        } catch (error) {
            throw error
        }
    }

    async getPosts(queries =[Query.equal("status", "active")]){
        try {
            return await this.database.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            )
        } catch (error) {
            throw error;
        }
    }


    // ========== file upload service

    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteStorageId,
                ID.unique(),
                file
            )

        } catch (error) {
            throw error
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteStorageId,
                fileId
            )
            return true
        } catch (error) {
            throw error
        }
    }

    async getFilePreview (fileId) {
        return this.bucket.getFilePreview(
            conf.appwriteStorageId,
            fileId
        )
    }
 }

 const service = new Service()

 export default service