// components/OrderForm.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';

const OrderForm = ({ orderItems, removeFromOrder, setOrderItems }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    deliveryNotes: '',
  });
  
  // Add validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = orderItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name cannot exceed 50 characters';
    }
    
    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required';
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'Please enter a valid address';
    } else if (formData.address.trim().length > 100) {
      newErrors.address = 'Address cannot exceed 100 characters';
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      // Remove any non-digit characters for validation
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    // Delivery notes - optional but validate length if provided
    if (formData.deliveryNotes.length > 200) {
      newErrors.deliveryNotes = 'Delivery notes cannot exceed 200 characters';
    }
    
    // Validate order items
    if (orderItems.length === 0) {
      newErrors.orderItems = 'Your order is empty. Please add items before placing an order.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    const isValid = validateForm();
    
    if (!isValid) {
      setIsSubmitting(false);
      // Scroll to the first error
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    try {
      // Format the customer data before sending
      const customerInfo = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        deliveryNotes: formData.deliveryNotes.trim()
      };
      
      const orderData = {
        customer_info: customerInfo,
        items: orderItems,
        total: parseFloat(total.toFixed(2)),
        status: 'new'
      };
      
      // Insert the order into Supabase
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select();
      
      if (error) throw error;
      
      // Clear the order and form
      setOrderItems([]);
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        deliveryNotes: '',
      });
      
      // Redirect to confirmation page
      router.push({
        pathname: '/order-confirmation',
        query: { orderId: data[0].id }
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      
      // Handle database errors
      if (error.code) {
        switch(error.code) {
          case '23505': // Unique violation
            setErrors({ form: 'This order has already been placed' });
            break;
          case '23503': // Foreign key violation
            setErrors({ form: 'There was an issue with your order items' });
            break;
          default:
            setErrors({ form: `Error placing order: ${error.message}` });
        }
      } else {
        setErrors({ form: `Error placing order: ${error.message}` });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="order-form">
      <h2>Your Order</h2>
      
      {/* Display form-level errors */}
      {errors.form && (
        <div className="form-error">
          <p className="error-message">{errors.form}</p>
        </div>
      )}
      
      {orderItems.length === 0 ? (
        <p className="empty-cart">Your order is empty. Add some items from the menu!</p>
      ) : (
        <>
          <div className="order-items">
            {orderItems.map((item) => (
              <div className="order-item" key={`${item.id}-${Date.now()}`}>
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p className="item-price">${item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => removeFromOrder(item.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          {/* Display order items error */}
          {errors.orderItems && (
            <p className="error-message">{errors.orderItems}</p>
          )}
          
          <div className="order-summary">
            <div className="summary-item">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Delivery Fee:</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="summary-item total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <h3>Delivery Information</h3>
            
            <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className={errors.name ? 'error-input' : ''}
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>
            
            <div className={`form-group ${errors.address ? 'has-error' : ''}`}>
              <label htmlFor="address">Delivery Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={isSubmitting}
                className={errors.address ? 'error-input' : ''}
              />
              {errors.address && <p className="error-message">{errors.address}</p>}
            </div>
            
            <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="e.g. (123) 456-7890"
                className={errors.phone ? 'error-input' : ''}
              />
              {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>
            
            <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className={errors.email ? 'error-input' : ''}
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            
            <div className={`form-group ${errors.deliveryNotes ? 'has-error' : ''}`}>
              <label htmlFor="deliveryNotes">Delivery Notes (Optional)</label>
              <textarea
                id="deliveryNotes"
                name="deliveryNotes"
                value={formData.deliveryNotes}
                onChange={handleChange}
                disabled={isSubmitting}
                rows="3"
                className={errors.deliveryNotes ? 'error-input' : ''}
              ></textarea>
              {errors.deliveryNotes && <p className="error-message">{errors.deliveryNotes}</p>}
              <small className="char-count">
                {formData.deliveryNotes.length}/200 characters
              </small>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-block"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </>
      )}
      
      <style jsx>{`
        .order-form {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .order-form h2 {
          margin-bottom: 20px;
          color: var(--dark-color);
        }
        
        .empty-cart {
          text-align: center;
          margin: 40px 0;
          color: #666;
        }
        
        .order-items {
          margin-bottom: 20px;
        }
        
        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #eee;
        }
        
        .item-info {
          flex: 1;
        }
        
        .item-info h4 {
          margin: 0 0 5px 0;
        }
        
        .item-price {
          color: #666;
          font-size: 0.9rem;
        }
        
        .item-total {
          font-weight: bold;
          margin: 0 15px;
        }
        
        .remove-btn {
          background: none;
          border: none;
          color: #ff4500;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0 5px;
        }
        
        .order-summary {
          background: #f9f9f9;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        
        .summary-item.total {
          font-weight: bold;
          font-size: 1.2rem;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
        
        form {
          margin-top: 20px;
        }
        
        form h3 {
          margin-bottom: 15px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }
        
        input, textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          font-family: inherit;
        }
        
        textarea {
          resize: vertical;
        }
        
        .btn-block {
          margin-top: 20px;
        }
        
        .has-error label {
          color: #dc3545;
        }
        
        .error-input {
          border-color: #dc3545;
          background-color: #fff8f8;
        }
        
        .error-message {
          color: #dc3545;
          font-size: 0.9rem;
          margin-top: 5px;
          margin-bottom: 0;
        }
        
        .form-error {
          background-color: #fff8f8;
          border: 1px solid #dc3545;
          border-radius: 4px;
          padding: 10px;
          margin-bottom: 20px;
        }
        
        .form-error .error-message {
          margin: 0;
        }
        
        .char-count {
          display: block;
          text-align: right;
          color: #666;
          font-size: 0.8rem;
          margin-top: 5px;
        }
        
        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default OrderForm;
