import React, { useState,useContext } from "react";
import { Card, ButtonGroup,Button } from 'react-bootstrap'
import { Link} from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { ApiContext } from "../contexts/ApiContent";
import axios from "axios";

function Retweet(props) {
    const { authToken } = useContext(AuthContext)
    const [modalShow, setModalShow] = useState(false);
    const [clickObjId, setclickObjId] = useState(null);
    const {getdata}=useContext(ApiContext)
    async function handleLike(id) {
        try {

            let response = await axios.get(`http://127.0.0.1:8000/like/${id}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authToken.access)
                }
            })
            getdata()
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
            getdata()
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

                    <Link to={`/detail/${props.id}` }style={{textDecoration:"none",color:"black"}}>
                <Card.Body>
                    <span style={{ color: "grey" }}>Retweeted by <Link to={`/profile/${props.username}`}>{props.username}</Link> </span>
                    <Card.Title><Link to={`/profile/${props.parent['username']}`}>{props.parent['username']}</Link></Card.Title>
                    {props.parent['content'] && <Card.Text>
                        {props.parent['content']}
                    </Card.Text>}
                </Card.Body>
                    </Link>
                <ButtonGroup aria-label="Basic example" className='btn-grp' >
                    <Button className='btn tweetbtn like' onClick={() => handleLike(props.id)}>{props.likes} <i class="bi bi-heart"></i></Button>
                    <Button className='btn tweetbtn retweet' onClick={() => handleretweet(props.id)}><i class="bi bi-arrow-repeat"></i></Button>
                    {/* <Button className='btn tweetbtn reply' onClick={() => { handlereply(props.id) }}><i class="bi bi-reply"></i></Button> */}
                    <Button className='btn tweetbtn share' ><i class="bi bi-share"></i></Button>
                </ButtonGroup>
            </Card>
            
            
        </div>
    );
}

export default Retweet;