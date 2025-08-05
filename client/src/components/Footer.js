import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  CodeBracketIcon, 
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-50 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">5</span>
              </div>
              <h3 className="text-xl font-bold">50cube Platform</h3>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Interactive learning platform with gamified systems. Empowering users through 
              credit-based rewards and comprehensive analytics.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <CodeBracketIcon className="h-4 w-4" />
                <span>MERN Stack</span>
              </div>
              <div className="flex items-center gap-1">
                <GlobeAltIcon className="h-4 w-4" />
                <span>React + Node.js</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
                             <li>
                 <Link 
                   to="/" 
                   className="text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-50 rounded"
                 >
                   Home
                 </Link>
               </li>
                             <li>
                 <Link 
                   to="/merch" 
                   className="text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-50 rounded"
                 >
                   Merch Store
                 </Link>
               </li>
                             <li>
                 <Link 
                   to="/admin/metrics" 
                   className="text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-50 rounded"
                 >
                   Admin Metrics
                 </Link>
               </li>
                             <li>
                 <Link 
                   to="/admin/lanes" 
                   className="text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-50 rounded"
                 >
                   Impact Console
                 </Link>
               </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <EnvelopeIcon className="h-4 w-4 text-blue-600" />
                                 <a 
                   href="mailto:contact@50cube.com" 
                   className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-50 rounded"
                 >
                   contact@50cube.com
                 </a>
              </li>
                             <li className="flex items-center gap-2">
                 <PhoneIcon className="h-4 w-4 text-blue-600" />
                                  <a 
                    href="tel:+919955044761" 
                    className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-50 rounded"
                  >
                    +91 99550 44761
                  </a>
               </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-300 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">
              © {currentYear} 50cube Platform. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
                             <a 
                 href="#" 
                 className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-50 rounded"
               >
                 Privacy Policy
               </a>
               <a 
                 href="#" 
                 className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-50 rounded"
               >
                 Terms of Service
               </a>
              <div className="flex items-center gap-1">
                <span>Made with</span>
                <HeartIcon className="h-4 w-4 text-red-500" />
                <span>using MERN Stack</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 