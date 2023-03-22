import React,{useState,useEffect,createContext,useContext} from "react"
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useRoutes,useNavigate } from "react-router-dom";

export const ApiContext=createContext();

export const ApiContextProvider=({children})=>{
    // const navigate = useNavigate();
    const {user,authToken,logout}=useContext(AuthContext)
    let [data,setData]=useState(null)
    let [following,setFollower]=useState(null);
    // let map = new Map({foo: 'bar'});
    async function getdata() {
        try {
    
          let response = await axios.get(`http://127.0.0.1:8000/`, {
            headers: {
              'Content-Type': 'application/json',
              "Authorization": "Bearer " + String(authToken.access)
            }
          })
          console.log("GetData Called!")
          setData(response.data['data'])
          const objectToMap = obj => {
            const keys = Object.keys(obj);
            const map = new Map();
            for(let i = 0; i < keys.length; i++){
               //inserting new key value pair inside map
               map.set(keys[i], obj[keys[i]]);
            };
            return map;
         };
          // map=new Map(response.data['following'])
          console.log(response.data['following'])
          setFollower(response.data['following'])
          // console.log(following['tag'])

        } catch (e) {
          if(e.response.status==401){
            logout()
          }
          console.log(e.response.status)
          
          
            alert(e.message)
          
        }
      }
    useEffect(()=>{
        getdata()
    },[])
    let contextData = {
        data:data,
        getdata:getdata,
        following:following,
        // setFollower:setFollower
    }
    if(following){
      contextData[data]=data;
      contextData[following]=following
      // console.log(following)
    }
    return (
        <ApiContext.Provider value={contextData}>
        
            {children}
        </ApiContext.Provider>
    )
}
