import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import logo from "../assets/image/logo-tap.png";
import "../Css/Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import ProfileDropdown from './ProfileDropdown';

function NavigationBar() {
  const location = useLocation();
  const [cartCount] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  console.log(isAuthenticated);
  useEffect(() => {
    // Reset active section when not on home page
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    // Handle hash navigation
    if (location.hash === "#product-section") {
      setActiveSection("product");
      scrollToProduct();
      return;
    }

    const productSection = document.getElementById("product-section");
    if (!productSection) {
      setActiveSection("home");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveSection("product");
        } else {
          setActiveSection("home");
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(productSection);

    return () => observer.disconnect();
  }, [location]);

  const scrollToProduct = () => {
    const productSection = document.getElementById("product-section");
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleProductClick = (e) => {
    if (location.pathname !== "/") {
      e.preventDefault();
      navigate("/");
      setTimeout(scrollToProduct, 100);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="nav-logo-link">
          <img src={logo} className="img-fluid" alt="Company Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link
              as={Link}
              to="/"
              className={activeSection === "home" ? "active-link" : ""}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/#product-section"
              className={activeSection === "product" ? "active-link" : ""}
              onClick={handleProductClick}
            >
              Product
            </Nav.Link>
            {!isAuthenticated && (
              <Nav.Link
                as={Link}
                to="/login"
                className={location.pathname === "/login" ? "active-link" : ""}
              >
                Login
              </Nav.Link>
            )}
            {isAuthenticated && (
              <ProfileDropdown />
            )}
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/cart" className="position-relative">
              <FontAwesomeIcon icon={faShoppingCart} size="lg" />
              {cartCount > 0 && (
                <Badge
                  bg="danger"
                  className="position-absolute top-0 start-100 translate-middle rounded-pill"
                >
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
