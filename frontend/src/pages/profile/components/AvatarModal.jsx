import { useState, useEffect, useRef } from 'react';
import { MdClose, MdUpload } from 'react-icons/md';
import { AVATAR_ICONS, AVATAR_ICON_KEYS, getIconKey } from '../../../utils/avatarIcons';

export default function AvatarModal({ currentAvatarUrl, onSaveFile, onSaveIcon, onCancel, saving, error }) {
  const [tab, setTab] = useState('upload'); // 'upload' | 'icon'
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(getIconKey(currentAvatarUrl) || AVATAR_ICON_KEYS[0]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
    };
  }, [pendingPreviewUrl]);

  const handleFilePicked = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
    setPendingFile(file);
    setPendingPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (tab === 'upload' && pendingFile) {
      onSaveFile(pendingFile);
    } else if (tab === 'icon' && selectedIcon) {
      onSaveIcon(selectedIcon);
    }
  };

  const canSave = (tab === 'upload' && !!pendingFile) || (tab === 'icon' && !!selectedIcon);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#10231A]/50 backdrop-blur-sm" onClick={saving ? undefined : onCancel} />
      <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-sm p-6 flex flex-col items-center max-h-[90dvh] overflow-y-auto no-scrollbar">
        <button
          onClick={onCancel}
          disabled={saving}
          className="absolute top-4 right-4 text-[#4B6357] hover:text-[#10231A] disabled:opacity-40 transition-colors"
          aria-label="Close"
        >
          <MdClose className="text-xl" />
        </button>

        <h3 className="text-base font-semibold text-[#10231A] mb-4 self-start">Update Profile Photo</h3>

        {/* Tabs */}
        <div className="flex w-full mb-5 bg-[#F7FAF8] rounded-lg p-1 gap-1">
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`flex-1 text-xs font-semibold py-2 rounded-md transition-colors ${
              tab === 'upload' ? 'bg-white text-[#14532D] shadow-sm' : 'text-[#4B6357] hover:text-[#10231A]'
            }`}
          >
            Upload Photo
          </button>
          <button
            type="button"
            onClick={() => setTab('icon')}
            className={`flex-1 text-xs font-semibold py-2 rounded-md transition-colors ${
              tab === 'icon' ? 'bg-white text-[#14532D] shadow-sm' : 'text-[#4B6357] hover:text-[#10231A]'
            }`}
          >
            Choose Icon
          </button>
        </div>

        {tab === 'upload' ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={handleFilePicked}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-40 h-40 rounded-full overflow-hidden ring-1 ring-[#E4ECE7] bg-[#F7FAF8] flex items-center justify-center group relative"
            >
              {pendingPreviewUrl ? (
                <img src={pendingPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="flex flex-col items-center gap-1.5 text-[#718279]">
                  <MdUpload className="text-2xl" />
                  <span className="text-xs font-medium">Select a photo</span>
                </span>
              )}
              <span className="absolute inset-0 bg-[#10231A]/0 group-hover:bg-[#10231A]/10 transition-colors" />
            </button>
            {pendingPreviewUrl && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-medium text-[#14532D] hover:text-[#166534] mt-3 transition-colors"
              >
                Choose a different photo
              </button>
            )}
          </>
        ) : (
          <div className="grid grid-cols-3 gap-3 w-full">
            {AVATAR_ICON_KEYS.map((key) => {
              const { Icon, label } = AVATAR_ICONS[key];
              const isSelected = selectedIcon === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedIcon(key)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-[#14532D] bg-[#E9F4EE]'
                      : 'border-[#E4ECE7] bg-white hover:border-[#14532D]/40'
                  }`}
                >
                  <span className="w-11 h-11 rounded-full bg-[#E9F4EE] flex items-center justify-center overflow-hidden">
                    <Icon className="w-[70%] h-[70%]" />
                  </span>
                  <span className="text-[11px] font-medium text-[#2C4238]">{label}</span>
                </button>
              );
            })}
          </div>
        )}

        {error && <p className="text-xs text-[#EF4444] mt-3 text-center">{error}</p>}

        <div className="flex gap-3 mt-6 w-full">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex-1 bg-white text-[#2C4238] border border-[#C5D6CC] px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#F7FAF8] transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !canSave}
            className="flex-1 bg-gradient-to-r from-[#14532D] to-[#166534] text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:from-[#166534] hover:to-[#052E16] transition-all disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}