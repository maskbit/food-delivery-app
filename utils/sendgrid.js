// utils/sendgrid.js
import sgMail from '@sendgrid/mail';

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send a customer order confirmation email
 * @param {Object} order - The order details
 * @returns {Promise} - SendGrid API response
 */
export async function sendCustomerOrderConfirmation(order) {
  const { customer_info, items, total, id } = order;
  
  // Format order items for the email
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');
  
  // Calculate delivery fee and subtotal
  const subtotal = total - 2.99;
  
  const msg = {
    to: customer_info.email,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: process.env.SENDGRID_FROM_NAME
    },
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
                ${itemsHtml}
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
  
  return sgMail.send(msg);
}

/**
 * Send a notification email to the admin/restaurant
 * @param {Object} order - The order details
 * @returns {Promise} - SendGrid API response
 */
export async function sendAdminOrderNotification(order) {
  const { customer_info, items, total, id } = order;
  
  // Format order items for the email
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');
  
  const msg = {
    to: process.env.ADMIN_EMAIL,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: 'TastyDelivery Orders'
    },
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
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr>
                  <td colspan="2" style="padding: 8px; text-align: right;"><strong>Delivery Fee:</strong></td>
                  <td style="padding: 8px; text-align: right;">$2.99</td>
                </tr>
                <tr class="total-row">
                  <td colspan="2" style="padding: 8px; text-align: right;"><strong>Total:</strong></td>
                  <td style="padding: 8px; text-align: right;">$${total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            
            <p>Please prepare this order for delivery as soon as possible.</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${id}" style="color: #ff4500;">View order details in the admin dashboard</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  return sgMail.send(msg);
}
