import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function OrderConfirmation() {
  const router = useRouter();
  const { orderId } = router.query;
  const [estimatedTime, setEstimatedTime] = useState(null);

  useEffect(() => {
    // Generate a random delivery time between 30-45 minutes
    if (orderId) {
      const time = Math.floor(Math.random() * 16) + 30;
      setEstimatedTime(time);
    }
  }, [orderId]);

  if (!orderId) {
    return (
      <Layout title="JJ Biryani - Loading...">
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout title="JJ Biryani - Order Confirmed">
      <div className="confirmation-container">
        <div className="confirmation-card">
          <div className="icon-success">✓</div>
          <h1>Thank You for Your Order!</h1>
          <p className="order-id">Order ID: #{orderId}</p>
          <p className="message">
            Your order has been successfully placed and is now being prepared.
          </p>
          
          {estimatedTime && (
            <div className="estimated-time">
              <h3>Estimated Delivery Time</h3>
              <p className="time">{estimatedTime} minutes</p>
            </div>
          )}
          
          <div className="next-steps">
            <h3>What's Next?</h3>
            <ul>
              <li>You'll receive a confirmation email shortly.</li>
              <li>Our delivery partner will contact you when they're on the way.</li>
              <li>Prepare to enjoy your delicious meal!</li>
            </ul>
          </div>
          
          <Link href="/menu">
            <button className="btn">Order More Food</button>
          </Link>
        </div>
      </div>
      <style jsx>{`
        .confirmation-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 70vh;
        }
        
        .confirmation-card {
          background: #fff;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 600px;
          width: 100%;
        }
        
        .icon-success {
          width: 80px;
          height: 80px;
          background: var(--success-color);
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          margin: 0 auto 30px;
        }
        
        h1 {
          color: var(--dark-color);
          margin-bottom: 20px;
        }
        
        .order-id {
          font-size: 1.2rem;
          font-weight: bold;
          color: var(--primary-color);
          margin-bottom: 20px;
        }
        
        .message {
          font-size: 1.1rem;
          margin-bottom: 30px;
        }
        
        .estimated-time {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        
        .estimated-time h3 {
          margin-bottom: 10px;
        }
        
        .time {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--primary-color);
        }
        
        .next-steps {
          text-align: left;
          margin-bottom: 30px;
        }
        
        .next-steps h3 {
          margin-bottom: 15px;
        }
        
        .next-steps ul {
          list-style: disc;
          padding-left: 20px;
        }
        
        .next-steps li {
          margin-bottom: 10px;
        }
        
        .loading {
          text-align: center;
          padding: 100px 0;
          font-size: 1.5rem;
          color: var(--primary-color);
        }
      `}</style>
    </Layout>
  );
}
