import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { editProduct } from "../services/productService";
import "../Css/ProductEdit.css";

const ProductEdit = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state || !state.product) {
      navigate("/products", { replace: true });
    }
  }, [state, navigate]);

  const [product, setProduct] = useState(state.product);
  const [newImages, setNewImages] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...product.features];
    newFeatures[index] = value;
    setProduct((prev) => ({
      ...prev,
      features: newFeatures,
    }));
  };

  const addFeature = () => {
    setProduct((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeature = (index) => {
    const newFeatures = [...product.features];
    newFeatures.splice(index, 1);
    setProduct((prev) => ({
      ...prev,
      features: newFeatures,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files.length + product.images.length + newImages.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }
  
    setNewImages([...e.target.files]);
    setError("");
  };

  const removeImage = (index, isExisting) => {
    if (isExisting) {
      setProduct((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
      
    } else {
      setNewImages(newImages.filter((_, i) => i !== index));
    }
  };

  console.log(newImages)
console.log(product)


const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
  
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description || "");
      formData.append("price", product.price);
      
      // Features
      product.features.filter(f => f.trim() !== "").forEach((feature) => {
        formData.append("features", feature);
      });
  
      // New images
      newImages.forEach((image) => {
        formData.append("images", image);
      });
  
      // Send current images that should be kept
      product.images.forEach((image) => {
        formData.append("existingImages", image);
      });
  
      await editProduct(product._id, formData);
      navigate("/products", { replace: true });
      alert("Product updated successfully!");
    
    } catch (err) {
      setError(err.message || "Failed to update product. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="product-edit-container">
      <h2>Edit Product</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={product.description || ""}
            onChange={handleChange}
            className="form-control"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Price ($)</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Features</label>
          {product.features?.map((feature, index) => (
            <div key={index} className="feature-input-group">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                className="form-control"
              />
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="btn btn-danger"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="btn btn-secondary"
          >
            Add Feature
          </button>
        </div>

        <div className="form-group">
          <label>Current Images ({product.images?.length || 0}/5)</label>
          <div className="image-preview-container">
            {product.images?.map((image, index) => (
              <div key={`existing-${index}`} className="image-preview">
                <img
                  src={image.startsWith("http") ? image : `../${image}`}
                  alt={`Product ${index}`}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index, true)}
                  className="btn btn-sm btn-danger remove-image-btn"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Add New Images (Max {5 - (product.images?.length || 0) - newImages.length} more)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="form-control"
            disabled={(product.images?.length || 0) + newImages.length >= 5}
          />
          <div className="image-preview-container">
            {Array.from(newImages).map((image, index) => (
              <div key={`new-${index}`} className="image-preview">
                <img src={URL.createObjectURL(image)} alt={`New ${index}`} />
                <button
                  type="button"
                  onClick={() => removeImage(index, false)}
                  className="btn btn-sm btn-danger remove-image-btn"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;