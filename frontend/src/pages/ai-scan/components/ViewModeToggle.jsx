import { MdTableView, MdGridView, MdViewList, MdViewCarousel } from 'react-icons/md';

const VIEWS = [
  { key: 'table', icon: MdTableView, label: 'Table view' },
  { key: 'card', icon: MdGridView, label: 'Card view' },
  { key: 'list', icon: MdViewList, label: 'List view' },
  { key: 'carousel', icon: MdViewCarousel, label: 'Carousel view' },
];

export default function ViewModeToggle({ value, onChange }) {
  return (
    <div
      role="group"
      aria-label="View mode"
      className="inline-flex items-center gap-0.5 p-1 rounded-xl bg-[#E9F4EE] border border-[#DCF0E5]"
    >
      {VIEWS.map(({ key, icon: Icon, label }) => {
        const isActive = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={isActive}
            aria-label={label}
            title={label}
            className={`flex items-center justify-center w-9 h-8 rounded-lg transition-all duration-150 ${
              isActive
                ? 'bg-white text-[#14532D] shadow-card'
                : 'text-[#4B6357] hover:bg-white/70 hover:text-[#14532D]'
            }`}
          >
            <Icon className="text-lg" />
          </button>
        );
      })}
    </div>
  );
}