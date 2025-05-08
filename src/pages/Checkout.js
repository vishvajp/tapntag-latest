import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../Context/AuthContext";
import { useCart } from "../Context/CartContext";
import "../Css/Checkout.css";
import Stepper from "../components/Stepper";
import PhoneVerification from "../components/PhoneVerification";
import AccountCreation from "../components/AccountCreation";
import api from "../services/api";

function Checkout() {
  const { user } = useAuth();
  const { cart, totalPrice, loading: cartLoading } = useCart();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    phone: user?.phoneNumber || "",
  });
  const [checkoutStep, setCheckoutStep] = useState(user ? 3 : 0);
  const [isGuestCheckout, setIsGuestCheckout] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
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

  const initializeRazorpay = async () => {
    try {
      setLoading(true);
      // Create order on your backend
      const response = await api.post("/orders/create", {
        amount: totalPrice * 100, // Convert to paise
        currency: "INR",
        receipt: "receipt_" + Date.now(),
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: totalPrice * 100,
        currency: "INR",
        name: "TapnTag",
        description: "Payment for your order",
        order_id: response.data.id,
        handler: function (response) {
          handlePaymentSuccess(response);
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: user?.email || "",
          contact: formData.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      alert("Payment initialization failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      setLoading(true);
      // Verify payment on your backend
      const verifyResponse = await api.post("/orders/verify", {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      });

      if (verifyResponse.data.success) {
        // Create order in your database
        await api.post("/orders", {
          items: cart,
          totalAmount: totalPrice,
          shippingAddress: formData,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
        });

        // Clear cart and redirect to success page
        navigate("/order-success");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      alert("Payment verification failed. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await initializeRazorpay();
  };

  if (cartLoading) {
    return (
      <Container className="mt-5 text-center">
        <h3>Loading your cart...</h3>
      </Container>
    );
  }

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

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>PIN Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

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
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="d-flex align-items-center mb-3"
                >
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000'}/vishva/tapntag${item.product.images && item.product.images.length > 0 ? item.product.images[0] : '/placeholder-image.jpg'}`}
                    alt={item.product.name}
                    className="checkout-item-image me-2"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <span className="text-truncate" style={{ maxWidth: '150px' }}>
                        {item.product.name}
                      </span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <small className="text-muted">Quantity: {item.quantity}</small>
                  </div>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total</strong>
                <strong>₹{totalPrice.toFixed(2)}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Checkout;
