import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Container, Row, Col, Card, InputGroup, FormControl, Button } from 'react-bootstrap';

import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [interactions, setInteractions] = useState([]);
  const [text, setText] = useState('');
  const [socket, setSocket] = useState(null);

  const sendMessage = (event) => {
    event.preventDefault();
    if (!text) {
      return;
    }

    socket.emit('message', text);
    setText('');
  }

  const handleChange = (event) => {
    setText(event.target.value);
  }
  
  const scrollToEnd = () => {
    const id = interactions.length - 1;
    const el = document.getElementById('' + id);
    const appContainer = document.getElementById("app-container");
    if (!!el) {
      appContainer.scrollTo(0, el.offsetTop);
    }
  }

  useEffect(() => {
    const socketInstance = io('http://localhost:3030');
    
    setSocket(socketInstance);
    
    socketInstance.on('message', (object) => {
      setInteractions(i => [...i, object]);
    })
    
    return () => {
      socket.disconnect();
    }
  }, [])

  useEffect(() => {
    scrollToEnd();
  }, [interactions.length])

  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} alt="logo" className="App-logo" />
        <h1>React WebChat</h1>
      </div>
      <div id="app-container" className="App-container">
        <Container>
          {
            interactions.map((item, index) => {
              if (item.type === 'text') {
                if (item.sender === socket.id) {
                  return (
                    <Row id={index} key={index} className="mt-3">
                      <Col md={{ span: 5, offset: 7 }}>
                        <Card bg="info">
                          <Card.Body>
                            <Card.Subtitle className="mb-2 text-muted">
                              {item.sender}
                            </Card.Subtitle>
                            <Card.Text>
                              {item.text}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>    
                    </Row>
                  )
                } else {
                  return (
                    <Row id={index} key={index} className="mt-3">
                      <Col md={5}>
                        <Card>
                          <Card.Body>
                            <Card.Subtitle className="mb-2 text-muted">
                              {item.sender}
                            </Card.Subtitle>
                            <Card.Text>
                              {item.text}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  )
                }
              }
              if (item.type === 'event') {
                return (
                  <Row id={index} key={index} className="justify-content-md-center mt-3">
                    <Card bg="secondary" text="white">
                      <Card.Text className="mx-3">
                        {item.user} {item.event}
                      </Card.Text>
                    </Card>
                  </Row>
                )
              }
            })
          }          
        </Container>
      </div>
      <div className="App-footer">
        <Container fluid>
          <form onSubmit={sendMessage}>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Write your message here"
                aria-label="Write your message here"
                aria-describedby="basic-addon2"
                value={text}
                onChange={handleChange}
              />
              <InputGroup.Append>
                <Button onClick={sendMessage}>Send</Button>
              </InputGroup.Append>
            </InputGroup>
          </form>
        </Container>
      </div>
    </div>
  );
}

export default App;
