import {Account, Client, ID} from 'appwrite'
import config from './configer';

const client = new Client();
    client
    .setEndpoint(config.appwriteUrl)
    .setProject(config.appwriteProjectId)

const account = new Account(client);

async function register(email, password, name) {
   try {
     const userRegister = await account.create(
         ID.unique(), email, password, name)
         if (userRegister) {
            return await login(email, password)
         }
         
   } catch (error) {
    console.log("register error", error)
   }

}

async function login(email, password) {
    try {
        const loginUser = await account.createEmailPasswordSession(email, password)
        return loginUser
    } catch (error) {
        console.log("login user error", error)
    }
}

async function get() {
    try {
        await account.get();
    } catch (error) {
        console.log("get user error", error)
    }
}

async function logout() {
    try {
        await account.deleteSession('current')
    } catch (error) {
        
    }
}

export {
    register,
    login,
    logout,
    get,
    
}