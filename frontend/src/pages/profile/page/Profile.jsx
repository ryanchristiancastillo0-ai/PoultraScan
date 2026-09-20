import React, { useState, useEffect } from 'react';
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
import { TopNav, Footer, BottomNav, PoultraScanLoader } from '../../../components/index';

import { Avatar, AvatarModal, InfoRow } from '../components/index';

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading, error, saving, saveError, updateProfile, refetch } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ fullname: '', email: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  // Avatar modal state
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({ fullname: user.fullname || '', email: user.email || '' });
    }
  }, [user]);

  const formatDate = (value) => {
    if (!value) return 'â€”';
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

  const openAvatarModal = () => {
    setAvatarError('');
    setAvatarModalOpen(true);
  };

  const closeAvatarModal = () => {
    setAvatarModalOpen(false);
    setAvatarError('');
  };

  const handleSaveAvatarFile = async (file) => {
    if (!user?.id) return;
    setUploadingAvatar(true);
    setAvatarError('');
    try {
      await ProfileAPI.uploadAvatar(user.id, file);
      await refetch();
      closeAvatarModal();
    } catch (err) {
      setAvatarError(err.message || 'Failed to upload image.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveAvatarIcon = async (iconKey) => {
    if (!user?.id) return;
    setUploadingAvatar(true);
    setAvatarError('');
    try {
      await ProfileAPI.updateProfile(user.id, { avatar_url: `icon:${iconKey}` });
      await refetch();
      closeAvatarModal();
    } catch (err) {
      setAvatarError(err.message || 'Failed to save icon.');
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
    <div className="min-h-screen bg-[#F7FAF8] flex flex-col font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif]">
      <TopNav />
      <div className="md:hidden">
        <BottomNav />
      </div>

      <main className="flex-grow pt-24 pb-12 px-4 md:px-8 max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E9F4EE] text-[#14532D] text-[10px] font-bold uppercase tracking-widest mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
              Account
            </span>
            <h1 className="text-2xl md:text-[28px] font-bold text-[#10231A] tracking-tight">Profile</h1>
            <p className="text-[#4B6357] text-sm mt-1.5">Manage your account details.</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="bg-white text-[#EF4444] border border-[#FECACA] px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#FEF2F2] transition-colors active:scale-[0.98] w-full sm:w-auto justify-center disabled:opacity-60"
          >
            <MdLogout className="text-lg" />
            {loggingOut ? 'Logging out...' : 'Log Out'}
          </button>
        </div>

        {loading && (
          <div className="py-20">
            <PoultraScanLoader label="Loading profile..." size={48} />
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#FECACA] shadow-card">
            <p className="text-sm text-[#EF4444] font-medium">Couldn't load profile â€” {error}</p>
          </div>
        )}

        {!loading && !error && user && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Avatar / summary card */}
            <div className="md:col-span-4 bg-white rounded-2xl p-6 border border-[#E4ECE7] shadow-card flex flex-col items-center text-center">
              <Avatar
                fullname={user.fullname}
                avatarUrl={user.avatar_url}
                onClick={openAvatarModal}
              />
              <button
                onClick={openAvatarModal}
                className="text-xs font-medium text-[#14532D] hover:text-[#166534] mt-3 transition-colors"
              >
                Change photo
              </button>

              <h2 className="text-lg font-bold text-[#10231A] mt-4 truncate max-w-full">{user.fullname || 'Unnamed User'}</h2>
              <p className="text-sm text-[#4B6357] mt-1 truncate max-w-full">{user.email}</p>

              <div className="w-full mt-6 pt-5 border-t border-[#E4ECE7]">
                <p className="text-xs font-medium text-[#4B6357]">Member Since</p>
                <p className="text-sm font-semibold text-[#10231A] mt-1">{formatDate(user.created_at)}</p>
              </div>
            </div>

            {/* Right: Details / edit form card */}
            <div className="md:col-span-8 bg-white rounded-2xl border border-[#E4ECE7] shadow-card overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-[#E4ECE7] flex justify-between items-center">
                <h3 className="text-[15px] font-semibold text-[#10231A]">Account Details</h3>
                {!isEditing && (
                  <button
                    onClick={() => {
                      setSuccessMsg('');
                      setIsEditing(true);
                    }}
                    className="text-[#14532D] text-sm font-semibold hover:text-[#166534] transition-colors flex items-center gap-1.5"
                  >
                    <MdEdit className="text-base" />
                    Edit
                  </button>
                )}
              </div>

              <div className="p-6 flex-1">
                {successMsg && (
                  <div className="mb-5 flex items-center gap-2 bg-[#D1FAE5] text-[#059669] text-sm font-medium px-4 py-3 rounded-xl">
                    <MdCheckCircle className="text-lg flex-shrink-0" />
                    {successMsg}
                  </div>
                )}
                {saveError && (
                  <div className="mb-5 flex items-center gap-2 bg-[#FEF2F2] text-[#EF4444] text-sm font-medium px-4 py-3 rounded-xl">
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
                      <label htmlFor="fullname" className="block text-xs font-semibold text-[#4B6357] uppercase tracking-wide mb-2">
                        Full Name
                      </label>
                      <input
                        id="fullname"
                        name="fullname"
                        type="text"
                        value={form.fullname}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#F7FAF8] border border-[#E4ECE7] rounded-xl px-4 py-2.5 text-sm text-[#10231A] focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D] outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-[#4B6357] uppercase tracking-wide mb-2">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#F7FAF8] border border-[#E4ECE7] rounded-xl px-4 py-2.5 text-sm text-[#10231A] focus:ring-2 focus:ring-[#14532D]/20 focus:border-[#14532D] outline-none transition-colors"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                      <button
                        type="submit"
                        disabled={saving}
                        className="bg-gradient-to-br from-[#14532D] to-[#166534] text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:from-[#166534] hover:to-[#052E16] transition-all active:scale-[0.98] disabled:opacity-60 shadow-md shadow-[#14532D]/25"
                      >
                        <MdSave className="text-lg" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={saving}
                        className="bg-white text-[#4B6357] border border-[#E4ECE7] px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#F7FAF8] transition-colors active:scale-[0.98] disabled:opacity-60"
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

      {avatarModalOpen && (
        <AvatarModal
          currentAvatarUrl={user?.avatar_url}
          onSaveFile={handleSaveAvatarFile}
          onSaveIcon={handleSaveAvatarIcon}
          onCancel={closeAvatarModal}
          saving={uploadingAvatar}
          error={avatarError}
        />
      )}

      <Footer />
    </div>
  );
}