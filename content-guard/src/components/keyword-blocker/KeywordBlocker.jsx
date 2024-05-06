import React, { useCallback, useEffect, useState } from 'react';
import { Button, Container, Row, Col, Form, Dropdown, Image } from 'react-bootstrap';
import { PlusCircleFill, ArrowLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

// Converts HH:MM time format to milliseconds
function timeToMilliseconds(time) {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return (hours * 3600000) + (minutes * 60000) + (seconds * 1000);
}

function KeywordBlockerComponent() {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [keywordsList, setKeywordsList] = useState();
    const [userSettings, setUserSettings] = useState({
        username: "uname",
        id: 493,
        keywords: []
    });
    const [timerEnabled, setTimerEnabled] = useState(false);
    const [timerDuration, setTimerDuration] = useState('');
    const [timerAction, setTimerAction] = useState('allow');

    const navigateBack = () => {
        navigate('/blockers');
    };

    useEffect(() => {
        function loadSettings() {
            chrome.storage.local.get('userSettings', (data) => {
                if (data.userSettings) {
                    setUserSettings(data.userSettings);
                    setKeywordsList(data.userSettings.keywords || []);
                } else {
                    const initialSettings = {
                        username: "uname",
                        id: 492,
                        keywords: []
                    };
                    setUserSettings(initialSettings);
                }
            });
        }

        loadSettings();
    }, []);

    function handleTimeChange(e) {
        const { name, value } = e.target;
        setTimerDuration(prevValue => {
            const timeValues = prevValue.split(':');
            timeValues[name] = value;
            return timeValues.join(':');
        });
    };

    function handleAddKeyword() {
        if (keyword.trim() !== '') {
            const durationInMs = timeToMilliseconds(timerDuration);

            let kwObj = {
                "name": keyword,
                "timer": {
                    "enabled": timerEnabled,
                    "action" : timerAction,
                    "duration": durationInMs,
                    "remainingTime": durationInMs
                }
            };
            const updatedKeywords = [...userSettings.keywords, kwObj];
            const updatedSettings = { ...userSettings, keywords: updatedKeywords };
            setUserSettings(updatedSettings);
            setKeywordsList(updatedKeywords);

            // Create a message object with the updated keywords list
            const message = { action: "updateKeywords", data: updatedKeywords };

            // Send message to background.js
            chrome.runtime.sendMessage(message, function(response) {
                console.log("Response from background script:", response);
            });
            setKeyword('');
        }
    }

    const handleDeleteKeyword = (index) => {
        console.log("delete keyword called")
        const updatedKeywords = [...keywordsList];
        updatedKeywords.splice(index, 1);
        const updatedSettings = { ...userSettings, keywords: updatedKeywords };

        setKeywordsList(updatedKeywords);
        setUserSettings(updatedSettings);

        const message = { action: "keywordDeleted", data: updatedKeywords };

        // Send message to background.js
        chrome.runtime.sendMessage(message, function(response) {
            console.log("Response from background script:", response);
        });
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
                    <Form.Control
                        type="text"
                        placeholder="Enter keyword"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </Col>
                <Col className="text-end">
                    <Button onClick={handleAddKeyword}>
                        <PlusCircleFill style={{ fontSize: '24px', color: 'blue' }} />
                    </Button>
                </Col>
            </Row>
            <Row className='mb-3'>
                <Col>
                    <Form.Check
                        type="checkbox"
                        label="Enable Timer"
                        checked={timerEnabled}
                        onChange={e => setTimerEnabled(e.target.checked)}
                    />
                </Col>
            </Row>
            {timerEnabled && (
                <Row className='mb-3'>
                    <Col>
                        <Form>
                            <Form.Group controlId="duration">
                                <Form.Label>Duration:</Form.Label>
                                <Row>
                                    <Col>
                                        <Form.Control type="number" name="0" value={timerDuration.split(':')[0]} onChange={handleTimeChange} placeholder="HH" />
                                    </Col>
                                    <Col>
                                        <Form.Control type="number" name="1" value={timerDuration.split(':')[1]} onChange={handleTimeChange} placeholder="MM" />
                                    </Col>
                                    <Col>
                                        <Form.Control type="number" name="2" value={timerDuration.split(':')[2]} onChange={handleTimeChange} placeholder="SS" />
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Action:</Form.Label>
                                <div key={`inline-radio`} className="mb-3">
                                    <Form.Check
                                        inline
                                        label="Allow"
                                        name="action"
                                        type="radio"
                                        id={`inline-radio-allow`}
                                        value="allow"
                                        checked={timerAction === 'allow'}
                                        onChange={e => setTimerAction(e.target.value)}
                                    />
                                    <Form.Check
                                        inline
                                        label="Block"
                                        name="action"
                                        type="radio"
                                        id={`inline-radio-block`}
                                        value="block"
                                        checked={timerAction === 'block'}
                                        onChange={e => setTimerAction(e.target.value)}
                                    />
                                </div>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            )}
            <Row className='mb-3'>
                <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic" style={{ width: '100%' }}>
                        Keywords
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{ width: '100%' }}>
                        {keywordsList && keywordsList.length > 0 ? (
                            keywordsList.map((kw, index) => (
                                <Dropdown.Item key={index}>
                                    {kw.name}
                                    <Button variant="danger" size="sm" className="ml-2" onClick={() => handleDeleteKeyword(index)}>Delete</Button>
                                </Dropdown.Item>
                            ))
                        ) : (
                            <Dropdown.Item>No keywords added</Dropdown.Item>
                        )}
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
