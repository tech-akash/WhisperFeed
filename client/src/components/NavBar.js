import { Link} from "react-router-dom";
import { Form, 
    Container,
     Col,
      Row,
       Card, Nav, Navbar, ButtonGroup,Modal,Button } from 'react-bootstrap'
       import { AuthContext } from '../contexts/AuthContext';
import { useContext } from "react";

function NavBar(){
    const { user } = useContext(AuthContext)
    return(<div className='vertical-nav'>
    <Nav defaultActiveKey="/home" className="flex-column">
      <Navbar.Brand style={{ fontSize: "30px", margin: "10px" }}>My Tweet</Navbar.Brand>
      <Nav.Item style={{ fontSize: "30px", margin: "10px" }}><Link style={{ textDecoration: "none" }} to="/"><i class="bi bi-house"></i> Home</Link> </Nav.Item>
      <Nav.Item eventKey="disabled" style={{ fontSize: "30px", margin: "10px",display:"block" }}>
        <span><i class="bi bi-chat-left-text"></i> Messages</span>
      </Nav.Item>
      <Nav.Item eventKey="disabled" style={{ fontSize: "30px", margin: "10px" }}>
        <i class="bi bi-person"></i> {user?<Link style={{ textDecoration: "none" }} to ={`/profile/${user['username']}`}>Profile </Link>:<Link style={{ textDecoration: "none" }} to={'/profile/notLogin'}>Profile</Link>}
      </Nav.Item>
      <Nav.Item eventKey="link-1" style={{ fontSize: "30px", margin: "10px" }}>{user ? <Link style={{ textDecoration: "none" }} to="/logout" ><i class="bi bi-box-arrow-left"></i> Logout</Link> : <Link style={{ textDecoration: "none" }} to="/signin"><i class="bi bi-box-arrow-in-right"></i> Login</Link>} </Nav.Item>
      <Nav.Item eventKey="link-2" style={{ fontSize: "30px", margin: "10px" }}><Link style={{ textDecoration: "none" }} to="/discover"><i class="bi bi-search"></i> Discover</Link></Nav.Item>
    </Nav>

  </div>);
}

export default NavBar