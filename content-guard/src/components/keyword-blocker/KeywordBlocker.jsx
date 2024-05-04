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
        keywords: [],
        activeKeywords: []
    });

    const navigateBack = () => {
        navigate('/blockers');
    };

    useEffect(() => {
        function loadSettings() {
            chrome.storage.local.get('userSettings', (data) => {
                if (data.userSettings) {
                    setUserSettings(data.userSettings);
                    setKeywordsList(data.userSettings.activeKeywords || []);
                } else {
                    const initialSettings = {
                        username: "uname",
                        id: 492,
                        keywords: [],
                        activeKeywords: []
                    };
                    setUserSettings(initialSettings);
                    saveSettings(initialSettings);
                }
            });
        }

        loadSettings();

        const listener = (request, sender, sendResponse) => {
            if (request.keywordsList) {
                setKeywordsList(request.keywordsList);
                sendResponse({ status: 'keywords received' });
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

    function handleAddKeyword() {
        if (keyword.trim() !== '') {
            const updatedKeywords = [...userSettings.activeKeywords, keyword];
            const updatedSettings = { ...userSettings, activeKeywords: updatedKeywords };
            setUserSettings(updatedSettings);
            setKeywordsList(updatedKeywords);
            saveSettings(updatedSettings);

            // Create a message object with the updated keywords list
            const message = { action: "updateKeywords", data: updatedKeywords };

            // Send message to background.js
            chrome.runtime.sendMessage(message, function(response) {
                console.log("Response from background script:", response);
            });
            setKeyword('');
        }
    }

    const deleteKeyword = (index) => {
        const updatedKeywords = [...keywordsList];
        updatedKeywords.splice(index, 1);
        setKeywordsList(updatedKeywords);
        
        const updatedSettings = { ...userSettings, activeKeywords: updatedKeywords };
        setUserSettings(updatedSettings);
        
        saveSettings(updatedSettings);

        const message = { action: "keywordDeleted", data:updatedKeywords };

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
                                    {kw}
                                    <Button variant="danger" size="sm" className="ml-2" onClick={() => deleteKeyword(index)}>Delete</Button>
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
