import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Form, Dropdown, Image } from 'react-bootstrap';
import { PlusCircleFill, ArrowLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

function KeywordBlockerComponent() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [keywordsList, setKeywordsList] = useState();

  const navigateBack = () => {
    navigate('/blockers');
  };

  useEffect(() => {
    const fetchKeywords = () => {
      chrome.runtime.sendMessage({ request: "getKeywords" }, function(response) {
        if (response && response.keywordsList) {
          setKeywordsList(response.keywordsList);
        } else {
          setKeywordsList([]);  // Ensure it's always an array
        }
      });
    };
  
    fetchKeywords();
  
    const listener = function(request, sender, sendResponse) {
      if (request.keywordsList) {
        setKeywordsList(request.keywordsList);
        sendResponse({ status: 'keywords received' });
      }
      return true;
    };
  
    chrome.runtime.onMessage.addListener(listener);
  
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);
  
  
  

  const handleAddKeyword = () => {
    if (keyword.trim() !== '') {
      const updatedKeywords = [...keywordsList, keyword];
      setKeywordsList(updatedKeywords);
      // Send the updated keywords directly
      chrome.runtime.sendMessage({ keywordsList: updatedKeywords }, function(response) {
        console.log('Response from background:', response);
      });
      setKeyword('');
    }
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
                <Dropdown.Item key={index}>{kw}</Dropdown.Item>
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
