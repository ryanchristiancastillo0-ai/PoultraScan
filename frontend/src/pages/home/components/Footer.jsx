
import {
  MdBiotech,
} from 'react-icons/md';

export default function Footer() {
  return (
    <footer className="border-t border-[#E4ECE7]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#14532D] to-[#166534] flex items-center justify-center text-white shadow-sm">
            <MdBiotech className="text-sm" />
          </span>
          <span className="text-sm font-bold text-[#10231A]">PoultraScan</span>
        </div>
        <p className="text-xs text-[#10231A]/50">Â© {new Date().getFullYear()} PoultraScan. All rights reserved.</p>
      </div>
    </footer>
  );
}