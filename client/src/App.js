import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Container, Row, Col, Card, InputGroup, FormControl, Button } from 'react-bootstrap';

import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [interactions, setInteractions] = useState([]);
  const [socketid, setSocketid] = useState('');
  let socket;
  
  useEffect(() => {
    const socketInstance = io('http://localhost:3030');
    socket = socketInstance;
    
    return () => {
      socket.disconnect();
    }
  }, [])

  useEffect(() => {
    if (socket.id) {
      console.log(socket.id);
      localStorage.setItem('socketid', socket);
    }
  })

  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} alt="logo" className="App-logo" />
        <h1>React WebChat</h1>
      </div>
      <div className="App-container">
        <Container>
          <Row className="mt-3">
            <Col md={5}>
              <Card body>This is some text within a card body.</Card>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={{ span: 5, offset: 7 }}>
              <Card bg="info" body>This is some text within a card body.</Card>
            </Col>    
          </Row>
          <Row className="mt-3">
            <Col md={{ span: 5, offset: 7 }}>
              <Card bg="info" body>This is some text within a card body.</Card>
            </Col>    
          </Row>
        </Container>
      </div>
      <div className="App-footer">
        <Container fluid>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Write your message here"
              aria-label="Write your message here"
              aria-describedby="basic-addon2"
            />
            <InputGroup.Append>
              <Button>Send</Button>
            </InputGroup.Append>
          </InputGroup>
        </Container>
      </div>
    </div>
  );
}

export default App;
