import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-white py-4 text-center mt-8">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} RK FixIt. All rights reserved.
      </p>
    </footer>
  );
}
