import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, title = 'Food Delivery' }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Food delivery service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="container">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
