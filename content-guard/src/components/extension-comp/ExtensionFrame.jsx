import { useState } from 'react';
import './ExtensionFrame.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';

const data = [{
  name: "web pages",
  url: ["https://burakozturk01.github.io/contentguard.github.io/"]
}];

function ExtensionFrame() {
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
                <Button>Blockers</Button>
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
