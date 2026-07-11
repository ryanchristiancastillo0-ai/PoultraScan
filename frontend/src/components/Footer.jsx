import { useState } from 'react';
import { MdClose, MdEmail } from 'react-icons/md';

import { FeedbackModal } from './index'

const SUPPORT_EMAIL = 'louigiecastillo1009@gmail.com';

// ---------- Reusable Info Modal ----------
function InfoModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <style>{`
        @keyframes info-backdrop { from { opacity: 0; } to { opacity: 1; } }
        @keyframes info-pop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .info-backdrop { animation: info-backdrop 0.2s ease-out; }
        .info-pop { animation: info-pop 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>

      <div className="info-backdrop absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="info-pop relative w-full max-w-lg max-h-[80vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] flex-shrink-0">
          <h2 className="text-base font-bold text-[#111827]">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-full text-[#9CA3AF] hover:bg-[#F7F8F5] hover:text-[#111827] transition-colors"
          >
            <MdClose className="text-lg" />
          </button>
        </div>

        <div className="px-5 py-4 overflow-y-auto text-sm text-[#4B5563] leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

// ---------- Terms of Service content ----------
function TermsOfServiceContent() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-[#9CA3AF]">Last Updated: July 9, 2026</p>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">1. Acceptance of Terms</h3>
        <p>
          By creating an account or using PoultraScan AI ("the Service," "we," "us," or "our"), you
          agree to be bound by these Terms of Service. If you do not agree to these terms, please do
          not use the Service.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">2. Description of Service</h3>
        <p className="mb-2">PoultraScan AI is a poultry health diagnostic and farm management application. The Service allows users to:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Create and manage one or more poultry farms</li>
          <li>Capture or upload images of chickens for AI-assisted analysis</li>
          <li>Receive AI-generated estimates regarding chicken count, disease indicators, weight, oil yield, and market readiness</li>
          <li>Maintain scan history, farm journals, and related records tied to their account</li>
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">3. Eligibility and Accounts</h3>
        <p>
          You must provide accurate and complete information when registering for an account,
          including a valid email address. You are responsible for maintaining the confidentiality
          of your login credentials and for all activity that occurs under your account. You must
          notify us promptly if you suspect unauthorized access to your account.
        </p>
        <p className="mt-2">
          You may register using an email and password, or through Google Sign-In. If you register
          via Google, certain profile information (such as your name and profile picture) may be
          used to populate your account.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">4. AI-Generated Results Are Estimates, Not Veterinary Diagnoses</h3>
        <p className="font-semibold text-[#111827] mb-2">This is the most important section of these Terms.</p>
        <p className="mb-2">
          PoultraScan AI uses artificial intelligence to analyze images of poultry and generate
          estimates related to disease indicators, weight, oil yield, and market readiness. These
          results are automated estimates only and:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1 mb-2">
          <li>Are <strong>not</strong> a substitute for examination, diagnosis, or treatment by a licensed veterinarian or qualified poultry health professional</li>
          <li>May be inaccurate, incomplete, or wrong, particularly in cases involving atypical lighting, image quality, flock density, or breed variation</li>
          <li>Should not be the sole basis for decisions involving flock culling, medical treatment, quarantine, or market sale, especially for sick, high-value, or large-scale commercial flocks</li>
        </ul>
        <p>
          If a scan indicates signs of illness or abnormality, you should confirm findings with a
          licensed veterinarian before taking action. You assume full responsibility for decisions
          made based on Service output, and we are not liable for losses (financial, agricultural,
          or otherwise) resulting from reliance on AI-generated results.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">5. User Content</h3>
        <p>
          "User Content" includes images, farm data, journal entries, and any other information you
          upload or input into the Service. You retain ownership of your User Content. By uploading
          User Content, you grant us a limited license to store, process, and analyze it solely for
          the purpose of providing and improving the Service.
        </p>
        <p className="mt-2">
          You are responsible for ensuring you have the right to upload any images or data you
          submit. Do not upload content that is unlawful, infringes on third-party rights, or
          contains sensitive personal information unrelated to poultry management.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">6. Acceptable Use</h3>
        <p className="mb-2">You agree not to:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Use the Service for any unlawful purpose or in violation of applicable agricultural, food safety, or animal welfare regulations</li>
          <li>Attempt to reverse-engineer, disrupt, or gain unauthorized access to the Service's underlying systems, models, or infrastructure</li>
          <li>Upload malicious files or attempt to interfere with other users' accounts or data</li>
          <li>Misrepresent AI-generated results as certified veterinary or regulatory findings</li>
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">7. Data Storage and Farm/Account Scoping</h3>
        <p>
          Scan results, images, and cached data are associated with your specific user account and
          the farm you select at the time of scanning. Deleting a farm or account may result in
          permanent loss of associated scan history, images, and journal entries. We recommend
          exporting or backing up important records before deleting a farm.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">8. Service Availability</h3>
        <p>
          The Service, including AI analysis features, depends on third-party infrastructure and may
          occasionally be unavailable, degraded, or rate-limited. We do not guarantee uninterrupted
          access and are not liable for losses resulting from downtime, processing delays, or
          third-party service outages.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">9. Limitation of Liability</h3>
        <p>
          To the maximum extent permitted by law, PoultraScan AI and its developers shall not be
          liable for any indirect, incidental, special, or consequential damages — including loss of
          livestock, revenue, or business opportunity — arising from your use of, or inability to
          use, the Service, including reliance on AI-generated diagnostic results.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">10. Changes to the Service and Terms</h3>
        <p>
          We may update these Terms from time to time. Continued use of the Service after changes
          are posted constitutes acceptance of the revised Terms. We may also modify, suspend, or
          discontinue features of the Service at our discretion.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">11. Termination</h3>
        <p>
          We reserve the right to suspend or terminate accounts that violate these Terms, engage in
          abusive behavior, or misuse the Service in a way that harms other users or the platform.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">12. Contact</h3>
        <p>
          If you have questions about these Terms, please reach out through the Contact Support
          option within the app.
        </p>
      </section>
    </div>
  );
}

// ---------- Privacy Policy content ----------
function PrivacyPolicyContent() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-[#9CA3AF]">Last Updated: July 9, 2026</p>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">1. Introduction</h3>
        <p>
          This Privacy Policy explains how PoultraScan AI ("the Service," "we," "us," or "our")
          collects, uses, stores, and protects your information when you use our poultry health
          diagnostic application. By using the Service, you agree to the practices described in this
          policy.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">2. Information We Collect</h3>
        <p className="mb-2">
          <strong>Account Information.</strong> When you register, we collect your full name,
          username, email address, and password (stored as a securely hashed value, never in plain
          text). If you sign in with Google, we collect the name, email address, and profile picture
          associated with your Google account.
        </p>
        <p className="mb-2">
          <strong>Farm and Scan Data.</strong> We collect information you provide about your farms,
          including farm names and optional farm images. We also collect the images you capture or
          upload during a scan, along with the AI-generated results derived from them — including
          chicken counts, detected bounding boxes, disease classifications, severity levels,
          estimated weight, estimated oil yield, and market-readiness status.
        </p>
        <p className="mb-2">
          <strong>Journal and Activity Data.</strong> If you use the farm journal feature, we store
          the entries you create. We also log certain account activity, such as login and logout
          events, for security and notification purposes.
        </p>
        <p>
          <strong>Technical Information.</strong> We may collect limited technical data necessary to
          operate the Service, such as session identifiers stored in an HTTP-only authentication
          cookie. This cookie is used solely to keep you logged in and is not accessible to other
          websites or scripts.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">3. How We Use Your Information</h3>
        <p className="mb-2">We use the information we collect to:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Create and maintain your account</li>
          <li>Associate your farms, scans, and journal entries with your account so only you can access them</li>
          <li>Run AI analysis on submitted images to generate health, weight, and yield estimates</li>
          <li>Send account-related notifications, such as login confirmations</li>
          <li>Maintain and improve the accuracy and reliability of the Service</li>
          <li>Detect, investigate, and prevent misuse, fraud, or unauthorized access</li>
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">4. How Your Images Are Processed</h3>
        <p>
          Images submitted for scanning are processed through our detection and prediction pipeline,
          which may include analysis by third-party AI services for disease classification. Images
          are cropped and analyzed on a per-chicken basis. We do not sell your images or scan data to
          third parties, and we do not use your farm images to train models for other users' benefit
          without your consent.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">5. Data Storage and Retention</h3>
        <p className="mb-2">
          Your account information, farm data, scan history, and journal entries are stored in our
          database and remain associated with your account until you delete them or close your
          account. Scan results and cached previews may also be temporarily stored on your own device
          (locally, in your browser) to improve loading performance, scoped specifically to your
          account and the farm selected at the time of the scan.
        </p>
        <p>
          If you delete a farm, associated scans, images, and journal entries tied to that farm may
          be permanently removed and cannot be recovered. We recommend backing up any records you
          wish to keep before deleting a farm.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">6. Data Sharing</h3>
        <p className="mb-2">
          We do not sell your personal information or farm data. We may share limited information
          with third-party service providers strictly to operate the Service, such as:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1 mb-2">
          <li>AI processing providers, to generate disease classification and health insights from submitted images</li>
          <li>Google, if you choose to register or sign in using Google authentication</li>
        </ul>
        <p>
          We do not share your data with advertisers, data brokers, or unrelated third parties.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">7. Data Security</h3>
        <p>
          We take reasonable technical measures to protect your information, including password
          hashing, HTTP-only authentication cookies, and access controls that scope your data to your
          account. However, no method of electronic storage or transmission is completely secure, and
          we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">8. Your Choices and Rights</h3>
        <p className="mb-2">
          You may update your account information, delete farms, scans, or journal entries, or
          request account deletion at any time through the app or by contacting support. If you
          registered via Google, you may also revoke the Service's access through your Google account
          settings.
        </p>
        <p>
          You may use the password reset feature at any time if you lose access to your account.
          Reset codes are time-limited and single-use for your security.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">9. Children's Privacy</h3>
        <p>
          The Service is not intended for use by children, and we do not knowingly collect personal
          information from children. If we become aware that a child has provided us with personal
          information, we will take steps to delete it.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">10. Third-Party Sign-In</h3>
        <p>
          If you use "Sign in with Google," Google's own privacy policy governs the information
          Google collects during that process. We only receive and store the specific profile fields
          necessary to create or match your account (name, email, and profile picture).
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">11. Changes to This Privacy Policy</h3>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or
          for legal and operational reasons. Continued use of the Service after changes are posted
          constitutes acceptance of the updated policy.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-bold text-[#111827] mb-1">12. Contact Us</h3>
        <p>
          If you have questions or concerns about this Privacy Policy or how your data is handled,
          please reach out through the Contact Support option within the app.
        </p>
      </section>
    </div>
  );
}

// ---------- Contact Support content ----------
function ContactSupportContent() {
  return (
    <div className="flex flex-col gap-4">
      <p>
        Need help with your account, a scan result, or something isn't working as expected? Reach
        out and we'll get back to you as soon as possible.
      </p>

      
       <a href={`mailto:${SUPPORT_EMAIL}`}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#EAF2EC] border border-[#CFE2D4] hover:bg-[#DFEDE3] transition-colors"
      >
        <span className="w-9 h-9 rounded-full bg-[#2F5D3A] flex items-center justify-center flex-shrink-0">
          <MdEmail className="text-white text-lg" />
        </span>
        <div className="flex flex-col min-w-0">
          <span className="text-xs text-[#6B7280] font-medium">Email us at</span>
          <span className="text-sm font-bold text-[#2F5D3A] break-all">{SUPPORT_EMAIL}</span>
        </div>
      </a>

      <p className="text-xs text-[#9CA3AF]">
        For faster help, include your account email and a brief description of the issue you're
        experiencing.
      </p>
    </div>
  );
}
// ---------- Footer ----------
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
      <footer className="w-full mb-15 lg:mb-0 bg-white border-t border-[#E5E7EB] mt-10">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 sm:py-10 flex flex-col sm:flex-row justify-between items-center sm:items-center gap-5 sm:gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="text-sm font-bold text-[#111827] tracking-tight">PoultraScan AI</span>
            <span className="text-xs text-[#6B7280]">
              © {new Date().getFullYear()} All rights reserved.
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
                className="text-sm font-medium text-[#6B7280] hover:text-[#2F5D3A] transition-colors"
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