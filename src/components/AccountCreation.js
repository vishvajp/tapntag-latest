import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AccountCreation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user has verified phone number
    const tempPhoneNumber = localStorage.getItem("tempPhoneNumber");
    if (!tempPhoneNumber) {
      navigate("/login"); // Redirect to login if no verified phone number
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("All fields are required");
      return;
    }

    try {
      setIsLoading(true);
      const phoneNumber = localStorage.getItem("tempPhoneNumber");
      const response = await api.post("/auth/create-account", {
        phoneNumber,
        ...formData,
      });

      if (response.success) {
        // Store user data and token
        localStorage.setItem("userData", JSON.stringify(response.user));
        localStorage.setItem("isAuthenticated", "true");
        localStorage.removeItem("tempPhoneNumber"); // Clean up temporary data
        
        // Navigate to home page
        navigate("/");
      }
    } catch (error) {
      setError(error.message || "Error creating account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <h3 className="text-center mb-4">Create Your Account</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                {error && (
                  <Alert variant="danger" className="mt-3">
                    {error}
                  </Alert>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AccountCreation;
