import React, { useState, useEffect, useContext } from "react";
import { Card, ButtonGroup,Button } from 'react-bootstrap'
import { Link} from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { ApiContext } from "../contexts/ApiContent";
import MyVerticallyCenteredModal from '../components/modal';
function Comment(props) {
    const { authToken } = useContext(AuthContext)
    const {getdata}=useContext(ApiContext)
    const [modalShow, setModalShow] = useState(false);
    const [clickObjId, setclickObjId] = useState(null);
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
            {props.parent && props.parent['is_reply'] && <Card>
                <Link to={`/detail/${props.id}` }style={{textDecoration:"none"}}>
                <Card.Body>

                    <Card.Title><Link to={`/profile/${props.username}`}>{props.username}</Link></Card.Title>
                    <span style={{ color: "grey" }}>Replying to <Link to={`/profile/${props.parent['username']}`}>{props.parent['username']}</Link></span>

                    {props.content && <Card.Text>
                        {props.content}
                    </Card.Text>}
                </Card.Body>
                </Link>
                <ButtonGroup aria-label="Basic example" className='btn-grp' >
                <Button className='btn tweetbtn like' onClick={() => handleLike(props.id)}>{props.likes} <i class="bi bi-heart"></i></Button>
                    <Button className='btn tweetbtn retweet' onClick={() => handleretweet(props.id)}><i class="bi bi-arrow-repeat"></i></Button>
                    {/* <Button className='btn tweetbtn reply' onClick={() => { handlereply(props.data['0']['parent']['id']) }}><i class="bi bi-reply"></i></Button> */}
                    <Button className='btn tweetbtn share' ><i class="bi bi-share"></i></Button>
                </ButtonGroup>
            </Card>}
            {props.parent && !props.parent['is_reply'] && <Card>
            <Link to={`/detail/${props.id}` } style={{textDecoration:"none",color:"black"}}>

                <Card.Body>
                    <Card.Title><Link to={`/profile/${props.username}`}>{props.username}</Link></Card.Title>
                    <span style={{ color: "grey" }}>Replying to <Link to={`/profile/${props.parent['username']}`}>{props.parent['username']}</Link></span>
                    {props.content && <Card.Text>
                        {props.content}
                    </Card.Text>}
                </Card.Body>
            </Link>
                <ButtonGroup aria-label="Basic example" className='btn-grp' >
                    <Button className='btn tweetbtn like' onClick={() => handleLike(props.id)}>{props.likes} <i class="bi bi-heart"></i></Button>
                    <Button className='btn tweetbtn retweet' onClick={() => handleretweet(props.id)}><i class="bi bi-arrow-repeat"></i></Button>
                    <Button className='btn tweetbtn reply' onClick={() => { handlereply(props.id) }}><i class="bi bi-reply"></i></Button>
                    <Button className='btn tweetbtn share' ><i class="bi bi-share"></i></Button>
                </ButtonGroup>
            </Card>}
            {clickObjId && <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                data={props.data}
                id={clickObjId}
            />}
        </div>
    );
}

export default Comment;