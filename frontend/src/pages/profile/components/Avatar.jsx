import { MdCameraAlt } from 'react-icons/md';
import { resolveAvatarSrc } from '../../../utils/AvatarSrc';
import { AVATAR_ICONS, isIconAvatar, getIconKey } from '../../../utils/avatarIcons';

export default function Avatar({ fullname, avatarUrl, size = 'w-24 h-24', onClick, uploading }) {
  const initials = fullname
    ? fullname
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('')
    : '?';

  const isIcon = isIconAvatar(avatarUrl);
  const iconKey = getIconKey(avatarUrl);
  const IconEntry = isIcon ? AVATAR_ICONS[iconKey] : null;
  const src = !isIcon ? resolveAvatarSrc(avatarUrl) : null;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`${size} rounded-full bg-[#EAF2EC] text-[#2F5D3A] flex items-center justify-center text-2xl font-semibold flex-shrink-0 ring-4 ring-white shadow-sm overflow-hidden relative ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {IconEntry ? (
        <IconEntry.Icon className="w-[70%] h-[70%]" />
      ) : src ? (
        <img
          src={src}
          alt={fullname || 'Profile'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        initials
      )}

      {onClick && (
        <span className="absolute inset-0 bg-[#111827]/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <MdCameraAlt className="text-white text-xl" />
        </span>
      )}

      {uploading && (
        <span className="absolute inset-0 bg-[#111827]/50 flex items-center justify-center">
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </span>
      )}
    </button>
  );
}