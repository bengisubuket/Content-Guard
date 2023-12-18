import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ArrowLeft, Flag, Clock } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';

function TimerComponent() {
    const navigate = useNavigate();

    const navigateBack = () => {
        navigate('/blockers');
    };

    return (
        <div>
            <Container>
                <Row className='mb-3'>
                    <Col>
                        <Image src="guardian.png" roundedCircle style={{ width: '100px', height: '100px', margin: '0 auto' }} />
                    </Col>
                    <Col style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ fontSize: '24px' }}>Timer</div>
                    </Col>
                </Row>
                <Row className='mb-3'>
                    <Col className="text-start" xs={1}>
                        <Flag></Flag>
                    </Col>
                    <Col className="text-start">
                        <div style={{ fontSize: '16px' }}>Start after</div>
                    </Col>
                    <Col className="text-end">
                        <Form.Control type="number"/>
                    </Col>
                </Row>
                <Row className='mb-3'>
                    <Col className="text-start" xs={1}>
                        <Clock></Clock>
                    </Col>
                    <Col className="text-start">
                        <div style={{ fontSize: '16px' }}>Duration</div>
                    </Col>
                    <Col className="text-end">
                        <Form.Control type="number"/>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-start">
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
                    </Col>
                    <Col className="text-end">
                        <Button onClick={navigateBack}>Apply</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default TimerComponent;
