import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import { ArrowLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

function CategoryBlockerComponent() {

    const categories = ["Technology", "Fashion", "Travel", "Music", "Movies", "Food", "Sports", "Science", "Health", "Politics", "Business", "Gaming", "Books", "Art", "Photography", "Fitness", "Education", "Environment", "Celebrities", "News", "Weather", "Humor", "SelfCare", "Relationships", "Pets", "Parenting", "TechnologyTrends", "Space", "Motivation", "SocialJustice"];

    const navigate = useNavigate();

    const navigateBack = () => {
        navigate('/blockers');
    };

    // Initialize the enabledCategories state as an object with keys from categories and false as default value
    const [enabledCategories, setEnabledCategories] = useState(
        categories.reduce((status, category) => ({ ...status, [category]: false }), {})
    );

    // Function to handle the toggle of a category
    const handleToggleCategory = (category) => {
        setEnabledCategories(prevEnabledCategories => ({
            ...prevEnabledCategories,
            [category]: !prevEnabledCategories[category]
        }));
    };

    // Function to get a list of enabled categories to display
    const getEnabledCategoriesList = () => {
        return Object.entries(enabledCategories)
            .filter(([, isEnabled]) => isEnabled)
            .map(([category]) => category);
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
                    <div style={{ fontSize: '16px' }}>
                        {getEnabledCategoriesList().length > 0 ? 'Blocked Categories:' : 'No categories selected to block.'}
                        {getEnabledCategoriesList().map((category) => (
                            <div key={category}>{category}</div>
                        ))}
                    </div>
                </Row>
                <Row className='mb-3'>
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic" style={{ width: '100%' }}>
                            Categories
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{ width: '100%' }}>
                        {categories.map((category) => (
                            <Dropdown.Item key={category} as="div" className="d-flex justify-content-between align-items-center">
                            {category}
                            <Form.Check
                                type="switch"
                                id={`switch-${category}`}
                                checked={enabledCategories[category]}
                                onChange={() => handleToggleCategory(category)}
                                label=""
                                className="ml-auto" // adds margin to the left of the switch, pushing it to the right
                            />
                            </Dropdown.Item>
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
