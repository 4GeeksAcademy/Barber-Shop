import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';

const SalonInfo = () => {
  return (
    <Container className="my-4 p-3 shadow-sm border rounded bg-light">
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          {/* Contenedor flexible con título a la izquierda y botón a la derecha */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fw-bold m-0">Vurve - Bangalore</h2>
            <Button variant="warning" size="lg">Book now</Button>
          </div>

          <p className="text-center">
            <strong className="fs-5">5.0</strong>{' '}
            <span className="text-warning">
              ★★★★★
            </span>{' '}
            (196) · <span className="text-danger">Closed</span> opens soon at 9:00am · MG Road, Bangalore
          </p>

          {/* Línea de separación */}
          <hr />

          <Row className="text-start mt-4">
            <Col xs={12} md={6}>
              <p>
                <strong>Location:</strong> Cl. Edison, 3, Chamartín, 28006 Madrid
                <br />4Geeks Academy España, dirección
              </p>
            </Col>
            <Col xs={12} md={6}>
              <p>
                <strong>Hours:</strong> Mon: Closed
                <br />Tue - Sun: 10:00 am - 07:30 pm
              </p>
            </Col>
          </Row>
          <Row className="text-start">
            <Col xs={12} md={6}>
              <p>
                <strong>People Enquired:</strong> 15 people recently enquired
              </p>
            </Col>
            <Col xs={12} md={6}>
              <p>
                <strong>Payment:</strong> Mode of payment: Cash, Debit Card, Credit Card, UPI
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default SalonInfo;
