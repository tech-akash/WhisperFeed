import "./profile.scss";
import axios from "axios";
import React, { useState, useContext, useEffect } from "react";
import NavBar from "../components/NavBar";
import { AuthContext } from "../contexts/AuthContext";
// useParams
import Comment from "./comment";
import Retweet from "./retweet";
import Tweet from "./tweet";
import {
    Col,
    Row,Tabs,Tab,Button
} from 'react-bootstrap'
import { useParams } from "react-router-dom";
// import Tweet from "../components/Tweet";
import SingleTweet from "../components/singleTweet";
import '../style.scss'
import pic from "../user-icon.png";
import { ApiContext } from "../contexts/ApiContent";
function Profile() {
    const { id } = useParams()
    const { authToken,user } = useContext(AuthContext)
    const {getdata,following}=useContext(ApiContext)
    const [data, Setdata] = useState()
    const { content, setContent } = useState()
    const [value, setValue] = React.useState("one");
    const handleChange = (event, newValue) => {
        var element1 = document.getElementById("one");
        var element2 = document.getElementById("two");
        var element3 = document.getElementById("three");
        if (!element1.classList.contains("mystyle")) {
          element1.classList.toggle("mystyle");
        }
        if (!element2.classList.contains("mystyle")) {
          element2.classList.toggle("mystyle");
        }
        if (!element3.classList.contains("mystyle")) {
          element3.classList.toggle("mystyle");
        }
        var element = document.getElementById(newValue);
        element.classList.toggle("mystyle");
        setValue(newValue);
      };
    async function getData() {
        try {

            const Response = await axios.get(`http://127.0.0.1:8000/profile/${id}/`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + String(authToken.access)
                }
            })
            console.log(Response.data)
            Setdata(Response.data)

        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        getData()
    }, [])
    async function toggleFollower() {
      try {
            let data1=data['username']
          const Response = await axios.post(`http://127.0.0.1:8000/toggleFollower/`,{data1}, {
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

    if (data) {
        console.log(data['0'])
    }

    return (
        <Row>
        <Col>
          <NavBar/>
        </Col>
        <Col xs={6}>
            {data && <div>
                <div className="profile">
        {/* <Sidebar /> */}
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={'https://images.unsplash.com/photo-1530305408560-82d13781b33a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1352&q=80'}

                alt=""
              />
              {data['profileImg']? <img
                className="profileUserImg"
                src={`http://127.0.0.1:8000${data['profileImg']}/`}
                alt=""
              />:<img className="profileUserImg" src={pic}/>}
             
            </div>

            <div style={{ height: "20px" }}></div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{data['username']}</h4>
              <span className="profileInfoDesc">This is my discription for you to read</span>
              {user&&following&&user['username']!=data['username']&&<Button variant="outline-primary" size="lg" onClick={toggleFollower}>{following.has(data['username'])?<>UnFollow</>:<>Follow</>}</Button>}
              {user&&user['username']==data['username']&&<Button variant="outline-primary" size="lg">Edit Profile</Button>}
            </div>
            <div>
            </div>
            
          </div>
          <div>
           
  <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="m-3 justify-content-center" >
  <Tab eventKey="home" title="My Post">
  {data['ownTweet'] && data['ownTweet'].map(({ image, content, id, likes,username,parent,is_retweet,is_reply,index }) => (
              <div>
              

             {!parent&&<Tweet image={image} data={data['ownTweet']} content={content} id={id} likes={likes} username={username} parent={parent} is_reply={is_reply} is_retweet={is_retweet}/>}
              
                
             {parent&&is_retweet&&<Retweet data={data['ownTweet']} image={image} content={content} id={id} likes={likes} username={username} parent={parent} is_reply={is_reply} is_retweet={is_retweet}/>}
              
             {parent&&is_reply&&<Comment data={data['ownTweet']} image={image} content={content} id={id} likes={likes} username={username} parent={parent} is_reply={is_reply} is_retweet={is_retweet}/>}
                
              
              </div>

            ))}
  </Tab>
  <Tab eventKey="profile" title="Liked Post">
  {data['likedTweet'] && data['likedTweet'].map(({ image, content, id, likes,username,parent,is_retweet,is_reply,index }) => (
              <div>
              
            
             {!parent&&<Tweet image={image} data={data['likedTweet']} content={content} id={id} likes={likes} username={username} parent={parent} is_reply={is_reply} is_retweet={is_retweet}/>}
              
                
             {parent&&is_retweet&&<Retweet data={data['likedTweet']} image={image} content={content} id={id} likes={likes} username={username} parent={parent} is_reply={is_reply} is_retweet={is_retweet}/>}
              
             {parent&&is_reply&&<Comment data={data['likedTweet']} image={image} content={content} id={id} likes={likes} username={username} parent={parent} is_reply={is_reply} is_retweet={is_retweet}/>}
                
              
              </div>

            ))}
  </Tab>
  <Tab eventKey="contact" title="About Me" >
    byeee
  </Tab>
</Tabs>
          </div>
          
          <div className="profileRightBottom">
          </div>
        </div>
      </div>
            </div>}
        
        </Col>
        <Col>
            
        </Col>
        </Row>
    );
}

// export default TweetDetail
export default Profile