import React, { useState } from "react";
import { Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faPhone,faEnvelope  } from "@fortawesome/free-solid-svg-icons";

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

<div className="px-6 py-6 space-y-4 text-gray-700">
  {/* Phone */}
  <p className="flex items-center gap-3">
    <FontAwesomeIcon icon={faPhone} className="text-slate-600 w-5 h-5" />
    <span className="text-base">04885 211331</span>
  </p>

  {/* WhatsApp */}
  <p className="flex items-center gap-3">
    <FontAwesomeIcon icon={faWhatsapp} className="text-green-600 w-5 h-5" />
    <a
      href="https://wa.me/919447232332"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline text-base"
    >
      +91 9447232332
    </a>
  </p>

  {/* Email */}
  <p className="flex items-center gap-3">
    <FontAwesomeIcon icon={faEnvelope} className="text-slate-600 w-5 h-5" />
    <a
      href="mailto:support@signroots.com"
      className="text-blue-600 hover:underline text-base"
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
