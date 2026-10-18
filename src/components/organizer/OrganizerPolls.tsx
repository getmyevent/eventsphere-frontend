'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../../lib/store';
import { api } from '../../lib/api';
import {
  BarChart3,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  Radio,
  RotateCcw,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Trash2,
  X,
  ExternalLink,
} from 'lucide-react';

interface PollOptionItem {
  id: string;
  text: string;
  voteCount: number;
}

interface PollItem {
  id: string;
  sessionId: string;
  question: string;
  status: 'open' | 'closed';
  totalVotes: number;
  options: PollOptionItem[];
}

export const OrganizerPolls: React.FC = () => {
  const { sessions, poll, showToast, togglePollStatus, resetPollVote } = useStore();

  const [pollsList, setPollsList] = useState<PollItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formSessionId, setFormSessionId] = useState('');
  const [formQuestion, setFormQuestion] = useState('');
  const [formOptions, setFormOptions] = useState<string[]>(['', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Fetch all polls on mount
  const fetchPolls = async () => {
    setIsLoading(true);
    try {
      const data = await api.organizer.getPolls();
      if (Array.isArray(data)) {
        setPollsList(data);
      }
    } catch (err) {
      console.warn('Failed to load organizer polls:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [poll.id, poll.totalVotes]);

  // Set default session when sessions load
  useEffect(() => {
    if (sessions.length > 0 && !formSessionId) {
      setFormSessionId(sessions[0].id);
    }
  }, [sessions, formSessionId]);

  const handleAddOptionField = () => {
    if (formOptions.length >= 6) {
      showToast('Maximum 6 options allowed per poll', 'info');
      return;
    }
    setFormOptions([...formOptions, '']);
  };

  const handleRemoveOptionField = (index: number) => {
    if (formOptions.length <= 2) {
      showToast('A poll must have at least 2 options', 'error');
      return;
    }
    setFormOptions(formOptions.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...formOptions];
    updated[index] = val;
    setFormOptions(updated);
  };

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const cleanQuestion = formQuestion.trim();
    if (!cleanQuestion) {
      setFormError('Please enter a poll question.');
      return;
    }

    const cleanOptions = formOptions.map((o) => o.trim()).filter(Boolean);
    if (cleanOptions.length < 2) {
      setFormError('Please provide at least 2 distinct poll options.');
      return;
    }

    if (!formSessionId) {
      setFormError('Please select a session for this poll.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newPoll = await api.organizer.createPoll({
        sessionId: formSessionId,
        question: cleanQuestion,
        options: cleanOptions,
      });

      showToast('Live poll published successfully! Attendees can now vote in real-time.', 'success');
      setIsModalOpen(false);
      setFormQuestion('');
      setFormOptions(['', '', '', '']);
      fetchPolls();
    } catch (err: any) {
      console.error('Failed to create poll:', err);
      setFormError(err.message || 'Failed to create poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (pollId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'open' ? 'closed' : 'open';
    try {
      await api.organizer.updatePollStatus(pollId, nextStatus);
      showToast(`Poll marked as ${nextStatus.toUpperCase()}`, 'info');
      if (poll.id === pollId) {
        togglePollStatus();
      }
      fetchPolls();
    } catch (err) {
      showToast('Failed to update poll status', 'error');
    }
  };

  // Find associated session name
  const getSessionTitle = (sessionId?: string) => {
    const s = sessions.find((item) => item.id === sessionId);
    return s ? `${s.title} (${s.room || 'Main Hall'})` : (sessionId || 'General Session');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
              Live Audience Polling System
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#172033] tracking-tight mt-1">
            Real-Time Live Polls
          </h1>
          <p className="text-sm text-[#64748B] mt-0.5">
            Post instant interactive polls to audience devices with 0ms Server-Sent Events (SSE) live updates.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#3563F6] hover:bg-[#274FD9] active:scale-[0.98] text-white text-sm font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Live Poll</span>
        </button>
      </div>

      {/* Featured Active Poll Display */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F8FAFC]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#3563F6]">
              <Radio className="w-3.5 h-3.5 animate-pulse text-[#16A34A]" />
              <span className="text-[#16A34A] font-bold">SSE STREAM ACTIVE</span>
              <span className="text-gray-300">·</span>
              <span className="text-[#64748B]">Poll ID: {poll.id}</span>
            </div>
            <h2 className="text-lg font-bold text-[#172033] mt-1">
              {poll.question}
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Assigned to: <span className="font-medium text-[#1E293B]">{getSessionTitle(poll.sessionId)}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleToggleStatus(poll.id, poll.status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                poll.status === 'open'
                  ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {poll.status === 'open' ? 'Close Poll' : 'Reopen Poll'}
            </button>

            <button
              onClick={() => resetPollVote && resetPollVote()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-colors cursor-pointer"
              title="Reset votes to 0 for demo testing"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset My Vote</span>
            </button>
          </div>
        </div>

        {/* Live Vote Breakdown */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#64748B] pb-1">
            <span className="font-semibold text-[#172033]">Live Audience Voting Options</span>
            <span className="font-mono font-bold text-[#3563F6] text-sm">
              {poll.totalVotes} Total {poll.totalVotes === 1 ? 'Vote' : 'Votes'}
            </span>
          </div>

          <div className="space-y-3">
            {poll.options.map((opt, idx) => {
              const count = opt.votes ?? (opt as any).voteCount ?? 0;
              const pct = poll.totalVotes > 0 ? Math.round((count / poll.totalVotes) * 100) : 0;
              return (
                <div key={opt.id} className="p-3.5 rounded-lg border border-[#E2E8F0] bg-white relative overflow-hidden">
                  {/* Background progress fill */}
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-blue-50/70 border-r-2 border-blue-400 transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />

                  <div className="relative z-10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm font-medium text-[#1E293B]">{opt.text}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                      <span className="font-bold text-[#1E293B]">{count} votes</span>
                      <span className="px-2 py-0.5 rounded bg-blue-100/80 text-blue-800 font-bold">
                        {pct}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How to Test Guide Callout */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#3563F6] mt-0.5 shrink-0" />
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#1E3A8A]">
              How to Test Real-Time Live Polling (Zero Polling Delay)
            </h3>
            <ol className="text-xs text-[#1E40AF] space-y-1.5 list-decimal pl-4">
              <li>
                <strong>Side-by-Side Test:</strong> Keep this <strong>Organizer Console</strong> open in one window, and open a second window in <strong>Delegate</strong> mode (<a href="/delegate/polls" target="_blank" className="underline font-bold">/delegate/polls</a>).
              </li>
              <li>
                <strong>Cast a Vote:</strong> Click any option in the Delegate window. Notice how the vote count and percentage bars in <strong>both windows update immediately</strong> with zero page reload.
              </li>
              <li>
                <strong>Create a New Poll:</strong> Click <strong>"+ Post New Live Poll"</strong> above. Enter your question and options. When published, it is announced live to connected attendees.
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* All Event Polls List */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#64748B]" />
            <h2 className="text-base font-bold text-[#172033]">
              All Event Polls ({pollsList.length})
            </h2>
          </div>
          <button
            onClick={fetchPolls}
            className="text-xs font-semibold text-[#3563F6] hover:underline cursor-pointer"
          >
            Refresh List
          </button>
        </div>

        {pollsList.length === 0 ? (
          <p className="text-xs text-[#94A3B8] italic py-4 text-center">
            No other polls created yet. Click "+ Post New Live Poll" above to create one.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {pollsList.map((p) => (
              <div key={p.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        p.status === 'open'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {p.status}
                    </span>
                    <span className="text-xs text-[#64748B] font-mono">{p.id}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1E293B] mt-1 truncate">
                    {p.question}
                  </p>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {getSessionTitle(p.sessionId)} · {p.options.length} options · {p.totalVotes} votes
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleStatus(p.id, p.status)}
                    className="px-2.5 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
                  >
                    {p.status === 'open' ? 'Close' : 'Reopen'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create New Poll Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#3563F6]" />
                <h3 className="text-base font-bold text-[#172033]">
                  Post New Live Poll
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreatePoll} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Session Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Target Session
                </label>
                <select
                  value={formSessionId}
                  onChange={(e) => setFormSessionId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3563F6]"
                >
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.room || 'Main Hall'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Poll Question */}
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                  Poll Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="e.g., Which topic should the panel focus on?"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3563F6]"
                  required
                />
              </div>

              {/* Poll Options */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#1E293B]">
                    Voting Options (Min 2, Max 6) <span className="text-red-500">*</span>
                  </label>
                  {formOptions.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddOptionField}
                      className="text-[11px] font-bold text-[#3563F6] hover:underline cursor-pointer"
                    >
                      + Add Option
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {formOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-gray-100 text-gray-600 font-bold text-xs flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3563F6]"
                        required
                      />
                      {formOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOptionField(idx)}
                          className="text-gray-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                          title="Remove option"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#3563F6] hover:bg-[#274FD9] rounded-lg transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? 'Publishing...' : 'Launch Live Poll'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
