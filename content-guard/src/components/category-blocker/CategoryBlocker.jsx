import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ArrowLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';

function CategoryBlockerComponent() {

    const categories = ["Technology", "Fashion", "Travel", "Music", "Movies", "Food", "Sports", "Science", "Health", "Politics", "Business", "Gaming", "Books", "Art", "Photography", "Fitness", "Education", "Environment", "Celebrities", "News", "Weather", "Humor", "SelfCare", "Relationships", "Pets", "Parenting", "TechnologyTrends", "Space", "Motivation", "SocialJustice"];

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
                        <div style={{ fontSize: '24px' }}>Category Blocker</div>
                    </Col>
                </Row>
                <Row className='mb-3 text-left'>
                    <div style={{ fontSize: '16px' }}>Choose a category</div>
                </Row>
                <Row className='mb-3'>
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic" style={{ width: '100%' }}>
                            Categories
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{ width: '100%' }}>
                            {categories.map((category, index) => (
                                <Dropdown.Item key={index}>{category}</Dropdown.Item>
                            ))}
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
        </div>
    );
}

export default CategoryBlockerComponent;
