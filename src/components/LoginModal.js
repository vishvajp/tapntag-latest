import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import "../Css/LoginModal.css";
import logo from "../assets/image/logo-tap.png";

function LoginModal({ show, onHide, onLogin }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  // Function to generate 4-digit OTP
  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000); // 4-digit OTP
  };

  // Function to send OTP via alert
  const sendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    const otpCode = generateOtp();
    setGeneratedOtp(otpCode);
    alert(`Your OTP is: ${otpCode}`);
    setIsOtpSent(true);
    setSuccess("OTP has been generated. Please check the alert.");
    setError("");
  };

  // Function to verify OTP
  const verifyOtp = (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    if (parseInt(otp) === generatedOtp) {
      setSuccess("OTP verified successfully!");
      setError("");

      // Call the onLogin function passed as prop
      if (onLogin) {
        onLogin();
      }

      // Close the modal after successful login
      setTimeout(() => {
        onHide();
      }, 1000);
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <div className="d-flex justify-content-center mb-3">
          <div className="w-50">
            <img src={logo} className="img-fluid"></img>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Form Form onSubmit={sendOtp}>
          <Form.Group className="mb-3">
            <Form.Label>
              <strong className="text-white">Email Address</strong>
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <div className="d-flex justify-content-center">
            <Button type="submit" className="login-sendotp-button text-center">
              {isOtpSent ? "Resend OTP" : "Send OTP"}
            </Button>
          </div>
        </Form>

        <Form onSubmit={verifyOtp} className="mt-3">
          <Form.Group className="mb-3">
            <Form.Label>
              <strong className="text-white">Enter OTP</strong>
            </Form.Label>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
              renderSeparator={<span style={{ width: "10px" }} />}
              renderInput={(props) => (
                <input {...props} className="otp-input" />
              )}
              containerStyle="otp-container"
            />
          </Form.Group>
          <div className="d-flex justify-content-center">
            <Button
              variant="primary"
              type="submit"
              className="login-sendotp-button text-center"
            >
              Verify OTP
            </Button>
          </div>
        </Form>
      </Modal.Body>
      {/* <Modal.Footer>
        <Button variant="link" onClick={() => navigate("/login")}>
          Login with password
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
}

export default LoginModal;
