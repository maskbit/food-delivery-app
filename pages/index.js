import { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout title="JJ Biryani - Home">
      <div className="hero">
        <div className="hero-content">
          <h1>Delicious Food Delivered To Your Door</h1>
          <p>Order your favorite south indian meals with just a few clicks</p>
          <Link href="/menu">
            <button className="btn btn-large">Order Now</button>
          </Link>
        </div>
      </div>

      <section className="features">
        <div className="feature">
          <div className="feature-icon">🍔</div>
          <h3>Wide Selection</h3>
          <p>Choose from a variety of dishes prepared by our expert chefs</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🚚</div>
          <h3>Fast Delivery</h3>
          <p>Hot and fresh food delivered to your door in 30 minutes or less</p>
        </div>
        <div className="feature">
          <div className="feature-icon">💯</div>
          <h3>Quality Guaranteed</h3>
          <p>We use only the freshest ingredients for all our dishes</p>
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Choose Your Food</h3>
            <p>Browse our menu and select your favorite dishes</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Place Your Order</h3>
            <p>Fill in your delivery details and confirm your order</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Enjoy Your Food</h3>
            <p>We'll deliver your food hot and fresh to your door</p>
          </div>
        </div>
      </section>

      <div className="cta">
        <h2>Ready to Order?</h2>
        <Link href="/menu">
          <button className="btn">View Menu</button>
        </Link>
      </div>

      <style jsx>{`
        .hero {
          background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/food-background.jpg');
          background-color: #333;
          color: #fff;
          text-align: center;
          padding: 80px 20px;
          border-radius: 8px;
          margin-bottom: 40px;
        }
        
        .hero-content h1 {
          font-size: 2.5rem;
          margin-bottom: 20px;
        }
        
        .hero-content p {
          font-size: 1.2rem;
          margin-bottom: 30px;
        }
        
        .btn-large {
          padding: 12px 30px;
          font-size: 1.2rem;
        }
        
        .features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-bottom: 60px;
        }
        
        .feature {
          background: #fff;
          padding: 30px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }
        
        .feature h3 {
          margin-bottom: 15px;
        }
        
        .section-title {
          text-align: center;
          margin-bottom: 40px;
          font-size: 2rem;
        }
        
        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-bottom: 60px;
        }
        
        .step {
          background: #fff;
          padding: 30px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: relative;
        }
        
        .step-number {
          width: 40px;
          height: 40px;
          background: var(--primary-color);
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-weight: bold;
        }
        
        .cta {
          background: var(--primary-color);
          color: #fff;
          text-align: center;
          padding: 40px;
          border-radius: 8px;
          margin-bottom: 40px;
        }
        
        .cta h2 {
          margin-bottom: 20px;
        }
        
        .cta .btn {
          background: #fff;
          color: var(--primary-color);
        }
        
        @media (max-width: 768px) {
          .features, .steps {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Layout>
  );
}
