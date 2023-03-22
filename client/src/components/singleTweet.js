
import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ApiContext } from "../contexts/ApiContent";
import {
    Form, Card, ButtonGroup, Button
} from 'react-bootstrap'
import '../style.scss'
import { Link, Navigate } from "react-router-dom";

import Linkify from 'linkify-react';

import * as linkify from 'linkifyjs';
import hashtag from 'linkifyjs/plugins/hashtag';
function SingleTweet(props) {
    const [content, setContent] = useState()
    const id = 0;
    const { authToken } = useContext(AuthContext)
    const{getdata}=useContext(ApiContext);
    var linkifyOptions = 
    {
        formatHref: function (href, type) {
          if (type === 'hashtag') {
            href = 'https://twitter.com/hashtag/' + href.substring(1);
          }
          return href;
        }
      }
    async function handleLike(tid) {
        console.log(id)
        try {
            let response = await axios.get(`http://127.0.0.1:8000/like/${tid}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authToken.access)
                }
            })
            getdata();

        } catch (e) {
            console.log(e)
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
            getdata();

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
            getdata();
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <div>
            {props.data &&
                <div>
                    < Card key={id} className='card'>
                        {props.data['0']['image'] && <Card.Img variant="top" src={`http://127.0.0.1:8000/${props.data['0']['parent']['image']}`} />}
                        {/* </Link> */}
                        <Card.Body>
                            <Card.Title>{props.data['0']['username']}</Card.Title>

                            {props.data['0']['content'] && <Card.Text>
                            <Linkify options={linkifyOptions}>{props.data['0']['content']}</Linkify>
                            </Card.Text>}
                        </Card.Body>

                        {/* <FaTwitter/> */}
                        <ButtonGroup aria-label="Basic example" className='btn-grp' >
                            <Button className='btn tweetbtn like' onClick={() => handleLike(props.data['0']['id'])}>{props.data['0']['likes']} <i class="bi bi-heart"></i></Button>
                            <Button className='btn tweetbtn retweet' onClick={() => handleretweet(props.data['0']['id'])}><i class="bi bi-arrow-repeat"></i></Button>
                            {/* <Button className='btn tweetbtn reply' onClick={() => { handlereply(props.data['0']['parent']['id']) }}><i class="bi bi-reply"></i></Button> */}
                            <Button className='btn tweetbtn share' ><i class="bi bi-share"></i></Button>
                        </ButtonGroup>
                    </Card>
                    <Card>
                        <Card.Body>
                            <div>Replying to {props.data['0']['username']}</div>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control as="textarea" rows="3" placeholder="Tweet Your Reply ....." value={content} onChange={(e) => setContent(e.target.value)}>
                                </Form.Control>
                            </Form.Group>
                            <Button onClick={() => handlereply(props.data['0']['id'])}>Reply</Button>
                        </Card.Body>
                    </Card>
                </div>}
        </div>
    );
}


export default SingleTweet