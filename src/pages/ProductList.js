import React, { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../services/productService";
import { useNavigate } from "react-router-dom";
import "../Css/ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Component mounted");
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      console.log("API response:", res);
      setProducts(res);
    } catch (err) {
      alert("Failed to fetch products");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      console.log("Loading set to false");
    }
  };
  


  const handleEdit = (product) => {
    navigate(`/product-edit/${product._id}` ,{state:{product}});
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  if (loading) return <div className="loading-message">Loading...</div>;

  return (
    <div className="container product-list-container">
      <h2>Product Listing</h2>
      <div className="row">
        {products.length === 0 ? (
          <div className="col-12 no-products-message">No products found.</div>
        ) : (
          products.map((product) => (
            <div className="col-md-4 mb-3" key={product._id}>
              <div className="card product-card">
                <div className="image-container">
                {product.images && product.images.length > 0 ? (
  <img
    src={
      product.images[0].startsWith("http") 
        ? product.images[0]
        : `.${product.images[0]}`
    }
    className="card-img-top product-image"
    alt={product.name}
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect fill='%23ddd' width='300' height='200'/%3E%3Ctext fill='%23aaa' font-family='sans-serif' font-size='16' x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
    }}
  />
) : (
  <img
    src="data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect fill='%23ddd' width='300' height='200'/%3E%3Ctext fill='%23aaa' font-family='sans-serif' font-size='16' x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E"
    className="card-img-top product-image"
    alt="No Image"
  />
)}
                </div>
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text fw-bold">${product.price}</p>
                  <div className="features">
                    <h6>Features:</h6>
                    <ul>
                      {product.features && product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;