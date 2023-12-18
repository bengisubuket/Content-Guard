import React, { useState } from 'react';
import { Button, Table, Container, Row, Col } from 'react-bootstrap';

function KeywordBlockerComponent() {
  const [keywordBlockers, setKeywordBlockers] = useState([
    { id: 1, name: 'Blocker 1', keyword: 'example1', active: true },
    { id: 2, name: 'Blocker 2', keyword: 'example2', active: false },
    // Add more Keyword Blockers as needed
  ]);

  const handleToggleActivation = (id) => {
    setKeywordBlockers((prevBlockers) =>
      prevBlockers.map((blocker) =>
        blocker.id === id ? { ...blocker, active: !blocker.active } : blocker
      )
    );
  };

  const handleDelete = (id) => {
    setKeywordBlockers((prevBlockers) => prevBlockers.filter((blocker) => blocker.id !== id));
  };

  const handleDoubleClick = (id) => {
    // You can implement the logic for editing the name here
    console.log(`Double-clicked on Keyword Blocker with ID ${id}`);
  };

  return (
    <Container>
      <h2>Keyword Blocker</h2>
      <Row className="justify-content-end mb-3">
        <Col xs="auto">
          <Button variant="primary" onClick={() => console.log('Adding Keyword Blocker')}>
            Add Keyword Blocker
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Keyword</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {keywordBlockers.map((blocker) => (
            <tr key={blocker.id}>
              <td>{blocker.id}</td>
              <td onDoubleClick={() => handleDoubleClick(blocker.id)}>{blocker.name}</td>
              <td>{blocker.keyword}</td>
              <td>
                <Button
                  variant={blocker.active ? 'warning' : 'success'}
                  onClick={() => handleToggleActivation(blocker.id)}
                >
                  {blocker.active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button variant="danger" onClick={() => handleDelete(blocker.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default KeywordBlockerComponent;
