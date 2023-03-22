import React from "react";
import {useState,useEffect,useContext } from "react";
import axios from "axios"
import {Form,Container,Col,Row,Card,Button} from 'react-bootstrap'
// import { LoginContext } from "../contexts/AuthContext";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ApiContext } from "../contexts/ApiContent";


function Signin(){
    
    // console.log(Auth)
    
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const {loginUser,user}=useContext(AuthContext)
    const {getdata}=useContext(ApiContext)
    const navigate = useNavigate(ApiContext);
    if(user){
      getdata();
      navigate('/')
    }
    return (
        
      
        <Form onSubmit={loginUser}>
  <Form.Group className="mb-3" controlId="formBasicEmail">
    <Form.Label>Username</Form.Label>
    <Form.Control type="text" name="username" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Enter a Unique Username" />
    
  </Form.Group>
  
  <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" />
  </Form.Group>
  
  
  <Button variant="primary" type="submit">
    Submit
  </Button>
</Form>
    
    );
}

export default Signin