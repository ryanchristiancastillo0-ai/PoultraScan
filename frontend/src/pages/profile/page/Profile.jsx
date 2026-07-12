import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdPerson,
  MdEmail,
  MdCalendarToday,
  MdEdit,
  MdSave,
  MdClose,
  MdLogout,
  MdCheckCircle,
  MdErrorOutline,

} from 'react-icons/md';

import { useProfile } from '../hooks/useProfile';
import { ProfileAPI } from '../api/profileApi';
import { TopNav, Footer,BottomNav } from '../../../components/index';

import {Avatar,AvatarModal,InfoRow} from '../components/index'

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading, error, saving, saveError, updateProfile, refetch } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ fullname: '', email: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  // Avatar modal state
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setForm({ fullname: user.fullname || '', email: user.email || '' });
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
    };
  }, [pendingPreviewUrl]);

  const formatDate = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCancel = () => {
    if (user) {
      setForm({ fullname: user.fullname || '', email: user.email || '' });
    }
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    try {
      await updateProfile(form);
      setSuccessMsg('Profile updated successfully.');
      setIsEditing(false);
    } catch (_) {
      // saveError already set by hook
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFilePicked = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setAvatarError('');
    setPendingFile(file);
    setPendingPreviewUrl(URL.createObjectURL(file));
  };

  const closeAvatarModal = () => {
    if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
    setPendingFile(null);
    setPendingPreviewUrl(null);
    setAvatarError('');
  };

  const handleConfirmAvatarSave = async () => {
    if (!pendingFile || !user?.id) return;

    setUploadingAvatar(true);
    setAvatarError('');
    try {
      await ProfileAPI.uploadAvatar(user.id, pendingFile);
      await refetch();
      closeAvatarModal();
    } catch (err) {
      setAvatarError(err.message || 'Failed to upload image.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await ProfileAPI.logout();
    } catch (_) {
      // proceed to login regardless
    } finally {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5] flex flex-col font-['Manrope','Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif]">
      <TopNav />
      <div className="md:hidden">
  <BottomNav />
</div>

      <main className="flex-grow pt-24 pb-12 px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-[28px] font-bold text-[#111827] tracking-tight">Profile</h1>
            <p className="text-[#6B7280] text-sm mt-1.5">Manage your account details.</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="bg-white text-[#EF4444] border border-[#FECACA] px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-[#FEF2F2] transition-colors active:scale-[0.98] w-full sm:w-auto justify-center disabled:opacity-60"
          >
            <MdLogout className="text-lg" />
            {loggingOut ? 'Logging out...' : 'Log Out'}
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-4 border-[#E5E7EB] border-t-[#2F5D3A] rounded-full animate-spin" />
            <p className="text-sm text-[#6B7280]">Loading profile...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-16 bg-white rounded-xl border border-[#FECACA]">
            <p className="text-sm text-[#DC2626] font-medium">Couldn't load profile — {error}</p>
          </div>
        )}

        {!loading && !error && user && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Avatar / summary card */}
            <div className="md:col-span-4 bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm flex flex-col items-center text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleFilePicked}
              />
              <Avatar
                fullname={user.fullname}
                avatarUrl={user.avatar_url}
                onClick={handleAvatarClick}
              />
              <button
                onClick={handleAvatarClick}
                className="text-xs font-medium text-[#2F5D3A] hover:text-[#254A2E] mt-3 transition-colors"
              >
                Change photo
              </button>

              <h2 className="text-lg font-bold text-[#111827] mt-4 truncate max-w-full">{user.fullname || 'Unnamed User'}</h2>
              <p className="text-sm text-[#6B7280] mt-1 truncate max-w-full">{user.email}</p>

              <div className="w-full mt-6 pt-5 border-t border-[#F0F1F3]">
                <p className="text-xs font-medium text-[#6B7280]">Member Since</p>
                <p className="text-sm font-semibold text-[#111827] mt-1">{formatDate(user.created_at)}</p>
              </div>
            </div>

            {/* Right: Details / edit form card */}
            <div className="md:col-span-8 bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-[#F0F1F3] flex justify-between items-center">
                <h3 className="text-[15px] font-semibold text-[#111827]">Account Details</h3>
                {!isEditing && (
                  <button
                    onClick={() => {
                      setSuccessMsg('');
                      setIsEditing(true);
                    }}
                    className="text-[#2F5D3A] text-sm font-semibold hover:text-[#254A2E] transition-colors flex items-center gap-1.5"
                  >
                    <MdEdit className="text-base" />
                    Edit
                  </button>
                )}
              </div>

              <div className="p-6 flex-1">
                {successMsg && (
                  <div className="mb-5 flex items-center gap-2 bg-[#ECFDF3] text-[#15803D] text-sm font-medium px-4 py-3 rounded-lg">
                    <MdCheckCircle className="text-lg flex-shrink-0" />
                    {successMsg}
                  </div>
                )}
                {saveError && (
                  <div className="mb-5 flex items-center gap-2 bg-[#FEF2F2] text-[#DC2626] text-sm font-medium px-4 py-3 rounded-lg">
                    <MdErrorOutline className="text-lg flex-shrink-0" />
                    {saveError}
                  </div>
                )}

                {!isEditing ? (
                  <div>
                    <InfoRow icon={MdPerson} label="Full Name" value={user.fullname} />
                    <InfoRow icon={MdEmail} label="Email" value={user.email} />
                    <InfoRow icon={MdCalendarToday} label="Member Since" value={formatDate(user.created_at)} />
                  </div>
                ) : (
                  <form onSubmit={handleSave} className="flex flex-col gap-5">
                    <div>
                      <label htmlFor="fullname" className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                        Full Name
                      </label>
                      <input
                        id="fullname"
                        name="fullname"
                        type="text"
                        value={form.fullname}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#F7F8F5] border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm text-[#111827] focus:ring-2 focus:ring-[#2F5D3A]/20 focus:border-[#2F5D3A] outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#F7F8F5] border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm text-[#111827] focus:ring-2 focus:ring-[#2F5D3A]/20 focus:border-[#2F5D3A] outline-none transition-colors"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-[#2F5D3A] text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#254A2E] transition-colors active:scale-[0.98] disabled:opacity-60"
                      >
                        <MdSave className="text-lg" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={saving}
                        className="bg-white text-[#6B7280] border border-[#E5E7EB] px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#F7F8F5] transition-colors active:scale-[0.98] disabled:opacity-60"
                      >
                        <MdClose className="text-lg" />
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {pendingPreviewUrl && (
        <AvatarModal
          previewUrl={pendingPreviewUrl}
          onSave={handleConfirmAvatarSave}
          onCancel={closeAvatarModal}
          saving={uploadingAvatar}
          error={avatarError}
        />
      )}

      <Footer />
    </div>
  );
}