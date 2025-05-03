// pages/test-db.js
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export default function TestDB() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('');

  useEffect(() => {
    async function testConnection() {
      try {
        // Correct way to get count in Supabase JS client
        const { count, error } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        
        setConnectionStatus(`Connected successfully! Found ${count} orders.`);
      } catch (error) {
        console.error('Error connecting to Supabase:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    testConnection();
  }, []);

  return (
    <div>
      <h1>Supabase Connection Test</h1>
      {loading ? (
        <p>Testing connection...</p>
      ) : error ? (
        <div>
          <p>Error connecting to Supabase:</p>
          <pre>{error}</pre>
        </div>
      ) : (
        <p>{connectionStatus}</p>
      )}
    </div>
  );
}
