import React, { useEffect } from "react";
import axios from "axios"
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useRoutes,useNavigate } from "react-router-dom";
import { ApiContext } from "../contexts/ApiContent";
function LogOut() {
  const { logout, authToken } = useContext(AuthContext)
  const navigate = useNavigate();
  const {getdata}=useContext(ApiContext)
  useEffect(()=>{
    logout()
    getdata();
    navigate("/signin");
  })
  return (
    <div>user is now logged Out</div>
  );
}
export default LogOut;