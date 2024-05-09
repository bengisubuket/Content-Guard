import { useState } from 'react';
import './ExtensionFrame.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';

const data = [{
  name: "web pages",
  url: ["http://localhost:3000/authentication/sign-in"]
}];

function ExtensionFrame () {
  const navigate = useNavigate();

  const navigateToBlockers = () => {
    navigate('/blockers');
  };

  const [lists, setList] = useState(data);

  const openTabs = (url) => {
    for (const link of url) {
      window.open(link, "_blank");
    }
  };

  return (
    <div className='App' style={{ width: '100%', textAlign: 'center' }}>
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
                <Button onClick={navigateToBlockers}>Blockers</Button>
              </Row>
              <Row className='mb-3'>
                <Button className='button' onClick={() => openTabs(item.url)}>
                  ContentGuard Home
                </Button>
              </Row>
            </Container>
          ))}
      </div>
    </div>
  );
}

export default ExtensionFrame;
