import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import "../Css/Footer.css";

function Footer() {
  return (
    <>
      <footer className="main-footer">
        <Container>
          <Row>
            <Col lg={4} md={6} className="about-section">
              <h4>About Us</h4>
              <p>
                Discover the future of digital sharing with TapnTag. Prebook,
                save big, and enjoy our innovative NFC products at unbeatable
                prices. Join the digital revolution today.
              </p>
              <div className="social-links">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </a>
              </div>
            </Col>
            <Col lg={4} md={6} className="quick-links">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <Link to="/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms-conditions">Terms & Conditions</Link>
                </li>
                <li>
                  <Link to="/faq">FAQ</Link>
                </li>
                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>
              </ul>
            </Col>
            <Col lg={4} md={12} className="contact-section">
              <h4>Contact</h4>
              <ul className="contact-info">
                <li>
                  <span>📞</span> +91 9874563210
                </li>
                <li>
                  <span>✉️</span> info@tapntag.com
                </li>
                <li>
                  <span>📍</span> No. 1, Abc Street,
                  <br />
                  Wood creek County, Chennai,
                  <br />
                  Tamil Nadu - 600110.
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </footer>
      <div className="footer-bottom">
        <Container>
          <p>
            © copyright {new Date().getFullYear()} by TapnTag - All Rights
            Reserved
          </p>
        </Container>
      </div>
    </>
  );
}

export default Footer;
