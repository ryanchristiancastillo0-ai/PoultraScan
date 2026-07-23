export function PageStyles() {
  return (
    <style>{`
      html { scroll-behavior: smooth; }
      @keyframes ps-scan-sweep {
        0%   { top: 6%; opacity: 0; }
        10%  { opacity: 1; }
        90%  { opacity: 1; }
        100% { top: 92%; opacity: 0; }
      }
      @keyframes ps-float {
        0%, 100% { transform: translateY(0px); }
        50%      { transform: translateY(-8px); }
      }
      .ps-scan-line { animation: ps-scan-sweep 3.2s ease-in-out infinite; }
      .ps-float { animation: ps-float 5s ease-in-out infinite; }

      .ps-reveal {
        opacity: 0;
        transform: translateY(28px);
        transition: opacity 0.7s ease, transform 0.7s ease;
      }
      .ps-reveal-visible {
        opacity: 1;
        transform: translateY(0);
      }

      @media (prefers-reduced-motion: reduce) {
        .ps-scan-line, .ps-float { animation: none; }
        .ps-reveal { opacity: 1; transform: none; transition: none; }
      }
    `}</style>
  );
}