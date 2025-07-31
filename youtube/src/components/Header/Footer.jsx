import React from 'react';
import { FaInstagram,FaLinkedin,FaGithub } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-white py-4 text-center mt-8">
        <div className='flex gap-4 justify-center '>
            <a href="" className='w-12'><FaInstagram /></a>
            <a href="" className='w-12'><FaSquareXTwitter /></a>
            <a href="" className='w-12'><FaLinkedin /> </a>
            <a href="" className='w-12'><FaGithub /> </a>
            
        </div>
        
      <p className="text-sm">
        &copy; {new Date().getFullYear()} service connect. All rights reserved.
      </p>
    </footer>
  );
}