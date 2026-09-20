import { useState } from 'react';
import { MdClose, MdEmail } from 'react-icons/md';

import { FeedbackModal,ContactSupportContent,InfoModal,PrivacyPolicyContent,TermsOfServiceContent } from './index'
export default function Footer() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [activeInfo, setActiveInfo] = useState(null); // null | 'privacy' | 'terms' | 'support'

  const links = [
    { label: 'Privacy Policy', action: () => setActiveInfo('privacy') },
    { label: 'Terms of Service', action: () => setActiveInfo('terms') },
    { label: 'Contact Support', action: () => setActiveInfo('support') },
    { label: 'Feedback', action: () => setFeedbackOpen(true) },
  ];

  return (
    <>
      <footer className="w-full mb-15 lg:mb-0 bg-white border-t border-[#E4ECE7] mt-10">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 sm:py-10 flex flex-col sm:flex-row justify-between items-center sm:items-center gap-5 sm:gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="text-sm font-bold text-[#10231A] tracking-tight">PoultraScan AI</span>
            <span className="text-xs text-[#4B6357]">
              Â© {new Date().getFullYear()} All rights reserved.
            </span>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {links.map(({ label, action }) => (

                <a  key={label}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  action();
                }}
                className="text-sm font-medium text-[#4B6357] hover:text-[#14532D] transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </footer>

      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

      <InfoModal
        isOpen={activeInfo === 'privacy'}
        onClose={() => setActiveInfo(null)}
        title="Privacy Policy"
      >
        <PrivacyPolicyContent />
      </InfoModal>

      <InfoModal
        isOpen={activeInfo === 'terms'}
        onClose={() => setActiveInfo(null)}
        title="Terms of Service"
      >
        <TermsOfServiceContent />
      </InfoModal>

      <InfoModal
        isOpen={activeInfo === 'support'}
        onClose={() => setActiveInfo(null)}
        title="Contact Support"
      >
        <ContactSupportContent />
      </InfoModal>
    </>
  );
}