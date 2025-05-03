# Food Delivery Web Application

A responsive food delivery website built with Next.js that enables customers to browse menu items, place orders, and receive email confirmations. This project features a clean UI, responsive design, order management, and integrates with Supabase for data storage and SendGrid for email notifications.

## Features

- **Responsive Design**: Works on all device sizes with a mobile-friendly navigation
- **Menu Management**: Browse items by category
- **Shopping Cart**: Add/remove items, adjust quantities
- **Order Processing**: Complete checkout form with validation
- **Order Confirmation**: Confirmation page with order details
- **Email Notifications**: Automated emails for customers and restaurant
- **Database Storage**: Orders stored in Supabase

## Tech Stack

- **Frontend**: Next.js, React
- **Database**: Supabase (PostgreSQL)
- **Email Service**: SendGrid
- **Styling**: CSS-in-JS with styled-jsx
- **Form Validation**: Custom form validation

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm (v6 or later) or yarn
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/food-delivery-app.git
   cd food-delivery-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # Supabase configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # SendGrid configuration
   SENDGRID_API_KEY=your_sendgrid_api_key
   SENDGRID_FROM_EMAIL=your_verified_email@yourdomain.com
   SENDGRID_FROM_NAME=JJ
   ADMIN_EMAIL=admin@yourdomain.com
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Supabase Setup Guide

### 1. Create a Supabase Account

1. Go to [Supabase](https://supabase.com/) and sign up for an account
2. Create a new project
3. Take note of your project URL and anon key (found in Project Settings > API)

### 2. Set Up Database Tables

Run the following SQL in the Supabase SQL Editor:

```sql
-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_info JSONB NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for orders table
CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();
```

### 3. Local Development with Supabase (Optional)

If you want to use Supabase locally:

1. Install the Supabase CLI:
   ```bash
   # Using npm
   npx supabase
   ```

2. Start Supabase locally:
   ```bash
   npx supabase start
   ```

3. Update your environment variables to use the local instance.

## SendGrid Setup Guide

### 1. Create a SendGrid Account

1. Go to [SendGrid](https://sendgrid.com/) and sign up for an account
2. Complete the verification process

### 2. Create an API Key

1. Log in to your SendGrid dashboard
2. Navigate to Settings > API Keys
3. Click "Create API Key"
4. Name your key (e.g., "Food Delivery App")
5. Select "Full Access" or customize permissions (minimum: "Mail Send")
6. Copy and save your API key securely

### 3. Verify a Sender Identity

Before sending emails, you need to verify your sender identity:

1. Go to Settings > Sender Authentication
2. Choose either "Single Sender Verification" or "Domain Authentication"
3. Follow the verification steps completely

### 4. Test Your SendGrid Integration

1. Update your `.env.local` file with your SendGrid credentials
2. Send a test email using the API:
   ```bash
   curl -X POST http://localhost:3000/api/test-email -H "Content-Type: application/json" -d '{"email":"your-email@example.com"}'
   ```

## Project Structure

```
food-delivery-app/
├── components/          # Reusable UI components
│   ├── CategoryFilter.js
│   ├── FoodCard.js
│   ├── FoodGrid.js
│   ├── Footer.js
│   ├── Layout.js
│   ├── Navbar.js
│   └── OrderForm.js
├── data/                # Static data
│   └── menu-items.js    # Sample menu items
├── pages/               # Next.js pages
│   ├── api/             # API routes
│   │   ├── orders.js    # Order processing and emails
│   │   └── test-email.js
│   ├── _app.js          # Next.js app wrapper
│   ├── index.js         # Home page
│   ├── menu.js          # Menu page
│   └── order-confirmation.js
├── public/              # Static assets
│   └── images/          # Food images
├── styles/              # Global styles
│   └── globals.css
├── utils/               # Utility functions
│   ├── sendgrid.js      # Email functions
│   └── supabase.js      # Database connection
├── .env.local           # Environment variables (not in repo)
├── package.json
└── README.md
```

## Usage

### Adding Menu Items

Edit the `data/menu-items.js` file to add, modify, or remove menu items:

```javascript
export const menuItems = [
  {
    id: 1,
    name: "Item Name",
    description: "Item description",
    price: 9.99,
    image: "/images/item-image.jpg",
    category: "category-id"
  },
  // Add more items...
];

export const categories = [
  { id: "all", name: "All Items" },
  { id: "category-id", name: "Category Name" },
  // Add more categories...
];
```

### Customizing Email Templates

To customize the email templates, edit the HTML in the `utils/sendgrid.js` file.

## Deployment

### Deploy to Vercel

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com/) and import the repository
3. Add your environment variables
4. Deploy

### Deploy to Netlify

1. Push your code to a GitHub repository
2. Go to [Netlify](https://www.netlify.com/) and import the repository
3. Add your environment variables
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Next.js team for the amazing framework
- Supabase for the easy-to-use database
- SendGrid for reliable email service

## Troubleshooting

### Supabase Connection Issues

- Check your Supabase URL and anon key
- Ensure your IP isn't blocked by Supabase
- Verify table structure matches the expected schema

### SendGrid Email Issues

- Verify your sender email is properly authenticated
- Check that your API key has "Mail Send" permissions
- Look for detailed error messages in the console
- New accounts may have sending limitations

### Common Errors

- **403 Forbidden with SendGrid**: Usually means the sender is not verified or the API key doesn't have proper permissions
- **Database errors**: Ensure your Supabase tables have the correct structure
- **Missing environment variables**: Double-check your `.env.local` file

## Contact

For questions or support, please email [your-email@example.com]
