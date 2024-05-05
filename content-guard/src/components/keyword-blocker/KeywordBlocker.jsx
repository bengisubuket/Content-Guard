import React, { useCallback, useEffect, useState } from 'react';
import { Button, Container, Row, Col, Form, Dropdown, Image } from 'react-bootstrap';
import { PlusCircleFill, ArrowLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

function KeywordBlockerComponent() {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [keywordsList, setKeywordsList] = useState();
    const [userSettings, setUserSettings] = useState({
        username: "uname",
        id: 492,
        keywords: []
    });

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

    function handleAddKeyword() {
        if (keyword.trim() !== '') {

            let kwObj = {
                "name": keyword,
                "timer": null
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
        const updatedKeywords = [...keywordsList];
        updatedKeywords.splice(index, 1);
        setKeywordsList(updatedKeywords);
        
        const updatedSettings = { ...userSettings, keywords: updatedKeywords };
        setUserSettings(updatedSettings);

        const message = { action: "keywordDeleted", data: updatedKeywords };

        // Send message to background.js
        chrome.runtime.sendMessage(message, function(response) {
            console.log("Response from content script:", response);
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
