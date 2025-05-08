import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductSlider from "../components/ProductSlider";
import "../Css/Home.css";
import nfcMainPic from "../assets/image/nfc-main-pic.png";
import smartnsimple from "../assets/image/smartnsimple.jpeg";
import design from "../assets/image/design.jpg";
import share from "../assets/image/share.jpg";
import connect from "../assets/image/connect.png";
function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="main-bg  text-white py-5">
        <Container className="main-bg-container">
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4 fw-bold mb-4">
                Your Digital Identity, One Tap Away
              </h1>
              <p className="lead mb-4">
                Transform your professional presence with Tap
                <span className="n-gradient-text">N</span>
                <span className="tag-gradient-text">Tag</span> - the modern way
                to share your story, share your business, and grow your social
                network.
              </p>
              <div className="d-flex gap-3">
                <Button as={Link} to="/login" className="btn-get" size="lg">
                  Get Started
                </Button>
              </div>
            </Col>
            <Col md={6}>
              {/* <img
                src={nfcMainPic}  fs
                alt="Digital Business Card"
                className="img-fluid"
              /> */}
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container fluid className="py-4 ps-5 pe-5">
        <h2 className="text-center mb-5 home-h2">
          Why Choose Tap<span className="n-gradient-text">N</span>
          <span className="tag-gradient-text">Tag</span>?
        </h2>
        <Row>
          <Col md={3} className="mb-3">
            <div className="text-center choose-tapntag p-4">
              <div className="mb-3">
                <img
                  src={smartnsimple}
                  alt="Digital Business Card"
                  className="img-fluid"
                />
              </div>
              <h4>Customizable products</h4>
              <h5 className="choose-us-subtitle">
                Tap<span className="n-gradient-text">N</span>
                <span className="tag-gradient-text">Tag</span> Products
              </h5>
              <p>
                Create your digital presence in minutes with our intuitive
                customizable tags like business cards, key chains, table
                standee, and more. No technical skills needed.
              </p>
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <div className="text-center choose-tapntag p-4">
              <div className="mb-3">
                <img
                  src={design}
                  alt="Digital Business Card"
                  className="img-fluid"
                />
              </div>
              <h4>Complete Profile Creation</h4>
              <h5 className="choose-us-subtitle">
                Tap<span className="n-gradient-text">N</span>
                <span className="tag-gradient-text">Tag</span> Digital Profile
              </h5>
              <p>
                Create your own profile with your own details. Add your social
                media links, contact information, and showcase your work
                portfolio all in one place.
              </p>
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <div className="text-center choose-tapntag p-4">
              <div className="mb-3">
                <img
                  src={share}
                  alt="Digital Business Card"
                  className="img-fluid"
                />
              </div>
              <h4>Instant Profile Sharing </h4>
              <h5 className="choose-us-subtitle">
                Tap<span className="n-gradient-text">N</span>
                <span className="tag-gradient-text">Tag</span> Sharing
              </h5>
              <p>
                Share your profile instantly with a simple tap or via the Share
                button. Connect with anyone, anywhere.
              </p>
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <div className="text-center choose-tapntag p-4">
              <div className="mb-3">
                <img
                  src={connect}
                  alt="Digital Business Card"
                  className="img-fluid"
                />
              </div>
              <h4>Build Communities</h4>
              <h5 className="choose-us-subtitle">
                Tap<span className="n-gradient-text">N</span>
                <span className="tag-gradient-text">Tag</span> Communities
              </h5>
              <p>
                Connect with business communities and expand your professional
                network. Share ideas, opportunities and grow together.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
      <div id="product-section">
        <ProductSlider></ProductSlider>
      </div>
      <Container className="p-5">
        <Row className="align-items-center">
          <Col md={6}>
            <img
              src={nfcMainPic}
              alt="Showcasing NFC Product"
              className="img-fluid rounded"
            />
          </Col>
          <Col md={6} className="home-col-smartway">
            <h2 className="mb-3 home-h2">
              Smart Networking at Your Fingertips
            </h2>
            <p className="lead">
              Tap<span className="n-gradient-text">N</span>
              <span className="tag-gradient-text">Tag</span> helps you exchange
              contact info and social media links effortlessly through one tap.
              Designed for professionals who want to make an impression
              instantly.
            </p>
            <p>
              Whether you're networking at events or sharing your profile during
              meetings, our solution makes the process seamless and
              professional.
            </p>
            <Button as={Link} to="/about" variant="dark">
              Learn More
            </Button>
          </Col>
        </Row>
      </Container>
      {/* CTA Section */}
      <div className="bg-light py-5">
        <Container className="text-center">
          <h2 className="mb-4 home-h2">Ready to Make Your Mark?</h2>
          <p className="lead mb-4">
            Join thousands of professionals who have already transformed their
            digital presence with Tap<span className="n-gradient-text">N</span>
            <span className="tag-gradient-text">Tag</span>.
          </p>
          <Button as={Link} to="/login" size="lg" className="px-5 btn-donate">
            Start Your Journey
          </Button>
        </Container>
      </div>
    </div>
  );
}

export default Home;
