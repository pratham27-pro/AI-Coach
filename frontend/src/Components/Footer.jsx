'use client'
import React from 'react';
import { useState } from 'react'
import img from "/fotu.png"
import { Routes, Route, useNavigate, Link } from "react-router-dom";

import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {

  const navigate = useNavigate();

  function home() {
    navigate("/");
  };

  function price() {
    navigate("/price");
  };

  function about() {
    navigate("/about");
  };

  function pg() {
    navigate("/pg");
  };

  
  

  return (
    <footer className="bg-white-800 text-gray py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Company Logo */}
          <div className="flex flex-col items-center md:items-center">
            <img
              src={img}
              alt="Company Logo"
              className="h-12 mb-4"
            />
            <p className="text-gray-400">
              We list the PGs only after reviewing them and we send our agents to visit the site location as well. We try to make this endevour of finding a PG easier and more trustable for students.
            </p>
          </div>

          {/* Column 2: Useful Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Useful Links</h3>
            <ul>
              <li><a onClick={home} className="text-gray-400 hover:text-black">Home</a></li>
              <li><a onClick={about} className="text-gray-400 hover:text-black">About</a></li>
              <li><a onClick={pg} className="text-gray-400 hover:text-black">Find PGs</a></li>
              <li><a onClick={price} className="text-gray-400 hover:text-black">Price</a></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul>
              <li><a href="#" className="text-gray-400 hover:text-black">Consulting</a></li>
              <li><a href="#" className="text-gray-400 hover:text-black">Design</a></li>
              <li><a href="#" className="text-gray-400 hover:text-black">Development</a></li>
              <li><a href="#" className="text-gray-400 hover:text-black">Support</a></li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul>
              <li className="text-gray-400 mb-2">1234 Street Name, City, State, 56789</li>
              <li className="text-gray-400 mb-2">Email: <a href="mailto:info@example.com" className="hover:text-black">info@example.com</a></li>
              <li className="text-gray-400 mb-2">Phone: <a href="tel:+1234567890" className="hover:text-black">999999999</a></li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-black"><FaFacebookF size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-black"><FaTwitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-black"><FaInstagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-black"><FaLinkedinIn size={20} /></a>
            </div>
          </div>
        </div>
        <div className="text-center text-gray-400 mt-8">
          <p>&copy; 2024 Upcharya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;