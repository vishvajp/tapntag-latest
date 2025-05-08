import React, { useState, useEffect } from "react";
import { Carousel, Card, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../Css/ProductSlider.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import { getProducts, deleteProduct } from "../services/productService";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";



function ProductSlider() {
  const [index, setIndex] = useState(0);
  const [productsPerSlide, setProductsPerSlide] = useState(4);
  const [products,setProducts]=useState([])
  const navigate = useNavigate()

  useEffect(()=>{
    const fetchProducts = async () => {
     
       try {
         const res = await getProducts();
         console.log("API response:", res);
         setProducts(res);
       } catch (err) {
         alert("Failed to fetch products");
         console.error("Fetch error:", err);
       } 
     };
     fetchProducts();
  },[])

  // Handle window resize to update products per slide
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setProductsPerSlide(1); // Mobile: 1 product per slide
      } else if (window.innerWidth < 992) {
        setProductsPerSlide(2); // Small tablets: 2 products per slide
      } else if (window.innerWidth < 1200) {
        setProductsPerSlide(3); // Tablets: 3 products per slide
      } else {
        setProductsPerSlide(4); // Desktop: 4 products per slide
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const renderProducts = () => {
    const items = [];

    // For mobile view (1 product per slide), create a slide for each product
    if (productsPerSlide === 1) {
      return products.map((product) => (
        <Carousel.Item key={product._id}>
          <div className="d-flex justify-content-center">
            <Card className="product-card hover-shadow">
              <Card.Img variant="top"  src={
                  product.images[0].startsWith("http")
                    ? product.images[0]
        : `http://localhost:3000/vishva/tapntag${product.images[0]}`
    } alt={product.name} />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text className="price">{product.price}</Card.Text>
                <Card.Text>{product.description}</Card.Text>
               
                <Button onClick={()=>navigate(`/product/${product._id}`,{state:{product}})} variant="primary" className="w-100">
                      See More Details
                    </Button>
           
              </Card.Body>
            </Card>
          </div>
        </Carousel.Item>
      ));
    }

    // For larger screens, show multiple products per slide
    const circularProducts = [
      ...products,
      ...products.slice(0, productsPerSlide - 1),
    ];

    for (let i = 0; i < products.length; i++) {
      const group = circularProducts.slice(i, i + productsPerSlide);
      items.push(
        <Carousel.Item key={i}>
          <div className="d-flex justify-content-center gap-4">
            {group.map((product) => (
              <Card key={product._id} className="product-card hover-shadow">
                <Card.Img variant="top"  src={
                  product.images[0].startsWith("http")
                    ? product.images[0]
        : `http://localhost:3000/vishva/tapntag${product.images[0]}`
    } alt={product.name} />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text className="price">{product.price}</Card.Text>
                  <Card.Text>{product.description}</Card.Text>
                                     <Button onClick={()=>navigate(`/product/${product._id}`,{state:{product}})} variant="primary" className="w-100">
                      See More Details
                    </Button>
            
                </Card.Body>
              </Card>
            ))}
          </div>
        </Carousel.Item>
      );
    }
    return items;
  };

  return (
    <div className="product-slider-container">
      <h2 className="text-center mb-2 home-h2">
        Tap<span className="n-gradient-text">N</span>
        <span className="tag-gradient-text">Tag</span> Products
      </h2>
      <p className="text-center">
        Get free profile creation on the purchase of any of these Tap
        <span className="n-gradient-text">N</span>
        <span className="tag-gradient-text">Tag</span> products.
      </p>
      <Carousel
        className="product-carousel"
        activeIndex={index}
        onSelect={handleSelect}
        interval={null}
        indicators={true}
        controls={true}
        prevIcon={<FontAwesomeIcon icon={faChevronLeft} />}
        nextIcon={<FontAwesomeIcon icon={faChevronRight} />}
      >
        {renderProducts()}
      </Carousel>
    </div>
  );
}

export default ProductSlider;
