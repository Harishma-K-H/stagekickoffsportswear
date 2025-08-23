import React, { useState } from "react";
import { Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

const Footer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Footer */}
      <footer className="bg-white text-black py-4 mt-auto border-t">
        <div className="container mx-auto text-center text-sm space-y-1">
          <p>
            Powered by <span className="font-semibold">SIGNROOTS</span>.{" "}
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-blue-600 hover:underline"
            >
              Contact Support
            </button>
          </p>
        </div>
      </footer>

      {/* Styled Support Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        closeIcon={<span className="text-white text-xl">×</span>} // custom white close icon
        className="!p-0 [&_.ant-modal-content]:rounded-xl [&_.ant-modal-content]:overflow-hidden [&_.ant-modal-content]:p-0 shadow-xl"
      >
        {/* Header */}
        <div className="bg-slate-600 text-white text-center px-6 py-4">
          <h2 className="text-xl font-semibold">Support & Service</h2>
          <p className="text-sm opacity-90">
            We’re here to help! Contact us using the details below.
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4 text-gray-700 text-sm">
           <p className="flex items-center gap-2">
            <FontAwesomeIcon icon={faPhone} className="text-slate-600" />
            <span className="font-semibold">Phone:</span> 0484-1234567
          </p>
          <p className="flex items-center gap-2">
            <FontAwesomeIcon icon={faWhatsapp} className="text-green-600" />
            <span className="font-semibold">WhatsApp:</span>{" "}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              +91 98765 43210
            </a>
          </p> 
          <p className="flex items-center gap-2">
            <span className="font-semibold">✉ Email:</span>{" "}
            <a
              href="mailto:support@signroots.com"
              className="text-blue-600 hover:underline"
            >
              support@signroots.com
            </a>
          </p>
        </div>
      </Modal>
    </>
  );
};

export default Footer;
