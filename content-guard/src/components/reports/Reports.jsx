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
              <Row className='mb-3'>
                <text>Report5</text>
              </Row>
              <Row className='mb-3'>
                <text>Report4</text>
              </Row>
              <Row className='mb-3'>
                <text>Report3</text>
              </Row>
              <Row className='mb-3'>
                <text>Report2</text>
              </Row>
              <Row className='mb-3'>
                <text>Report1</text>
              </Row>
            </Container>
          ))}
      </div>
    </div>
  );
}

export default Login;
