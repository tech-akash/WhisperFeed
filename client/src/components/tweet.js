import React, { useState, useEffect, useContext } from "react";
import { Card, ButtonGroup, Button } from 'react-bootstrap'
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import MyVerticallyCenteredModal from '../components/modal';
import axios from "axios";
import pic from "../user-icon.png";
import { ApiContext } from "../contexts/ApiContent";

import Linkify from 'linkify-react';

import * as linkify from 'linkifyjs';
import hashtag from 'linkifyjs/plugins/hashtag';

function Tweet(props) {
    const { authToken } = useContext(AuthContext)
    const {getdata}=useContext(ApiContext)
    const [modalShow, setModalShow] = useState(false);
    const [clickObjId, setclickObjId] = useState(null);
    var data=null;
    var linkifyOptions = 
    {
        formatHref: function (href, type) {
          if (type === 'hashtag') {
            href = 'https://twitter.com/hashtag/' + href.substring(1);
          }
          return href;
        }
      }
    async function handleLike(id) {
        try {

            let response = await axios.get(`http://127.0.0.1:8000/like/${id}/`, {
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
    async function handleretweet(id) {
        try {

            let response = await axios.post(`http://127.0.0.1:8000/retweet/${id}/`, {}, {
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
    function handlereply(id) {
        setclickObjId(id);
        setModalShow(true);
        
    }

    return (
        <div>
            <Card>
            <Link to={`/detail/${props.id}` } style={{textDecoration:"none",color:"black"}}>
                {props.image && <Card.Img variant="top" src={`http://127.0.0.1:8000${props.image}`} />}
                <Card.Body>
                    <Card.Title><Link to={`/profile/${props.username}`}>{props.username}</Link></Card.Title>
                    {props.content && <Card.Text>
                        <Linkify options={linkifyOptions}>{props.content}</Linkify>
                    </Card.Text>}
                </Card.Body>
                </Link>
                <ButtonGroup aria-label="Basic example" className='btn-grp' >
                    <Button className='btn tweetbtn like' onClick={() => handleLike(props.id)}>{props.likes} <i class="bi bi-heart"></i></Button>
                    <Button className='btn tweetbtn retweet' onClick={() => handleretweet(props.id)}><i class="bi bi-arrow-repeat"></i></Button>
                    <Button className='btn tweetbtn reply' onClick={() => { handlereply(props.id) }}><i class="bi bi-reply"></i></Button>
                    <Button className='btn tweetbtn share' ><i class="bi bi-share"></i></Button>
                </ButtonGroup>
            </Card>
            {clickObjId && <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                data={props.data}
                id={clickObjId}
            />}

        </div>
    );
}

export default Tweet;