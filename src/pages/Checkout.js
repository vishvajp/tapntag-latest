import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../Css/Checkout.css";
import Stepper from "../components/Stepper";
import PhoneVerification from "../components/PhoneVerification";
import AccountCreation from "../components/AccountCreation";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    phone: "",
    shippingMethod: "standard",
  });
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [isGuestCheckout, setIsGuestCheckout] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCartItems(parsedCart);
      const calculatedTotal = parsedCart.reduce(
        (sum, item) =>
          sum + parseFloat(item.price.replace("₹", "")) * item.quantity,
        0
      );
      setTotal(calculatedTotal);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhoneVerification = (phoneNumber) => {
    setVerifiedPhone(phoneNumber);
    setFormData({ ...formData, phone: phoneNumber });
    setCheckoutStep(1);
  };

  const handleAccountCreated = (userData) => {
    setFormData({
      ...formData,
      firstName: userData.firstName,
      lastName: userData.lastName,
    });
    setCheckoutStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle order submission
    console.log("Order submitted:", { ...formData, cartItems, total });
    // Clear cart and redirect to success page
    localStorage.removeItem("cart");
    navigate("/order-success");
  };

  const renderCheckoutStep = () => {
    switch (checkoutStep) {
      case 0:
        return (
          <div className="text-center">
            <h3>How would you like to proceed?</h3>
            <div className="mt-4">
              <Button
                variant="primary"
                className="me-3"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => {
                  setIsGuestCheckout(true);
                  setCheckoutStep(1);
                }}
              >
                Continue as Guest
              </Button>
            </div>
          </div>
        );
      case 1:
        return (
          <PhoneVerification
            onVerificationComplete={handlePhoneVerification}
            isGuestCheckout={isGuestCheckout}
          />
        );
      case 2:
        return (
          <AccountCreation
            phoneNumber={verifiedPhone}
            onAccountCreated={handleAccountCreated}
            isGuestCheckout={isGuestCheckout}
          />
        );
      case 3:
        return (
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            {/* Rest of the form fields */}
            <Button variant="primary" type="submit" className="w-100 mt-4">
              Place Order
            </Button>
          </Form>
        );
      default:
        return null;
    }
  };

  return (
    <Container className="mt-5">
      <Button variant="link" className="mb-4" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </Button>
      <Stepper
        steps={[
          "Authentication",
          "Phone Verification",
          "Account Details",
          "Shipping",
        ]}
        currentStep={checkoutStep}
      />
      <Row className="mt-4">
        <Col md={8}>{renderCheckoutStep()}</Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h5>Order Summary</h5>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between mb-2"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>
                    ₹{parseFloat(item.price.replace("₹", "")) * item.quantity}
                  </span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total</strong>
                <strong>₹{total}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Checkout;
