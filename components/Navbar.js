import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link href="/" className="logo">
          JJ Biryani 
        </Link>
        <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className={isMenuOpen ? "open" : ""}></div>
        </div>
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/menu">Menu</Link>
          </li>
        </ul>
      </div>
      <style jsx>{`
        .navbar {
          background: var(--dark-color);
          color: #fff;
          height: 70px;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
        }
        
        .logo {
          font-size: 1.8rem;
          font-weight: bold;
          color: var(--primary-color);
        }
        
        .nav-links {
          display: flex;
        }
        
        .nav-links li {
          padding: 0 15px;
        }
        
        .nav-links li a {
          color: #fff;
          font-size: 1.1rem;
        }
        
        .menu-icon {
          display: none;
          cursor: pointer;
        }
        
        @media (max-width: 768px) {
          .menu-icon {
            display: block;
            position: relative;
            width: 30px;
            height: 22px;
          }
          
          .menu-icon div, .menu-icon div::before, .menu-icon div::after {
            content: '';
            background-color: #fff;
            position: absolute;
            height: 4px;
            width: 100%;
            transition: all 0.3s ease;
          }
          
          .menu-icon div {
            top: 9px;
          }
          
          .menu-icon div::before {
            transform: translateY(-9px);
          }
          
          .menu-icon div::after {
            transform: translateY(9px);
          }
          
          .menu-icon div.open {
            background: transparent;
          }
          
          .menu-icon div.open::before {
            transform: rotate(45deg);
          }
          
          .menu-icon div.open::after {
            transform: rotate(-45deg);
          }
          
          .nav-links {
            position: fixed;
            top: 70px;
            left: -100%;
            right: 0;
            bottom: 0;
            width: 100%;
            flex-direction: column;
            background: var(--dark-color);
            align-items: center;
            padding-top: 20px;
            transition: left 0.3s ease;
          }
          
          .nav-links.active {
            left: 0;
          }
          
          .nav-links li {
            padding: 15px 0;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
