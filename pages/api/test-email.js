// pages/api/test-email.js
import { sendCustomerOrderConfirmation, sendAdminOrderNotification } from '../../utils/sendgrid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Create a test order
    const testOrder = {
      id: 'test-' + Date.now(),
      customer_info: {
        name: 'Test User',
        email: req.body.email || process.env.ADMIN_EMAIL, // Use provided email or fallback to admin
        phone: '555-123-4567',
        address: '123 Test Street, Test City',
        deliveryNotes: 'This is a test order'
      },
      items: [
        { name: 'Test Burger', price: 8.99, quantity: 2 },
        { name: 'Test Fries', price: 3.99, quantity: 1 }
      ],
      total: 21.97,
      status: 'test'
    };
    
    // Send a test email
    await sendCustomerOrderConfirmation(testOrder);
    
    res.status(200).json({ success: true, message: 'Test email sent!' });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
