import React, { useCallback, useEffect, useState } from 'react';
import { Button, Container, Row, Col, Form, Dropdown, Image } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

function CategoryBlockerComponent() {
    const categoryNames = ["Technology", "Fashion", "Travel", "Music", "Movies", "Food", "Sports", "Science", "Health", "Politics", "Business", "Gaming", "Books", "Art", "Photography", "Fitness", "Education", "Environment", "Celebrities", "News", "Weather", "Humor", "SelfCare", "Relationships", "Pets", "Parenting", "TechnologyTrends", "Space", "Motivation", "SocialJustice"];
    const [activeCategory, setActiveCategory] = useState(null); // Track which category timer settings are open
    const [userSettings, setUserSettings] = useState({
        username: "uname",
        id: 492,
        categories: categoryNames.map(cat => ({ name: cat, enabled: false, timer: { enabled: false, duration: 0, action: 'allow', remainingTime: 0 } })),
    });
    const [timerEnabled, setTimerEnabled] = useState(false);
    const [timerDuration, setTimerDuration] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [timerAction, setTimerAction] = useState('allow');
    const [showDropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();

    const navigateBack = () => {
        navigate('/blockers');
    };

    useEffect(() => {
        function loadSettings() {
            chrome.storage.local.get('userSettings', (data) => {
                if (data.userSettings) {
                    if(data.userSettings.categories.length === 0){
                        data.userSettings.categories = categoryNames.map(cat => ({ name: cat, enabled: false, timer: { enabled: false, duration: 0, action: 'allow', remainingTime: 0 } }));
                    }
                    setUserSettings(data.userSettings);
                } else {
                    const initialSettings = {
                        username: "uname",
                        id: 492,
                        categories: categoryNames.map(cat => ({ name: cat, enabled: false, timer: { enabled: false, duration: 0, action: 'allow', remainingTime: 0 } })),
                    };
                    setUserSettings(initialSettings);
                    //saveSettings(initialSettings);
                }
            });
        }

        loadSettings();
        const listener = (request, sender, sendResponse) => {
            if (request.categoriesList) {
                setUserSettings(prevSettings => ({ ...prevSettings, categories: request.categoriesList }));
                sendResponse({ status: 'categories received' });
            }
            return true;
        };

        chrome.runtime.onMessage.addListener(listener);
        return () => chrome.runtime.onMessage.removeListener(listener);
    }, []);

    const handleToggleCategory = (category) => {
        const updatedCategories = userSettings.categories.map(cat => {
            if (cat.name === category) {
                return { ...cat, enabled: !cat.enabled };
            }
            return cat;
        });

        const updatedSettings = { ...userSettings, categories: updatedCategories };
        setUserSettings(updatedSettings);

        // Send the updated categories list to the background script
        chrome.runtime.sendMessage({ action: "updateCategories", data: updatedSettings.categories }, (response) => {
            console.log("Response from background script:", response);
        });
    };

    const handleToggle = (isOpen, event) => {
        if (event.source == "click")
            setShowDropdown(isOpen);
    };

    const handleUpdateTimerSettings = (category) => {
        const duration = (timerDuration.hours * 3600 + timerDuration.minutes * 60 + timerDuration.seconds) * 1000;
        const updatedCategories = userSettings.categories.map(cat => {
            if (cat.name === category) {
                return { ...cat, timer: { enabled: timerEnabled, duration: duration, action: timerAction, remainingTime: duration } };
            }
            return cat;
        });

        const updatedSettings = { ...userSettings, categories: updatedCategories };
        setUserSettings(updatedSettings);
        setActiveCategory(null);

        // Send the updated categories list to the background script
        chrome.runtime.sendMessage({ action: "updateCategories", data: updatedSettings.categories }, (response) => {
            console.log("Response from background script:", response);
        });
    };

    const handleTimerButtonClick = (category) => {
        setActiveCategory(activeCategory === category ? null : category);
    };

    const handleTimerEnabledToggle = (category) => {
        const updatedCategories = userSettings.categories.map(cat => {
            if (cat.name === category) {
                setTimerEnabled(!cat.timer.enabled);
                return { ...cat, timer: { ...cat.timer, enabled: !cat.timer.enabled } };
            }
            return cat;
        });

        const updatedSettings = { ...userSettings, categories: updatedCategories };
        setUserSettings(updatedSettings);
        //saveSettings(updatedSettings);
    };

    const handleTimeChange = (e) => {
        const { name, value } = e.target;
        setTimerDuration({...timerDuration, [name]: Number(value)});
    };

    return (
        <Container className='p-4'>
            <Row className='mb-4'>
                <Col xs={2} className='d-flex justify-content-center align-items-center'>
                    <Image src="guardian.png" roundedCircle style={{ width: '100px', height: '100px' }} />
                </Col>
                <Col xs={10} className='d-flex align-items-center'>
                    <h2>Category Blocker</h2>
                </Col>
            </Row>
    
            {/* List of enabled categories */}
            <Row className='mb-4'>
                <Col>
                    <h4>Blocked Categories:</h4>
                    {userSettings.categories.filter(cat => cat.enabled).length > 0 ? (
                        userSettings.categories.filter(cat => cat.enabled).map((cat) => (
                            <div key={cat.name} className="mb-2 p-2 bg-light rounded border d-flex justify-content-between align-items-center">
                                <span>{cat.name}</span>
                                <Form.Check
                                    type="switch"
                                    id={`switch-${cat.name}`}
                                    checked={cat.enabled}
                                    onChange={() => handleToggleCategory(cat.name)}
                                    label=""
                                />
                            </div>
                        ))
                    ) : (
                        <p>No categories enabled.</p>
                    )}
                </Col>
            </Row>
    
            {/* Dropdown menu with switches and timer settings */}
            <Row className='mb-4'>
                <Col>
                <Dropdown show={showDropdown} onToggle={handleToggle}>
                    <Dropdown.Toggle id="dropdown-custom-components">
                        Categories
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {userSettings.categories.map((cat) => (
                            <Dropdown.Item key={cat.name} as="div" className="d-flex justify-content-between align-items-center">
                                <Container fluid>
                                <Row style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                                    <Col style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
                                        <span>{cat.name}</span>
                                    </Col>
                                    {cat.enabled && (
                                        <Col style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleTimerButtonClick(cat.name)}
                                            >
                                                {activeCategory === cat.name ? 'Close Timer' : 'Set Timer'}
                                            </Button>
                                        </Col>
                                    )}
                                    <Col style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Form.Check
                                            type="switch"
                                            id={`switch-${cat.name}`}
                                            checked={cat.enabled}
                                            onChange={() => handleToggleCategory(cat.name)}
                                            label=""
                                        />
                                    </Col>
                                </Row>
                                {cat.enabled && activeCategory === cat.name && (
                                <Row>
                                    <div>
                                        <Form.Check
                                            type="switch"
                                            id={`timer-switch-${cat.name}`}
                                            checked={cat.timer.enabled}
                                            onChange={() => handleTimerEnabledToggle(cat.name)}
                                            label="Timer Enabled"
                                        />
                                            <div>
                                                <Form.Group controlId="formTimerDuration">
                                                    <Form.Label>Duration:</Form.Label>
                                                    <Row>
                                                        <Col>
                                                            <Form.Control type="number" name="hours" value={timerDuration.hours} onChange={handleTimeChange} placeholder="HH" />
                                                        </Col>
                                                        <Col>
                                                            <Form.Control type="number" name="minutes" value={timerDuration.minutes} onChange={handleTimeChange} placeholder="MM" />
                                                        </Col>
                                                        <Col>
                                                            <Form.Control type="number" name="seconds" value={timerDuration.seconds} onChange={handleTimeChange} placeholder="SS" />
                                                        </Col>
                                                    </Row>
                                                        </Form.Group>                                               
                                                <Form.Check
                                                    type="radio"
                                                    id={`allow-action-${cat.name}`}
                                                    checked={timerAction === 'allow'}
                                                    onChange={() => setTimerAction('allow')}
                                                    label="Allow"
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    id={`block-action-${cat.name}`}
                                                    checked={timerAction === 'block'}
                                                    onChange={() => setTimerAction('block')}
                                                    label="Block"
                                                />
                                                <Button onClick={() => handleUpdateTimerSettings(cat.name)}>Save Timer Settings</Button>
                                            </div>
                                    </div>
                                    
                                </Row>)}
                                </Container>
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                </Col>
            </Row>
    
            {/* Navigation Button */}
            <Row>
                <Col>
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
            </Row>
        </Container>
    );
}

export default CategoryBlockerComponent;