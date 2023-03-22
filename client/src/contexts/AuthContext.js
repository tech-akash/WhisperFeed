import { createContext, useState, useEffect } from "react";
import axios from "axios"
// import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
export const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  //  localStorage.getItem('authToken')?jwt_decode((JSON.parse(localStorage.getItem('authToken'))).access):null
  let [authToken, SetauthTokens] = useState(localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null)
  // const navigate = useNavigate();
  let [user, Setuser] = useState(localStorage.getItem('authToken') ? jwt_decode((JSON.parse(localStorage.getItem('authToken'))).access) : null)
  let [loading, Setloading] = useState(true)
  let [tweetDetail,SettweetDetail]=useState(null)
  let userLogin = async (e) => {
    e.preventDefault()

    console.log(e)
    let username = e.target.username.value
    let password = e.target.password.value
    let data = { username, password }
    
    // console.log(data);
    console.log("form submmitted")
    const response = await axios
      .post(`http://127.0.0.1:8000/token/`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      
      if (response.status === 200) {
        let data1 = await response.data;
      await SetauthTokens(data1)
      await Setuser(jwt_decode(data1.access))
      localStorage.setItem('authToken', JSON.stringify(data1))
      // return <Navigate to='/' />
    } else {
      alert('Something went Wrong! :(')
      // return <Navigate to='/signin' />
    }
    
  }
  let logout = () => {
    SetauthTokens(null)
    Setuser(null)
    localStorage.removeItem('authToken')
    // navigate("/");
  }
  let updateToken = async () => {
    console.log("Update Token")
    const response = await axios
      .post(`http://127.0.0.1:8000/token/refresh/`, { 'refresh': authToken.refresh }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    if (response.status === 200) {
      let data1 = await response.data;
      await SetauthTokens(data1)
      await Setuser(jwt_decode(data1.access))
      localStorage.setItem('authToken', JSON.stringify(data1))
    } else {
      logout()
    }
  }

  
    // const Detail_tweet=async (id)=>{
    //     try{

    //         const Response= await axios.get(`http://127.0.0.1:8000/detail/${id}/`,{
    //             headers:{
    //                 "Content-Type":"application/json",
    //                 "Authorization":"Bearer "+String(authToken.access)
    //             }
    //         })
    //         SettweetDetail(Response.data)
    //     }catch(e){
    //         console.log(e)
    //     }
    // }
  
  let contextData = {
    authToken: authToken,
    user: user,
    loginUser: userLogin,
    logout: logout,
    tweetDetail:tweetDetail,
    SettweetDetail:SettweetDetail
  }
  const fourmintues = 1000 * 60 * 4

  useEffect(() => {
    // console.log(authToken.refresh)
    let interval = setInterval(() => {
      console.log("hii")
      if (authToken) {
        updateToken()
      }
    }, 200000)
    return () => clearInterval(interval)

  }, [authToken, loading])
  return (
    <AuthContext.Provider
      value={contextData}
    >
    {children}
    </AuthContext.Provider>
  );


}


