import React, { useState } from 'react';
import {
  MdAdd,
  MdOutlineNotes,
  MdErrorOutline,
  MdChevronRight,
  MdOutlineBook,
} from 'react-icons/md';
import { useJournal } from '../hooks/useJournal';
import { TopNav, BottomNav } from '../../../components/index';

import {EntryCard,EntryFormModal} from '../components/index'

export default function Journal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const { entries, loading, error, saving, addEntry, editEntry, removeEntry } = useJournal();

  const openCreateModal = () => {
    setEditingEntry(null);
    setModalOpen(true);
  };

  const openEditModal = (entry) => {
    setEditingEntry(entry);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingEntry(null);
  };

  const handleSubmit = async (payload) => {
    if (editingEntry) {
      await editEntry(editingEntry.id, payload);
    } else {
      await addEntry(payload);
    }
  };

  return (
    <div className="bg-[#f8f9ff] min-h-screen">
      <TopNav />
      <div className="lg:hidden">
  <BottomNav />
</div>

      <main className="pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#006948] to-[#00855d] flex items-center justify-center shadow-[0_8px_20px_rgba(0,105,72,0.25)] flex-shrink-0">
            <MdOutlineBook className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#0b1c30] tracking-tight">Journal</h1>
            <p className="text-sm text-[#565e74] mt-1">
              Record observations, decisions, and insights from your farm.
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full bg-[#006948]/10 text-xs font-bold text-[#006948]">
              {entries.length}
            </span>
            <span className="text-sm font-medium text-[#565e74]">
              {entries.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          <button
            onClick={openCreateModal}
            className="group inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-[#006948] to-[#00855d] text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(0,105,72,0.4)] hover:shadow-[0_12px_24px_-6px_rgba(0,105,72,0.5)] active:scale-[0.98] transition-all"
          >
            <MdAdd className="text-lg group-hover:rotate-90 transition-transform duration-200" />
            New Entry
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 px-4 py-3.5 rounded-xl bg-red-50 border border-red-100">
            <MdErrorOutline className="text-red-500 text-base flex-shrink-0" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="py-24 flex flex-col items-center gap-3">
            <div className="w-7 h-7 rounded-full border-[3px] border-[#e5eeff] border-t-[#006948] animate-spin" />
            <p className="text-sm text-[#8a958e] font-medium">Loading entries...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-4 bg-white rounded-2xl border border-[#eef1fa] shadow-[0_1px_3px_rgba(11,28,48,0.04)]">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#006948]/10 to-[#00855d]/5 flex items-center justify-center">
              <MdOutlineNotes className="text-3xl text-[#006948]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-[#0b1c30]">No entries yet</p>
              <p className="text-sm text-[#8a958e] mt-1">Start documenting your farm observations.</p>
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#006948] hover:text-[#00855d] transition-colors mt-1"
            >
              Create your first entry
              <MdChevronRight className="text-lg" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} onEdit={openEditModal} onDelete={removeEntry} />
            ))}
          </div>
        )}
      </main>

      {modalOpen && (
        <EntryFormModal
          initialData={editingEntry}
          onClose={closeModal}
          onSubmit={handleSubmit}
          saving={saving}
        />
      )}
    </div>
  );
}