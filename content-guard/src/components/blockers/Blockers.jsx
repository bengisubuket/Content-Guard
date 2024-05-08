import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ArrowLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';


function BlockersComponent() {
    const navigate = useNavigate();

    const navigateBack = () => {
        navigate('/');
    };

    const navigateToKeywordBlocker = () => {
        navigate('/blockers/keyword-blocker');
    };

    const navigateToCategoryBlocker = () => {
        navigate('/blockers/category-blocker');
    };

    const navigateTimer = () => {
        navigate('/blockers/timer');
    };

    return (
        <div>
            <Container>
                <Row className='mb-3'>
                    <Col>
                        <Image src="guardian.png" roundedCircle style={{ width: '100px', height: '100px', margin: '0 auto' }} />
                    </Col>
                    <Col style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ fontSize: '24px' }}>Blockers</div>
                    </Col>
                </Row>
                <Row className='mb-3'>
                    <Button onClick={navigateToKeywordBlocker}>Keyword Blocker</Button>
                </Row>
                <Row className='mb-3'>
                    <Button onClick={navigateToCategoryBlocker}>Category Blocker</Button>
                </Row>
                {/*<Row className='mb-3'>
                    <Button onClick={navigateTimer}>Timer</Button>
                </Row>*/}
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
        </div>
    );
}

export default BlockersComponent;
