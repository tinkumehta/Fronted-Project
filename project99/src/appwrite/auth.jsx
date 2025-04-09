import {Account, Client, ID, Storage} from 'appwrite'
import config from './configer';

const client = new Client();
    client
    .setEndpoint(config.appwriteUrl)
    .setProject(config.appwriteProjectId)

const account = new Account(client);

export const storage = new Storage(client);

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
       return await get();
    } catch (error) {
        console.log("login user error", error)
    }
}

async function get() {
    try {
       return await account.get();
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

// ========== verify active session
const checkAuth = async () => {
    try {
        return await account.get();
    } catch (error) {
        window.location.href = '/login';
    throw error;
    }
}

export {
    register,
    login,
    logout,
    get,
   checkAuth
}