// npm install @sendgrid/mail

// utils/email.js
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendOrderConfirmation(customerEmail, customerName, orderDetails, orderId) {
  const msg = {
    to: customerEmail,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: `Your TastyDelivery Order #${orderId}`,
    text: `Thank you for your order, ${customerName}!`,
    html: `
      <h1>Thank You for Your Order!</h1>
      <p>Hi ${customerName},</p>
      <p>We've received your order and are preparing it now.</p>
      
      <!-- Order details here -->
    `,
  };
  
  return sgMail.send(msg);
}

export async function sendNewOrderAlert(orderDetails, orderId) {
  const msg = {
    to: process.env.ADMIN_EMAIL,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: `New Order #${orderId}`,
    text: 'A new order has been placed.',
    html: `
      <h1>New Order Received!</h1>
      
      <!-- Order details here -->
    `,
  };
  
  return sgMail.send(msg);
}
