import React, { useEffect, useState } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Container, Row, Col, Form, Dropdown, Image } from 'react-bootstrap';
import { PlusCircleFill, ArrowLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
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
    
    const [userSettings, setUserSettings] = useState({
        username: "uname",
        id: 493,
        categories: [],
        activeCategories: []
    });

    const navigate = useNavigate();

    const navigateBack = () => {
        navigate('/blockers');
    };

    // Initialize enabledCategories state based on activeCategories from userSettings
    const [enabledCategories, setEnabledCategories] = useState(() => {
        const initialCategories = categories.reduce((status, category) => ({
            ...status,
            [category]: userSettings.activeCategories.includes(category)
        }), {});
        return initialCategories;
    });

    useEffect(() => {
        function loadSettings() {
            chrome.storage.local.get('userSettings', (data) => {
                if (data.userSettings) {
                    setUserSettings(data.userSettings);
                    setEnabledCategories(
                        categories.reduce((status, category) => ({
                            ...status,
                            [category]: data.userSettings.activeCategories.includes(category)
                        }), {})
                    );
                } else {
                    const initialSettings = {
                        username: "uname",
                        id: 492,
                        categories: [],
                        activeCategories: []
                    };
                    setUserSettings(initialSettings);
                    saveSettings(initialSettings);
                }
            });
        }

        loadSettings();
        const listener = (request, sender, sendResponse) => {
            if (request.categoriesList) {
                setEnabledCategories(request.categoriesList);
                sendResponse({ status: 'categories received' });
            }
            return true;
        };

        chrome.runtime.onMessage.addListener(listener);
        return () => chrome.runtime.onMessage.removeListener(listener);
    }, []);

    function saveSettings(settings) {
        chrome.storage.local.set({ 'userSettings': settings }, () => {
            console.log('User settings saved:', settings);
        });
    }

    // Handle the toggle of a category
    const handleToggleCategory = (category) => {
        setEnabledCategories(prevEnabledCategories => ({
            ...prevEnabledCategories,
            [category]: !prevEnabledCategories[category]
        }));

        const updatedCategories = !enabledCategories[category]
            ? [...userSettings.activeCategories, category]
            : userSettings.activeCategories.filter((activeCategory) => activeCategory !== category);

        const updatedSettings = { ...userSettings, activeCategories: updatedCategories };
        setUserSettings(updatedSettings);
        saveSettings(updatedSettings);

        // Send the updated categories list to the background script
        chrome.runtime.sendMessage({ action: "updateCategories", data: updatedSettings.categories }, (response) => {
            console.log("Response from content script:", response);
        });
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
