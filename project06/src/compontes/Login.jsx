import React, {useState} from "react";
import { account, ID,  } from "../appwrite/config";
import './Login.css'
import { phota } from "../assets/phota";
import Uploader from "./Uploader";


const Login = () => {
    const [loggedInUser, setLoggedInUser] = useState(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    async function login(email, password) {
        await account.createEmailPasswordSession(email, password);
        setLoggedInUser(await account.get());
    }
    async function register(email, password, name) {
        await account.create(ID.unique(), email, password, name);
        login(email, password);
    }
    async function logout() {
        await account.deleteSession('current');
        setLoggedInUser(null)
    }
  // console.log(loggedInUser);

 
 
    

    return (
        <div>
       
            {
            loggedInUser ? 
            <div>
                <h2 className="text-xl font-bold text-white flex justify-center m-2
                ">
                    Wel come {loggedInUser.name}
                     </h2>
                <img src={phota.back} alt="this is background" />
                <div>
                <Uploader />
             
                </div>
                <button 
            type="button"
            onClick={() => logout()}
            >
                Logout
            </button>

            </div>
                
            
           
            : 
            <div class="main">  	
            <input type="checkbox" id="chk" aria-hidden="true"/>
    
                <div class="signup">
                    <form>
                        <label for="chk" aria-hidden="true">Sign up</label>
                        
                        <input type="email" 
            placeholder="enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            
            />
            <input type="password"
             placeholder="enter your password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
            />
            <input 
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                />
                        
                        <button
                         type="button"
                         onClick={() =>  register(email, password, name)} 
                        >Register</button>
                    </form>
                </div>
    
                <div class="login">
                    <form>
                        <label for="chk" aria-hidden="true">Login</label>
                        <input type="email" 
              placeholder="enter your email" 
                 value={email} 
                 onChange={(e) => setEmail(e.target.value)} 
            
            />
            <input type="password"
             placeholder="enter your password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
            />
                        <button
                         type="button"
                         onClick={() => login(email, password)}
                         >Login</button>
                    </form>
                </div>
        </div>
            }
           
                
        </div>
    );
};

export default Login