
import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";

import {Form,Card, ButtonGroup, Button} from 'react-bootstrap'
import '../style.scss'
import { Link} from "react-router-dom";
import { ApiContext } from "../contexts/ApiContent";
function TweetDetails(props) {
    const [ content, setContent ] = useState()
    const id=0;
    const {authToken}=useContext(AuthContext)
    const {getdata}=useContext(ApiContext);
    async function handleLike(tid) {
        console.log(id)
        try {

            let response = await axios.get(`http://127.0.0.1:8000/like/${tid}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authToken.access)
                }
            })
            getdata()

            // setData(response.data)
        } catch (e) {
            console.log(e)
            // if(user &&e.response.status===401){
            //   logout()
            // }else if(user&&e.response.status<=500){
            //   alert(e.message)
            // }
        }
    }
    async function handleretweet(tid) {
        console.log(id)
        try {

            let response = await axios.post(`http://127.0.0.1:8000/retweet/${tid}/`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authToken.access)
                }
            })
            getdata()

            // setData(response.data)
        } catch (e) {
            console.log(e)
            // if(user &&e.response.status===401){
            //   logout()
            // }else if(user&&e.response.status<=500){
            //   alert(e.message)
            // }
        }
    }
    async function handlereply(tid) {
        try {
            let data = { content }
            console.log(data)
            const response = await axios.post(`http://127.0.0.1:8000/reply/${tid}/`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': "Bearer " + String(authToken.access)
                }
            })
            getdata()
        } catch (e) {
            console.log(e)
        }


        // console.log(content)


    }
    return (
        <div>
            {props.data &&
                <div>
                    < Card key={id} className='card'>
                        {props.data['0']['parent']['image'] && <Card.Img variant="top" src={`http://127.0.0.1:8000/${props.data['0']['parent']['image']}`} />}
                        {/* </Link> */}
                        <Card.Body>
                            <Card.Title>{props.data['0']['parent']['username']}</Card.Title>

                            {props.data['0']['parent']['content'] && <Card.Text>
                                {props.data['0']['parent']['content']}
                            </Card.Text>}
                        </Card.Body>

                        {/* <FaTwitter/> */}
                        <ButtonGroup aria-label="Basic example" className='btn-grp' >
                            <Button className='btn tweetbtn like' onClick={() => handleLike(props.data['0']['parent']['id'])}>{props.data['0']['parent']['likes']} <i class="bi bi-heart"></i></Button>
                            <Button className='btn tweetbtn retweet' onClick={() => handleretweet(props.data['0']['parent']['id'])}><i class="bi bi-arrow-repeat"></i></Button>
                            {/* <Button className='btn tweetbtn reply' onClick={() => { handlereply(props.data['0']['parent']['id']) }}><i class="bi bi-reply"></i></Button> */}
                            <Button className='btn tweetbtn share' ><i class="bi bi-share"></i></Button>
                        </ButtonGroup>
                    </Card>
                    <Card>
                    <Card.Body>

                    {/* <Card.Title>Reply</Card.Title> */}
                        <div>Replying to {props.data['0']['parent']['username']}</div>
                        {/* <input value={content} onChange={(e) => setContent(e.target.value)}></input> */}
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            
                            <Form.Control as="textarea" rows="3" placeholder="Tweet Your Reply ....." value={content} onChange={(e) => setContent(e.target.value)}>
                            
                            </Form.Control>

                        </Form.Group>
                        <Button onClick={()=>handlereply(props.data['0']['parent']['id'])}>Reply</Button>
                    </Card.Body>
                       
                    </Card>
                    {props.data && props.data.map(({ image, content, id, likes,user,parent,is_retweet,is_reply,index }) => (
              < Card key={id} style={{ width: "100%" }} className='card'>
                <Link to ={`/detail/${id}` } style={{textDecoration:"none", color:"black"}} > 
              {/* <Link to="/detail"> */}

                {image && <Card.Img variant="top" src={`http://127.0.0.1:8000/${image}`} />}
                {/* </Link> */}

                <Card.Body>
                
                  
                  <Card.Title>{user}</Card.Title>
                  {/* {is_reply&&<span style={{color:"grey"}}>Replying to {parent['username']}</span>} */}
                  

                  {content && <Card.Text>
                    {content}
                  </Card.Text>}
                  
                  </Card.Body>
                  {/* <FaTwitter/> */}
                </Link>
                  <ButtonGroup aria-label="Basic example"  className='btn-grp'>
                    <Button className='btn tweetbtn like'  onClick={() => handleLike(id)}>{likes} <i class="bi bi-heart"></i></Button>
                    <Button className=' btn tweetbtn retweet'  onClick={() => handleretweet(id)}><i class="bi bi-arrow-repeat"></i></Button>
                    <Button className='btn tweetbtn reply'   ><i class="bi bi-reply"></i></Button>
                    <Button className='btn tweetbtn share'><i class="bi bi-share"></i></Button>
                  </ButtonGroup>
              
                  
                  
                  
                    
                
              </Card>
              
            ))}



                </div>}


        </div>
    );
}


export default TweetDetails