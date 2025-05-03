import { useState } from 'react';
import Image from 'next/image';

const FoodCard = ({ item, addToOrder }) => {
  const [quantity, setQuantity] = useState(1);

const [imageError, setImageError] = useState(false);

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleAddToOrder = () => {
    addToOrder({
      ...item,
      quantity
    });
    setQuantity(1);
  };

  return (
  <div className="food-card">
      <div className="food-image">
        {imageError ? (
          // Fallback if image fails to load
          <div className="image-placeholder">
            <div className="placeholder-text">{item.name[0]}</div>
          </div>
        ) : (
          // Try to load the actual image
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            style={{ objectFit: 'cover' }}
            onError={() => setImageError(true)}
            priority={false} // Set to true for above-the-fold images
          />
        )}
      </div>
      <div className="food-info">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className="price">${item.price.toFixed(2)}</div>
      </div>
      <div className="order-controls">
        <input 
          type="number" 
          min="1" 
          max="10" 
          value={quantity}
          onChange={handleQuantityChange}
        />
        <button className="btn" onClick={handleAddToOrder}>
          Add to Order
        </button>
      </div>
      <style jsx>{`
        .food-card {
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        
        .food-card:hover {
          transform: translateY(-5px);
        }
        
        .food-image {
          height: 200px;
          position: relative;
          overflow: hidden;
        }
        
        .image-placeholder {
          width: 100%;
          height: 100%;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .placeholder-text {
          font-size: 3rem;
          color: var(--primary-color);
          font-weight: bold;
        }
        
        .food-info {
          padding: 15px;
        }
        
        .food-info h3 {
          margin-bottom: 10px;
          color: var(--dark-color);
        }
        
        .food-info p {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 10px;
        }
        
        .price {
          font-size: 1.2rem;
          font-weight: bold;
          color: var(--primary-color);
          margin-bottom: 10px;
        }
        
        .order-controls {
          padding: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #eee;
        }
        
        .order-controls input {
          width: 60px;
          text-align: center;
          padding: 5px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default FoodCard;
