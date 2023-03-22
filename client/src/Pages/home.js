import React, { useEffect } from 'react';
import { Form, Container,Col,Row,Button } from 'react-bootstrap'
import { useState, useContext } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import NavBar from '../components/NavBar';
import '../style.scss'
import Comment from '../components/comment';
import Retweet from '../components/retweet';
import Tweet from '../components/tweet';
import { AuthContext } from '../contexts/AuthContext';
import { ApiContext } from '../contexts/ApiContent';
function Home() {
  const navigate = useNavigate();
  const [content, setContent] = useState("")
  const [image, setImage] = useState(null)
  const { user, authToken, logout,SettweetDetail } = useContext(AuthContext)
  const {data,getdata}=useContext(ApiContext);
  
  function handleimg(e) {
    console.log(e.target.files[0])
    setImage(e.target.files[0]);
  }
  function handleSubmit(e) {
    e.preventDefault()
    let data = { content, image }
    console.log(data);
    const myNewModel = axios
      .post(`http://127.0.0.1:8000/createtweet/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': 'Bearer ' + String(authToken.access)
        },
      }).then((res) => {
        getdata();
        setImage(null);
        setContent("");
        return res;
      }).catch((error) => {
        return error.response;
      });
  }

  
  if (data) {
    console.log(data)
  }
  // if(!user){
  //   console.log("hey")
  //   navigate("/signin")
  // }
  useEffect(()=>{
    if(!user){

      navigate("/signin")
    }
  },[])
  return (
    <Container className="App">

      <Row>
        <Col>
          <NavBar/>
        </Col>
        <Col xs={6}>
          <h3 >Home</h3>
          {/* {user && <h5>{user.username}</h5>} */}
          {user && <Form style={{ width: "100%", margin: "10px" }}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Tweet Content</Form.Label>
              <Form.Control as="textarea" rows="3" placeholder="Type here ....." value={content} onChange={(e) => setContent(e.target.value)}>

              </Form.Control>

            </Form.Group>


            <Form.Group className="mb-3" controlId="formBasicfile">
              <Form.Label>Insert Image</Form.Label>
              <Form.Control type="file" accept="image/jpeg,image/png,image/gif" onChange={(e) => handleimg(e)} />
            </Form.Group>
            <Button variant="primary" className='btn' type="submit" onClick={(e) => handleSubmit(e)}>
              Tweet
            </Button>
          </Form>}



          <div>

            {data && data.map(({ image, content, id, likes,username,parent,is_retweet,is_reply,index }) => (
              <div>
              

             {!parent&&<Tweet image={image} data={data} content={content} id={id} likes={likes} username={username} parent={parent} is_reply={is_reply} is_retweet={is_retweet}/>}
              
                
             {parent&&is_retweet&&<Retweet data={data} image={image} content={content} id={id} likes={likes} username={username} parent={parent} is_reply={is_reply} is_retweet={is_retweet}/>}
              
             {parent&&is_reply&&<Comment data={data} image={image} content={content} id={id} likes={likes} username={username} parent={parent} is_reply={is_reply} is_retweet={is_retweet}/>}
                
              
              </div>

            ))}
                    
          </div>
        </Col>
        <Col>3 of 3</Col>
      </Row>

    </Container>

  );
}

export default Home;
