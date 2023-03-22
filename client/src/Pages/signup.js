import React from "react";
import {useState,useEffect} from "react";
import axios from "axios"
import {Form,Container,Col,Row,Card,Button} from 'react-bootstrap'

function SignUp(){
    const [username,setUsername]=useState("")
    const [email,setEmail]=useState("")
    const [password1,setPassword1]=useState("")
    const [password2,setPassword2]=useState("")

    function handleSubmit(e){
        // let productimg=URL.createObjectURL(imgUrl)
        e.preventDefault()
      let data={username,email,password1,password2}
      console.log(data);
      const myNewModel =  axios
        .post(`http://127.0.0.1:8000/createuser/`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then((res) => {
        //   getdata();
        //   setImage(null);
        //   setContent("");
            return res;
        }).catch((error) => {
            return error.response;
        });
    }

    return (
        <Form>
  <Form.Group className="mb-3" controlId="formBasicEmail">
    <Form.Label>Username</Form.Label>
    <Form.Control type="text" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Enter a Unique Username" />
    
  </Form.Group>
  <Form.Group className="mb-3" controlId="formBasicEmail">
    <Form.Label>Username</Form.Label>
    <Form.Control type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter a Your Email" />
  </Form.Group>
  <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Password</Form.Label>
    <Form.Control type="password" value={password1} onChange={(e)=>setPassword1(e.target.value)} placeholder="Password" />
  </Form.Group>
  <Form.Group className="mb-3" controlId="formBasicPassword">
    <Form.Label>Conffirm Password</Form.Label>
    <Form.Control type="password" value={password2} onChange={(e)=>setPassword2(e.target.value)} placeholder="Password" />
  </Form.Group>
  
  <Button variant="primary" onClick={(e)=>handleSubmit(e)}>
    Submit
  </Button>
</Form>
    );
}

export default SignUp