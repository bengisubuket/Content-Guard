import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';

const data = [{
  name: "web pages",
  url: ["https://burakozturk01.github.io/contentguard.github.io/"]
}];

function Login () {
  const navigate = useNavigate();

  const navigateToExtension = () => {
    navigate('/');
  };

  const [lists, setList] = useState(data);

  const openTabs = (url) => {
    for (const link of url) {
      window.open(link, "_blank");
    }
  };

  return (
    <div className='App'>
      <h2>ContentGuard</h2>
      <h3>Reports</h3>
      <div className='lists'>
        {lists &&
          lists.map((item, index) => (
            <Container key={index}>
              {console.log("hi")}
              <Row className='mb-3'>
                Report5
              </Row>
              <Row className='mb-3'>
                Report4
              </Row>
              <Row className='mb-3'>
                Report3
              </Row>
              <Row className='mb-3'>
                Report2
              </Row>
              <Row className='mb-3'>
                Report1
              </Row>
            </Container>
          ))}
      </div>
    </div>
  );
}

export default Login;
