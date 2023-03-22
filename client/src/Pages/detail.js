import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import NavBar from "../components/NavBar";
import { AuthContext } from "../contexts/AuthContext";
import {Col,Row,} from 'react-bootstrap'
import { useParams } from "react-router-dom";
import { Card, ButtonGroup, Button,Form } from 'react-bootstrap'
import { Link } from "react-router-dom";
import ThreadComments from "../components/ThreadComments";
import pic from "../user-icon.png";
import '../style.scss'

import Linkify from 'linkify-react';

import * as linkify from 'linkifyjs';
import hashtag from 'linkifyjs/plugins/hashtag';
// import axios from "axios";
function Detail() {
    const { id } = useParams()
    const { authToken } = useContext(AuthContext)
    // const {getdata}=useContext(ApiContext)
    const [data, Setdata] = useState()
    const [ content, setContent ] = useState()
    var linkifyOptions = 
    {
        formatHref: function (href, type) {
          if (type === 'hashtag') {
              
            href = '/hashtag/' + href.substring(1);
          }
          return href;
        }
      }
    async function getData() {
        try {

            const Response = await axios.get(`http://127.0.0.1:8000/detail/${id}/`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + String(authToken.access)
                }
            })
            // console.log(Response.data)
                Setdata(Response.data)
        } catch (e) {
            console.log(e)
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
            getData()
            getData();

            setContent(null)
        } catch (e) {
            console.log(e)
        }


        // console.log(content)


    }
    useEffect(() => {
        getData()
    }, [])

    if (data) {
        console.log(data)
    }
    async function handleLike(id){
        try {

            let response = await axios.get(`http://127.0.0.1:8000/like/${id}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authToken.access)
                }
            })
            getData()
            getData();
        } catch (e) {
            console.log(e)
        }
    }
    async function handleretweet(id){
        try {

            let response = await axios.post(`http://127.0.0.1:8000/retweet/${id}/`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authToken.access)
                }
            })
            getData()
            getData();
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Row>
            <Col>
                <NavBar />
            </Col>
            <Col xs={6}>
                <h3 >Tweet</h3>
                {data&&
                <div>
                <div className="comment blocks border" >

                <div className="comment-image-container">
                        <img src={pic}></img>
                        <div className="comment-author avg">{data['parent']['username']}</div>
                    </div>
                    <div className="comment-right-part">
                        <div className="comment-content " >
                           
                            

                        {data['parent']['image']&&<img style={{width:"100%",height:"100%"}}src={`http://127.0.0.1:8000${data['parent']['image']}`}/>}
                        </div>
                        <div className="comment-text big" >
                        <Linkify options={linkifyOptions}>{data['parent']['content']}</Linkify>
                            
                <ButtonGroup aria-label="Basic example" className="border"  style={{paddingLeft:"10%",paddingRight:"10%",width:"100%",display:"flex"}} >
                    <Button className='btn tweetbtn like' onClick={() => handleLike(data['parent']['id'])}>{data['parent']['likes']} <i class="bi bi-heart"></i></Button>
                    <Button className='btn tweetbtn retweet' onClick={() => handleretweet(data['parent']['id'])}><i class="bi bi-arrow-repeat"></i></Button>
                    {/* <Button className='btn tweetbtn reply' onClick={() => { handlereply(data['parent']['id']) }}><i class="bi bi-reply"></i></Button> */}
                    <Button className='btn tweetbtn share' ><i class="bi bi-share"></i></Button>
            </ButtonGroup>
                        </div>
                        </div>
                </div>
                </div>
                    
                
                }
                {data&& 
                
                <div className="border">
                    <Card.Body>

                    {/* <Card.Title>Reply</Card.Title> */}
                        <div>Replying to <Link to={`/profile/${data['parent']['username']}`} style={{textDecoration:"none"}}>@{data['parent']['username']}</Link> </div>
                        {/* <input value={content} onChange={(e) => setContent(e.target.value)}></input> */}
                        <Form.Group className="mb-3" controlId="formBasicEmail" >
                            
                            <Form.Control as="textarea" className="cmtform" style={{border:"none "}} rows="3" placeholder="Tweet Your Reply ....." value={content} onChange={(e) => setContent(e.target.value)}>
                            
                            </Form.Control>

                        </Form.Group>
                        <Button onClick={()=>handlereply(data['parent']['id'])}>Reply</Button>
                    </Card.Body>
                       
                    </div>
                }
                {data &&<ThreadComments value={data['comments']}/>}
                

            </Col>
            <Col>

            </Col>
        </Row>
    );
}

export default Detail