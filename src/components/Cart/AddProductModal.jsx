import React, { useState } from 'react';
import Modal from '../UI/Modal';
import Input from '../UI/Input';
import Button from '../UI/Button';
import styles from './AddProductModal.module.css';

const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'product',
    price: '',
    quantity: 1,
    image: null
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const productData = {
        name: formData.name.trim(),
        type: formData.type,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        image: formData.image
      };
      
      onAddProduct(productData);
      handleClose();
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      type: 'product',
      price: '',
      quantity: 1,
      image: null
    });
    setErrors({});
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Custom Product"
      size="medium"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <Input
            label="Product Name"
            placeholder="Enter product name"
            required
            value={formData.name}
            onChange={handleInputChange('name')}
            error={errors.name}
            className={styles.fullWidth}
          />
          
          <div className={styles.typeSelect}>
            <label>Type</label>
            <select
              value={formData.type}
              onChange={handleInputChange('type')}
              className={styles.select}
            >
              <option value="product">📦 Product</option>
              <option value="service">⚡ Service</option>
            </select>
          </div>
          
          <Input
            label="Price (₺)"
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            required
            value={formData.price}
            onChange={handleInputChange('price')}
            error={errors.price}
          />
          
          <Input
            label="Quantity"
            type="number"
            min="1"
            required
            value={formData.quantity}
            onChange={handleInputChange('quantity')}
            error={errors.quantity}
          />
          
          <div className={styles.imageUpload}>
            <label>Product Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
            {formData.image && (
              <div className={styles.imagePreview}>
                <img src={formData.image} alt="Preview" />
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.formActions}>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            Add Product
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddProductModal;