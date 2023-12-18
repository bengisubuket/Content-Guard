import React from 'react';
import { Button, Container, Row, Col, Form, Dropdown, Image } from 'react-bootstrap';
import { PlusCircleFill } from 'react-bootstrap-icons';
import { ArrowLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

function KeywordBlockerComponent() {
  const navigate = useNavigate();

  const navigateBack = () => {
      navigate('/blockers');
  };

  return (
    <Container>
      <Row className='mb-3'>
          <Col>
              <Image src="guardian.png" roundedCircle style={{ width: '100px', height: '100px', margin: '0 auto' }} />
          </Col>
          <Col style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: '24px' }}>Keyword Blocker</div>
          </Col>
      </Row>
      <Row className='mb-3'>
          <Col xs={9}>
              <Form.Control type="text" placeholder="Enter keyword"/>
          </Col>
          <Col className="text-end">
              <Button>
                  <PlusCircleFill style={{ fontSize: '24px', color: 'blue' }} />
              </Button>
          </Col>
      </Row>
      <Row className='mb-3'>
          <Dropdown>
              <Dropdown.Toggle id="dropdown-basic" style={{ width: '100%' }}>
                  Keywords
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ width: '100%' }}>
                  <Dropdown.Item>keyword0</Dropdown.Item>
                  <Dropdown.Item>keyword1</Dropdown.Item>
                  <Dropdown.Item>keyword2</Dropdown.Item>
              </Dropdown.Menu>
          </Dropdown>
      </Row>
      <Row>
        <Button
            onClick={navigateBack}
            variant="primary"
            style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: 2,
            width: 'auto',
            }}
        >
            <ArrowLeft style={{ fontSize: '24px', color: 'blue' }} />
        </Button>
    </Row>
    </Container>
  );
}

export default KeywordBlockerComponent;
