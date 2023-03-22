import React from 'react';
import { useState, useContext } from "react";
import { Form, Card, Modal, Button } from 'react-bootstrap'
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { ApiContext } from '../contexts/ApiContent';


function MyVerticallyCenteredModal(props) {
  const { authToken } = useContext(AuthContext)
  const { getdata } = useContext(ApiContext)
  var result;
  if (props.data && props.id) {
    result = props.data.filter(obj => {
      return obj.id === props.id
    })

    console.log(result['0']['id'])
  }
  const [content, setContent] = useState()

  async function handleClick() {
    try {
      let data = { content }
      console.log(data)
      const response = await axios.post(`http://127.0.0.1:8000/reply/${result['0']['id']}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': "Bearer " + String(authToken.access)
        }
      })
      getdata();
    } catch (e) {
      console.log(e)
    }
    props.onHide()

  }
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Reply
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {result && <Card style={{ width: "100%", margin: "10px" }} className='card'>
          <Card.Body>
            <Card.Title>{result['0']['user']}</Card.Title>
            {result['0']['content'] && <Card.Text>
              {result['0']['content']}
            </Card.Text>}
            <Form.Control style={{ border: "none" }} value={content} onChange={(e) => setContent(e.target.value)} as="textarea" placeholder="Tweet Your Reply" rows={3} autoFocus />

          </Card.Body>
        </Card>}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClick}>Reply</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MyVerticallyCenteredModal