const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} JJ Biryani. All rights reserved.</p>
      </div>
      <style jsx>{`
        .footer {
          background: var(--dark-color);
          color: #fff;
          text-align: center;
          padding: 20px 0;
          margin-top: 40px;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
