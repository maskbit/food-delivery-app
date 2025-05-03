// pages/api/orders.js
import { supabase } from '../../utils/supabase';
import nodemailer from 'nodemailer';

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req, res) {
  // Set CORS headers if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle POST request (create order)
  if (req.method === 'POST') {
    try {
      const orderData = req.body;
      
      // Insert the order into Supabase
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select();
      
      if (error) throw error;
      
      const newOrder = data[0];
      const orderId = newOrder.id;
      
      // Send email to customer
      await sendCustomerEmail(newOrder);
      
      // Send email to admin/restaurant
      await sendAdminEmail(newOrder);
      
      // Return the created order
      res.status(201).json({ 
        success: true, 
        orderId,
        message: 'Order placed successfully and notifications sent'
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  } 
  // Handle GET request (fetch orders)
  else if (req.method === 'GET') {
    try {
      // Extract query parameters
      const { id, status, limit = 10, offset = 0 } = req.query;
      
      // Build the query
      let query = supabase.from('orders').select('*');
      
      // Apply filters if provided
      if (id) {
        query = query.eq('id', id);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      // Apply pagination
      query = query.order('created_at', { ascending: false })
                   .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
      
      // Execute the query
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      res.status(200).json({ 
        success: true, 
        data,
        pagination: {
          total: count,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    res.status(405).json({ 
      success: false, 
      error: `Method ${req.method} Not Allowed` 
    });
  }
}

/**
 * Send an order confirmation email to the customer
 * @param {Object} order - The order object
 */
async function sendCustomerEmail(order) {
  const { customer_info, items, total, id } = order;
  
  // Format the order items for email
  const itemsList = items.map(item => 
    `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`
  ).join('');
  
  // Email content with responsive design
  const mailOptions = {
    from: `"TastyDelivery" <${process.env.EMAIL_FROM}>`,
    to: customer_info.email,
    subject: `Your TastyDelivery Order #${id.substring(0, 8)}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
          }
          .container {
            padding: 20px;
          }
          .header {
            background-color: #ff4500;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 5px 5px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #777;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th {
            background-color: #f2f2f2;
            text-align: left;
            padding: 10px 8px;
          }
          .total-row {
            font-weight: bold;
            background-color: #f9f9f9;
          }
          @media only screen and (max-width: 480px) {
            body {
              padding: 10px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
          </div>
          <div class="content">
            <p>Hi ${customer_info.name},</p>
            <p>Thank you for your order! We've received it and are preparing your food.</p>
            
            <h2>Order Summary</h2>
            <p><strong>Order ID:</strong> #${id.substring(0, 8)}</p>
            <p><strong>Delivery Address:</strong> ${customer_info.address}</p>
            
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Price</th>
                  <th style="text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
                <tr>
                  <td colspan="3" style="padding: 8px; text-align: right;"><strong>Delivery Fee:</strong></td>
                  <td style="padding: 8px; text-align: right;">$2.99</td>
                </tr>
                <tr class="total-row">
                  <td colspan="3" style="padding: 8px; text-align: right;"><strong>Total:</strong></td>
                  <td style="padding: 8px; text-align: right;">$${total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            
            <h3>Delivery Information</h3>
            <p>Your order should arrive in approximately 30-45 minutes.</p>
            <p>If you have any questions about your order, please contact us at support@tastydelivery.com or call (555) 123-4567.</p>
            
            <p>Enjoy your meal!</p>
            <p>The TastyDelivery Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} TastyDelivery. All rights reserved.</p>
            <p>This email was sent to ${customer_info.email}</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  return transporter.sendMail(mailOptions);
}

/**
 * Send an order notification email to the admin/restaurant
 * @param {Object} order - The order object
 */
async function sendAdminEmail(order) {
  const { customer_info, items, total, id } = order;
  
  // Format the order items for email
  const itemsList = items.map(item => 
    `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`
  ).join('');
  
  // Email content for admin
  const mailOptions = {
    from: `"TastyDelivery Orders" <${process.env.EMAIL_FROM}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Order #${id.substring(0, 8)} Received`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Notification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
          }
          .container {
            padding: 20px;
          }
          .header {
            background-color: #333;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .content {
            padding: 20px;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 5px 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th {
            background-color: #f2f2f2;
            text-align: left;
            padding: 10px 8px;
          }
          .customer-info {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
          .total-row {
            font-weight: bold;
            background-color: #f9f9f9;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Order Received</h1>
          </div>
          <div class="content">
            <h2>Order #${id.substring(0, 8)}</h2>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            
            <div class="customer-info">
              <h3>Customer Information</h3>
              <p><strong>Name:</strong> ${customer_info.name}</p>
              <p><strong>Email:</strong> ${customer_info.email}</p>
              <p><strong>Phone:</strong> ${customer_info.phone}</p>
              <p><strong>Delivery Address:</strong> ${customer_info.address}</p>
              <p><strong>Notes:</strong> ${customer_info.deliveryNotes || 'None'}</p>
            </div>
            
            <h3>Order Details</h3>
            <table>
