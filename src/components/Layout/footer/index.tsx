import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-4 mt-auto">
      <div className="container mx-auto text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Kickoff Sportswear. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
