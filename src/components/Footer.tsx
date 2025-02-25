import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import InfoModal from './InfoModal';

const QUICK_LINKS_INFO = {
  home: {
    title: "Welcome to EventTix",
    message: "Welcome to our platform! Explore the latest events and book your tickets now."
  },
  events: {
    title: "Events",
    message: "Browse through a variety of exciting events happening near you!"
  },
  about: {
    title: "About Us",
    message: "Learn more about our mission, vision, and what makes us the best ticketing platform."
  },
  contact: {
    title: "Contact Us",
    message: "Need help? Reach out to us via email or phone—we're here for you!"
  },
  faq: {
    title: "FAQ",
    message: "Find answers to common questions about ticket bookings, payments, and more."
  },
  terms: {
    title: "Terms of Service",
    message: "By using our platform, you agree to our Terms of Service. Read them carefully."
  },
  privacy: {
    title: "Privacy Policy",
    message: "Your privacy matters to us. Learn how we protect your data."
  },
  refund: {
    title: "Refund Policy",
    message: "Check our refund policy to understand the process for cancellations and refunds."
  }
};

const Footer = () => {
  const [modalInfo, setModalInfo] = useState<{ title: string; message: string } | null>(null);

  const handleLinkClick = (key: keyof typeof QUICK_LINKS_INFO) => {
    setModalInfo(QUICK_LINKS_INFO[key]);
  };

  return (
    <>
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EventTix</h3>
              <p className="text-gray-400">
                Your one-stop destination for booking event tickets and creating unforgettable experiences.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => handleLinkClick('home')} className="text-gray-400 hover:text-white">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('events')} className="text-gray-400 hover:text-white">
                    Events
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('about')} className="text-gray-400 hover:text-white">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('contact')} className="text-gray-400 hover:text-white">
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => handleLinkClick('faq')} className="text-gray-400 hover:text-white">
                    FAQ
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('terms')} className="text-gray-400 hover:text-white">
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('privacy')} className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLinkClick('refund')} className="text-gray-400 hover:text-white">
                    Refund Policy
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Youtube className="w-6 h-6" />
                </a>
              </div>
              <div className="mt-4">
                <a href="mailto:contact@eventtix.com" className="flex items-center text-gray-400 hover:text-white">
                  <Mail className="w-5 h-5 mr-2" />
                  contact@eventtix.com
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} EventTix. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <InfoModal
        isOpen={modalInfo !== null}
        onClose={() => setModalInfo(null)}
        title={modalInfo?.title || ''}
        message={modalInfo?.message || ''}
      />
    </>
  );
};

export default Footer;