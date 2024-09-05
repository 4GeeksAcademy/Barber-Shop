import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';

const SalonInfo = () => {
  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <h2>Vurve - Bangalore</h2>
          <p>
            <strong>5.0</strong> ★★★★☆ (196) · <span className="text-danger">Closed</span> opens soon at 9:00am · MG Road, Bangalore
          </p>
          <Row>
            <Col xs={12} md={6}>
              <p>
                <i className="bi bi-geo-alt"></i> Cl. Edison, 3, Chamartín, 28006 Madrid
                <br />4Geeks Academy España, dirección
              </p>
            </Col>
            <Col xs={12} md={6}>
              <p>
                <i className="bi bi-clock"></i> Mon: Closed
                <br />Tue - Sun: 10:00 am - 07:30 pm
              </p>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <p>
                <i className="bi bi-people"></i> 15 people recently enquired
              </p>
            </Col>
            <Col xs={12} md={6}>
              <p>
                <i className="bi bi-cash"></i> Mode of payment: Cash, Debit Card, Credit Card, UPI
              </p>
            </Col>
          </Row>
          <Button variant="warning" size="lg">Book now</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default SalonInfo;
