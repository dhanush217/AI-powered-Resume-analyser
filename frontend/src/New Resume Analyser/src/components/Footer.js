import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
<footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section about">
          <h3>Resume Scorer</h3>
          <p>Advanced AI-powered resume analysis tool that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS) and improve hiring chances.</p>
          <div className="social-icons">
            <a href="#!" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#!" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            <a href="#!" aria-label="GitHub"><i className="fab fa-github"></i></a>
          </div>
        </div>
        
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#!">How It Works</a></li>
            <li><a href="#!">Pricing</a></li>
            <li><a href="#!">Privacy Policy</a></li>
            <li><a href="#!">Terms of Service</a></li>
          </ul>
        </div>
        
        <div className="footer-section contact">
          <h3>Contact</h3>
          <p><i className="fas fa-map-marker-alt"></i> 123 Career Lane, Tech City</p>
          <p><i className="fas fa-envelope"></i> support@resumescorer.com</p>
          <p><i className="fas fa-phone"></i> +1 (555) 123-4567</p>
        </div>
      </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Resume Scorer. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#!">Privacy</a>
          <a href="#!">Terms</a>
          <a href="#!">Sitemap</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
