import React,{useState,useContext} from "react"
import { Card, ButtonGroup,Button } from 'react-bootstrap'
import { Link} from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import MyVerticallyCenteredModal from '../components/modal';
import '../style.scss'
import pic from "../user-icon.png";
function ThreadComments(props){
    const { authToken } = useContext(AuthContext)
    
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
        } catch (e) {
            console.log(e)
        }
    }
    function handlereply(id) {
        setclickObjId(id);
        setModalShow(true);
        
    }
    console.log(props.value)
    return <div className="comments">
     <h3 className="comments-title">Replies</h3>
        {props.value && props.value.map(({ content, id, likes,username,children,parent,timeStamp }) => (
            <div >
           
                <div className="comment" >
                    <div className="comment-image-container">
                        <img src={pic}></img>
                    </div>
                    <div className="comment-right-part">
                        <div className="comment-content">
                            <div className="comment-author">{username}</div>
                            

                        </div>
                        <div className="comment-text">
                            {content}
                <ButtonGroup aria-label="Basic example" style={{paddingLeft:"10%",paddingRight:"10%",width:"100%"}} >
                    <Button className='btn tweetbtn like' onClick={() => handleLike(id)}>{likes} <i class="bi bi-heart"></i></Button>
                    <Button className='btn tweetbtn retweet' onClick={() => handleretweet(id)}><i class="bi bi-arrow-repeat"></i></Button>
                    <Button className='btn tweetbtn reply' onClick={() => { handlereply(id) }}><i class="bi bi-reply"></i></Button>
                    <Button className='btn tweetbtn share' ><i class="bi bi-share"></i></Button>
            </ButtonGroup>
                        </div>
                    </div>
                   
                </div>
            

            
            {children&& children.map(({ content, id, likes,username,parent }) => (
                <div className="replies">
                <div className="comments">
                <div className="comment">
                    <div className="comment-image-container">
                        <img src={pic}></img>
                    </div>
                    <div className="comment-right-part">
                        <div className="comment-content">
                            <div className="comment-author">{username}</div>
                            <div>{timeStamp}</div>

                        </div>
                        <div className="comment-text">
                            {content}
                    <ButtonGroup aria-label="Basic example" style={{paddingLeft:"15%",paddingRight:"15%",width:"100%"}} >
                    <Button className='btn tweetbtn like' onClick={() => handleLike(id)}>{likes} <i class="bi bi-heart"></i></Button>
                    {/* <Button className='btn tweetbtn retweet' onClick={() => handleretweet(props.id)}><i class="bi bi-arrow-repeat"></i></Button>
                    <Button className='btn tweetbtn reply' onClick={() => { handlereply(props.id) }}><i class="bi bi-reply"></i></Button> */}
                    <Button className='btn tweetbtn share' ><i class="bi bi-share"></i></Button>
                    </ButtonGroup>
                        </div>
                    </div>
                    
                    </div>
                </div>

                
                </div>
            ))}
                
            
            </div>
        ))}
        {clickObjId && <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                data={props.data}
                id={clickObjId}
            />}
    </div>
}

export default ThreadComments
