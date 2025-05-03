import { useState } from 'react';
import Layout from '../components/Layout';
import FoodGrid from '../components/FoodGrid';
import CategoryFilter from '../components/CategoryFilter';
import OrderForm from '../components/OrderForm';
import { menuItems, categories } from '../data/menu-items';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [orderItems, setOrderItems] = useState([]);

  const filteredItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  const addToOrder = (item) => {
    setOrderItems(prevItems => {
      // Check if the item is already in the order
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex !== -1) {
        // If item exists, update its quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity
        };
        return updatedItems;
      } else {
        // If item doesn't exist, add it to the order
        return [...prevItems, item];
      }
    });
  };

  const removeFromOrder = (itemId) => {
    setOrderItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  return (
    <Layout title="JJ Biryani - Menu">
      <div className="menu-container">
        <div className="menu-section">
          <h1 className="page-title">Our Menu</h1>
          <CategoryFilter 
            categories={categories} 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory}
          />
          <FoodGrid 
            items={filteredItems} 
            addToOrder={addToOrder}
          />
        </div>
        <div className="order-section">
          <OrderForm 
            orderItems={orderItems} 
            removeFromOrder={removeFromOrder}
            setOrderItems={setOrderItems}
          />
        </div>
      </div>
      <style jsx>{`
        .menu-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
          margin-top: 20px;
        }
        
        .page-title {
          margin-bottom: 20px;
        }
        
        @media (max-width: 992px) {
          .menu-container {
            grid-template-columns: 1fr;
          }
          
          .order-section {
            order: -1;
            margin-bottom: 30px;
          }
        }
      `}</style>
    </Layout>
  );
}
