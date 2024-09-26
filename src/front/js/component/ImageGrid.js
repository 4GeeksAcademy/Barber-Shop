import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';

const ImageGrid = () => {
  const imageStyle = {
    height: '200px',  // Reducimos el tamaño a 200px
    width: '100%',
    objectFit: 'cover',
    marginBottom: '1.5rem',  // Incrementamos el espacio inferior para separar un poco más
  };

  return (
    <Container className="my-4">
      <Row className="gx-4">
        <Col xs={12} md={4}>
          <img
            src="https://images.pexels.com/photos/7518759/pexels-photo-7518759.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Imagen 1"
            className="img-fluid rounded shadow-sm"
            style={imageStyle}
          />
        </Col>
        <Col xs={12} md={4}>
          <img
            src="https://images.pexels.com/photos/28179155/pexels-photo-28179155/free-photo-of-moda-gente-arte-relajacion.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Imagen 2"
            className="img-fluid rounded shadow-sm"
            style={imageStyle}
          />
        </Col>
        <Col xs={12} md={4}>
          <img
            src="https://images.pexels.com/photos/27405444/pexels-photo-27405444/free-photo-of-ligero-moda-relajacion-vintage.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Imagen 3"
            className="img-fluid rounded shadow-sm"
            style={imageStyle}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ImageGrid;
