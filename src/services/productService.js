import api from "./api";

export const addProduct = async (formData) => {
  return await api.post("/products", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getProducts = async () => {
  return await api.get("/products");
};

export const editProduct = async (id, formData) => {
  return await api.put(`/products/${id}`, formData,{
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const deleteProduct = async (id) => {
  return await api.delete(`/products/${id}`);
};
