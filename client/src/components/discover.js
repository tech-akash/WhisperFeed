import React,{useState,useEffect, useContext} from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Form, Container,Col,Row,Button } from 'react-bootstrap'
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios";
import NavBar from "./NavBar";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FilledInput from '@mui/material/FilledInput';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import pic from "../user-icon.png";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import { useRoutes,useNavigate } from "react-router-dom";
export default function Discover(){
    const [data,setData]=useState(null)
    const [search,setSearch]=useState(null)
    const [values,setValues]=useState('')
    const {authToken,logout}=useContext(AuthContext)
    const navigate = useNavigate();
    let ind=0;
    let searchResult=new Map();
    async function getdata() {
        try {
    
          let response = await axios.get(`http://127.0.0.1:8000/discover/`, {
            headers: {
              'Content-Type': 'application/json',
              "Authorization": "Bearer " + String(authToken.access)
            }
          })
        //   console.log("GetData Called!")
        console.log(response.data['allTags'])
          setData(response.data['allTags'].sort())
          setSearch(response.data['allTags'].slice(0,5).sort())

        } catch (e) {
          if(e.response.status==401){
            logout()
          }
          console.log(e.response.status)
          
          
            alert(e.message)
          
        }
      }
      function handleChange(e){
        // console.log(e.target.value);
        let str=e.target.value;
        let arr=[]
        for(let i=ind;i<data.length;i++){
            if(data[i].length>=str.length){
              let str1=data[i].substring(0, str.length)
              if(str1==str){
                arr.push(data[i]);
              }
            }
            else{
              if(arr.length>0){
                break;

              }else{
                ind++;
              }
            }
            if(arr.length==5){
              break;
            }
        }
        setSearch(arr)
        setValues(e.target.value)
      }
      function handleClick(value){
        navigate(`/hashtag/${value}`)
      }
      useEffect(()=>{
        getdata();
      },[])
    return (
      <Container className="App">
      

      <Row>
        <Col>
          <NavBar/>
        </Col>
        <Col xs={6}>
          <h3 >Discover!</h3>
          <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Search</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            value={values}
            onChange={handleChange}
            startAdornment={<InputAdornment position="start"><SearchIcon/></InputAdornment>}
            label="Amount"
          />
        </FormControl>
        <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {search&&search.map((value) => {
        const labelId = `checkbox-list-secondary-label-${value}`;
        return (
          <ListItem
            key={value}
            disablePadding
          >
            <ListItemButton onClick={()=>handleClick(value)}>
              <ListItemText id={labelId} primary={value} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
        
          
        </Col>
        <Col>3 of 3</Col>
      </Row>

    </Container>
    )
}