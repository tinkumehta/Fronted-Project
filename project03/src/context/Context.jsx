import { createContext,  useState } from "react";
import runChat from "../config/gen";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [prevPrompts, setPrevPrompts] = useState([])
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("")

    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord);
        }, 75 *index)
    }

     const newChat = () => {
        setLoading(false)
        setShowResult(false)
     }

     const onSent = async (prompt) => {
        setResultData("")
        setLoading(true)
        setShowResult(true)

        let responses;
        if (prompt !== undefined) {
            responses = await runChat(prompt)
            setRecentPrompt(prompt)
        } else {
            setPrevPrompts(prev => [...prev, input])
            setRecentPrompt(input)
            responses = await runChat(input)
        }

        let responsesArray = responses.split("**");
        let newResponse ="";
        for(let i=0; i<responsesArray.length; i++){
            if(i ==0 || i%2 !==1) {
                newResponse += responsesArray[i];
            } else {
                newResponse += "<b>" + responsesArray[i] + "</b>";
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>")
        let newResponseArray = newResponse2.split(" ");
        for(let i=0; i<newResponseArray.length; i++){
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord+ " ")
        }

        setLoading(false)
        setInput("")
     }

     const contextValue = {
        prevPrompts, 
        setPrevPrompts,
        onSent, 
        setRecentPrompt, 
        recentPrompt,
        showResult, 
        loading,
        resultData,
        input,
        setInput,
        newChat
     }

     return (
        <Context.Provider value={contextValue} >
            {props.children}
        </Context.Provider>
     )
}

export default ContextProvider