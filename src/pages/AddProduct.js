import React, { useState } from "react";
import { addProduct } from "../services/productService";
import "../Css/AddProduct.css";

const AddProduct = () => {
  const [form, setForm] = useState({ 
    name: "", 
    description: "", 
    price: "",
    features: [""] // Initialize with one empty feature
  });
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...form.features];
    newFeatures[index] = value;
    setForm(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeatureField = () => {
    setForm(prev => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeatureField = (index) => {
    const newFeatures = form.features.filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, features: newFeatures }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      
      // Append each feature individually
      form.features.forEach((feature, index) => {
        formData.append(`features`, feature); // Simplified format
      });
      
      // Append each image file
      images.forEach((image) => {
        formData.append("images", image); // Key should match what Multer expects
      });
  
      await addProduct(formData);
      setMessage("Product added successfully!");
      setForm({ name: "", description: "", price: "", features: [""] });
      setImages([]);
    } catch (err) {
      setMessage("Failed to add product");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        <div>
          <label>Name:</label>
          <input 
            name="name" 
            type="text"
            value={form.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <label>Price:</label>
          <input 
            name="price" 
            type="number" 
            value={form.price} 
            onChange={handleChange} 
            required 
            min="0" 
          />
        </div>
        
        <div>
          <label>Features:</label>
          {form.features.map((feature, index) => (
            <div key={index} className="feature-input-container">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                placeholder="Enter feature"
              />
              {form.features.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeFeatureField(index)}
                  className="remove-feature-btn"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            onClick={addFeatureField}
            className="add-feature-btn"
          >
            + Add Feature
          </button>
        </div>
        
        <div className="file-input-label">
          <label>Images:</label>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleImageChange} 
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="submit-btn"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
      {message && (
        <div className={`message ${message.includes("success") ? "success-message" : "error-message"}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AddProduct;