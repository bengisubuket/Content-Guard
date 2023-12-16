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
      <h3>Welcome</h3>
      <div className='lists'>
        {lists &&
          lists.map((item, index) => (
            <Container key={index}>
              <Row className='mb-3'>
                <Image src="guardian.png" roundedCircle/>
              </Row>
              <Row className='mb-3'>
                <Button onClick={navigateToExtension}>I already have an account</Button>
              </Row>
              <Row className='mb-3'>
              <Button className='button'>
                    I want to create an account
                  </Button>
              </Row>
            </Container>
          ))}
      </div>
    </div>
  );
}

export default Login;
