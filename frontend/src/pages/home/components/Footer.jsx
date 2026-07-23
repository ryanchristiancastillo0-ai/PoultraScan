
import {
  MdBiotech,
} from 'react-icons/md';

export default function Footer() {
  return (
    <footer className="border-t border-[#D8D7D2]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-[#006F4E] flex items-center justify-center text-white">
            <MdBiotech className="text-sm" />
          </span>
          <span className="text-sm font-bold text-[#2C3E50]">PoultraScan AI</span>
        </div>
        <p className="text-xs text-[#2C3E50]/50">© {new Date().getFullYear()} PoultraScan AI. All rights reserved.</p>
      </div>
    </footer>
  );
}