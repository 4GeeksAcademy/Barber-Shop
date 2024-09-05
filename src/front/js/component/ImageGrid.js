import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';

const ImageGrid = () => {
  return (
    <Container className="my-4">
      <Row>
        <Col xs={12} md={4}>
          <div className="image-placeholder"> {/* Aquí irían las imágenes */}
            Imagen 1
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="image-placeholder">Imagen 2</div>
        </Col>
        <Col xs={12} md={4}>
          <div className="image-placeholder">Imagen 3</div>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col xs={12} md={4}>
          <div className="image-placeholder">Imagen 4</div>
        </Col>
        <Col xs={12} md={4}>
          <div className="image-placeholder">Imagen 5</div>
        </Col>
        <Col xs={12} md={4}>
          <div className="image-placeholder">Imagen 6</div>
        </Col>
      </Row>
    </Container>
  );
};

export default ImageGrid;
