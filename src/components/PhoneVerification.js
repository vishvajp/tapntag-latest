import React, { useState } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import OtpInput from "react-otp-input";
import { sendOTP, verifyOTP } from "../services/api";
import { useNavigate } from "react-router-dom";

function PhoneVerification({
  onVerificationComplete,
  isGuestCheckout = false,
}) {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const response = await sendOTP(phoneNumber);
      alert("OTP has been sent to your phone number");
      setIsNewUser(response.isNewUser);
      setSuccess("OTP has been sent to your phone number");
    } catch (error) {
      setError(error.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const response = await verifyOTP(phoneNumber, otp);

      if (response.success) {
        if (response.isNewUser) {
          // Store phone number temporarily for account creation
          localStorage.setItem("tempPhoneNumber", phoneNumber);
          // Navigate to account creation page
          navigate("/account-creation");
        } else {
          // Store user data in localStorage for existing users
          localStorage.setItem("userData", JSON.stringify(response.user));
          localStorage.setItem("isAuthenticated", "true");
          // Navigate to home page
          navigate("/");
        }
      }
    } catch (error) {
      setError(error.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-2">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <h3 className="text-center mb-4">
                {isGuestCheckout ? "Guest Checkout" : "Phone Verification"}
              </h3>

              <Form onSubmit={handleSendOTP}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter your 10-digit phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    maxLength={10}
                    disabled={isLoading}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </Button>
              </Form>

              <Form onSubmit={handleVerifyOTP}>
                <Form.Group className="mb-3">
                  <Form.Label>Enter OTP</Form.Label>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={4}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => (
                      <input
                        {...props}
                        style={{
                          width: "3rem",
                          height: "3rem",
                          margin: "0 0.5rem",
                          fontSize: "1.5rem",
                          borderRadius: "4px",
                          border: "1px solid #ced4da",
                        }}
                      />
                    )}
                    isDisabled={isLoading}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>
              </Form>

              {error && (
                <Alert variant="danger" className="mt-3">
                  {error}
                </Alert>
              )}
              {success && (
                <Alert variant="success" className="mt-3">
                  {success}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default PhoneVerification;
