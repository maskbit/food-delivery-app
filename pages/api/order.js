// pages/api/orders.js
import { supabase } from '../../utils/supabase';
import { sendCustomerOrderConfirmation, sendAdminOrderNotification } from '../../utils/sendgrid';

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
      
      // Send emails asynchronously (don't await to speed up response)
      const emailPromises = [
        sendCustomerOrderConfirmation(newOrder),
        sendAdminOrderNotification(newOrder)
      ];
      
      // Handle any email sending errors without blocking the response
      Promise.all(emailPromises)
        .catch(emailError => {
          console.error('Error sending notification emails:', emailError);
          // Consider logging to an error tracking service
        });
      
      // Return the created order (don't wait for emails)
      res.status(201).json({ 
        success: true, 
        orderId: newOrder.id,
        message: 'Order placed successfully'
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
    // Same as before...
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
