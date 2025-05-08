import React, { useState } from "react";
import { useAuth} from '../Context/AuthContext';
import { useCart} from '../Context/CartContext'; // Assuming both contexts are exported from same file
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  Form,
  Card,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faPlus,
  faMinus,
  faBox,
} from "@fortawesome/free-solid-svg-icons";
import "../Css/ProductDetail.css";

function ProductDetail() {
  const location = useLocation();
  const product = location.state?.product;
  const { id } = useParams();
  const { user, token } = useAuth();
  const { addToCart } = useCart(); // Using cart context
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.min(10, Math.max(1, prev + change)));
  };

  const handleAddToCart = async () => {
    try {
      if (!product || !product._id) {
        throw new Error('Invalid product data');
      }

      if (!user) {
        // For guest users, add directly to guest cart with product data
        await addToCart(product._id, quantity, product);
        alert(`${product.name} added to cart!`);
        return;
      }

      // For logged-in users
      console.log('Adding to cart:', { productId: product._id, quantity, user, token });
      await addToCart(product._id, quantity);
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status
      });
      alert('Failed to add to cart. Please try again.');
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart(product, quantity);
      navigate("/cart");
    } catch (error) {
      console.error('Error in buy now:', error);
      alert('Failed to proceed. Please try again.');
    }
  };

  if (!product) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <h2>Loading...</h2>
          <p>Please wait while we fetch the product details.</p>
        </div>
      </Container>
    );
  }

  // Generate box contents based on product name
  const boxContents = [`1 x ${product.name}`, "1 x Setup Manual"];


  return (
    <Container className="product-detail-container">
      <Row className="mb-5">
        <Col md={6}>
          <div className="main-image-container">
            <img
              src={`http://localhost:3000/vishva/tapntag${product.images[selectedImage]}`}
              alt={product.name}
              className="main-image"
            />
            <div className="thumbnail-carousel">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                >
                  <img 
                    src={`http://localhost:3000/vishva/tapntag${image}`} 
                    alt={`${product.name} view ${index + 1}`} 
                  />
                </div>
              ))}
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="product-info">
            <h1>{product.name}</h1>
            <p className="price">₹{product.price}</p>
            <p className="description">{product.description}</p>

            <div className="features-list mb-4">
              <h3>Features</h3>
              <ul>
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="whats-in-box mb-4">
              <h3>
                <FontAwesomeIcon icon={faBox} className="me-2" />
                What's in the Box
              </h3>
              <ul>
                {boxContents.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="quantity-selector mb-4">
              <label className="me-3">Quantity:</label>
              <div className="d-flex align-items-center">
                <Button
                  variant="outline-secondary"
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2"
                  disabled={quantity <= 1}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </Button>
                <Form.Control
                  type="number"
                  value={quantity}
                  readOnly
                  min="1"
                  max="10"
                  className="mx-2 text-center"
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => handleQuantityChange(1)}
                  className="p-2"
                  disabled={quantity >= 10}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </div>
            </div>

            <div className="button-group">
              <Button
                variant="primary"
                size="lg"
                className="me-3 mb-3"
                onClick={handleAddToCart}
              >
                <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                Add to Cart
              </Button>
              <Button
                variant="success"
                size="lg"
                className="mb-3"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetail;