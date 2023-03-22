import React,{useState,useEffect,createContext,useContext} from "react"
import axios from "axios";
import { Form, Container,Col,Row,Button } from 'react-bootstrap'
import { useParams } from "react-router-dom";
import { AuthContext } from '../contexts/AuthContext';
import Comment from '../components/comment';
import Retweet from '../components/retweet';
import Tweet from '../components/tweet';
import NavBar from '../components/NavBar';
import '../style.scss'
import { ApiContext } from "../contexts/ApiContent";

function TagsTweetView(){
    let [data1,setData1]=useState(null)
    const { nameoftag } = useParams()
    const {getdata,following}=useContext(ApiContext)
    const { user, authToken, logout,SettweetDetail } = useContext(AuthContext)
    // console.log(`http://127.0.0.1:8000/hashtag/${nameoftag}/`)
    async function getdata1() {
        try {
    
          let response = await axios.get(`http://127.0.0.1:8000/hashtag/${nameoftag}/`, {
            headers: {
              'Content-Type': 'application/json',
              "Authorization": "Bearer " + String(authToken.access)
            }
          })
          console.log("Get nameoftag Called!")
          console.log(response.data['data'])
          setData1(response.data['data'])
          if(data1){
            console.log(data1)
          }

        } catch (e) {
          if(e.response.status==401){
            logout()
          }
          console.log(e.response.status)
            alert(e.message)
        }
    }
    useEffect(()=>{
        getdata1()
    },[])
    if(data1){
        console.log(data1)
    }
    async function toggleFollower() {
        try {
            // let data=data1['username']
            const Response = await axios.get(`http://127.0.0.1:8000/follow-hashtag/${nameoftag}/`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + String(authToken.access)
                }
            })
            getdata();
            console.log(Response.data)
            // Setdata(Response.data)
  
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <Container className="App">

      <Row>
      <Col>
          <NavBar/>
        </Col>
        <Col xs={6}>
        <h3 >Explore</h3>
        <div style={{ height: "20px" }}></div>
        <div>
        {user&&following&&<Button variant="outline-primary" size="lg" onClick={toggleFollower}>{following.includes(nameoftag)?<>UnFollow</>:<>Follow</>}</Button>}
        </div>
        <div>

{data1 && data1.map(({ image, content, id, likes,username,parent,is_retweet,is_reply,index }) => (
  <div>
  

 {!parent&&<Tweet image={image} data={data1} content={content} id={id} likes={likes} username={username} parent={parent} is_reply={is_reply} is_retweet={is_retweet}/>}
  
    
 {parent&&is_retweet&&<Retweet data={data1} image={image} content={content} id={id} likes={likes} username={username} parent={parent} is_reply={is_reply} is_retweet={is_retweet}/>}
  
 {parent&&is_reply&&<Comment data={data1} image={image} content={content} id={id} likes={likes} username={username} parent={parent} is_reply={is_reply} is_retweet={is_retweet}/>}
    
  
  </div>

))}
        
</div>
        </Col>
        <Col>
        Chating Comming Soon!
        </Col>
      </Row>
        
      </Container>
    )

}
export default TagsTweetView