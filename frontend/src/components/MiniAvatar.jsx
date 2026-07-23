import {resolveAvatarSrc} from '../utils/AvatarSrc'
import {getInitials} from '../utils/getInitials'
import { AVATAR_ICONS, getIconKey } from '../pages/profile/../../utils/avatarIcons'


export default function MiniAvatar({ fullname, avatarUrl, sizeClass }) {
  const iconKey = getIconKey(avatarUrl);

  if (iconKey && AVATAR_ICONS[iconKey]) {
    const { Icon } = AVATAR_ICONS[iconKey];
    return (
      <div
        className={`${sizeClass} rounded-full bg-[#EAF2EC] text-[#2F5D3A] flex items-center justify-center font-semibold overflow-hidden flex-shrink-0`}
      >
        <Icon className="w-[70%] h-[70%]" />
      </div>
    );
  }

  const src = resolveAvatarSrc(avatarUrl);

  return (
    <div
      className={`${sizeClass} rounded-full bg-[#EAF2EC] text-[#2F5D3A] flex items-center justify-center font-semibold overflow-hidden flex-shrink-0`}
    >
      {src ? (
        <img
          alt="User profile avatar"
          className="w-full h-full object-cover"
          src={src}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <span className="text-xs">{getInitials(fullname)}</span>
      )}
    </div>
  );
}