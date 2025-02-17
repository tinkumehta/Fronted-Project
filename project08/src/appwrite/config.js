import {Client, Account, ID} from "appwrite"
import conf from "./conf";

const client = new Client()
    .setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteProjectId);
    

export const account = new Account(client);

export async function register(email, password, name) {
    try {
      const login =  await account.create(ID.unique(), email, password, name);
    //  console.log(login);
      if (login) {
        login(email, password)
      }
      
    } catch (error) {
        console.log(error);
        
    }
}

export async function login(email, password) {
    try {
        const log = await account.createEmailPasswordSession(email, password)
            if (log) {
                return await get();
            }
    } catch (error) {
        console.log(error);
        
    }
}

export async function logout() {
    try {
        await account.deleteSession('current');
        
    } catch (error) {
        console.log(error);
        
    }
}

export async function get() {
    try {
        await account.get();
    } catch (error) {
        console.log(error);
        
    }
}