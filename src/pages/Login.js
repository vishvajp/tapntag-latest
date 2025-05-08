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
import { useNavigate } from "react-router-dom";
import logo from "../assets/image/logo-tap.png";
import "../Css/Login.css";
import PhoneVerification from "../components/PhoneVerification";
import AccountCreation from "../components/AccountCreation";

function Login({ onLogin }) {
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [showAccountCreation, setShowAccountCreation] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const navigate = useNavigate();

  const handlePhoneVerification = (phoneNumber, isNewUser) => {
    setVerifiedPhone(phoneNumber);
    setIsNewUser(isNewUser);
    if (isNewUser) {
      setShowAccountCreation(true);
    } else {
      // Existing user, redirect to home
      onLogin();
      navigate("/profile-creation");
    }
  };

  const handleAccountCreated = (userData) => {
    if (onLogin) {
      onLogin(userData);
    }
    navigate("/profile-creation");
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="mb-4" style={{ backgroundColor: "black" }}>
            <Card.Body>
              <div className="text-center ">
                <img
                  src={logo}
                  alt="Logo"
                  style={{ width: "150px", marginBottom: "20px" }}
                />
              </div>

              {!showAccountCreation ? (
                <PhoneVerification
                  onVerificationComplete={handlePhoneVerification}
                />
              ) : (
                <AccountCreation
                  phoneNumber={verifiedPhone}
                  onAccountCreated={handleAccountCreated}
                />
              )}

              {/* <div className="text-center mt-3">
                <p>
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => navigate("/register")}
                  >
                    Sign up
                  </Button>
                </p>
              </div> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
