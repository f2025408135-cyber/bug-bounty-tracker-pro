import React, { useState } from 'react';
import { Bug, Status } from '../types';
import Modal from './Modal';
import { getSeverityColor, getStatusColor } from './TrackerBoard';
import { User, ShieldAlert, Target, DollarSign, Clock, MessageSquare, Send, Sparkles } from 'lucide-react';

interface DetailedBugModalProps {
  bug: Bug | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Status) => void;
  onAddComment: (id: string, commentText: string) => void;
  onAnalyzeWithAI?: (bug: Bug) => void;
}

const DetailedBugModal: React.FC<DetailedBugModalProps> = ({ bug, isOpen, onClose, onUpdateStatus, onAddComment, onAnalyzeWithAI }) => {
  const [newComment, setNewComment] = useState('');

  if (!bug) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(bug.id, newComment.trim());
      setNewComment('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vulnerability Details" size="xl">
      <div className="space-y-8">
        
        {/* Header Section */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-2xl font-bold text-gray-900 pr-4">{bug.title}</h3>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getSeverityColor(bug.severity)}`}>
                {bug.severity}
              </span>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(bug.status)}`}>
                {bug.status}
              </span>
              </div>
              {onAnalyzeWithAI && (
                <button 
                  onClick={() => onAnalyzeWithAI(bug)}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1.5 rounded-full hover:shadow-md transition-all hover:scale-105"
                >
                  <Sparkles className="w-3 h-3" />
                  Analyze with Assistant
                </button>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-4 mt-2">
            <span className="font-mono">ID: {bug.id}</span>
            <span>Reported on {new Date(bug.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center gap-3">
            <Target className="text-blue-500 w-8 h-8 p-1.5 bg-blue-100 rounded-md" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Target</p>
              <p className="text-sm font-medium text-gray-900 truncate" title={bug.target}>{bug.target}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center gap-3">
            <ShieldAlert className="text-orange-500 w-8 h-8 p-1.5 bg-orange-100 rounded-md" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">CVSS</p>
              <p className="text-sm font-medium text-gray-900">{bug.cvssScore.toFixed(1)}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center gap-3">
            <DollarSign className="text-green-500 w-8 h-8 p-1.5 bg-green-100 rounded-md" />
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Bounty</p>
              <p className="text-sm font-medium text-gray-900">${bug.bounty}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center gap-3">
            <User className="text-purple-500 w-8 h-8 p-1.5 bg-purple-100 rounded-md" />
            <div className="overflow-hidden">
              <p className="text-xs text-gray-500 uppercase font-semibold">Reporter</p>
              <p className="text-sm font-medium text-gray-900 truncate" title={bug.reporter.username}>{bug.reporter.username}</p>
            </div>
          </div>
        </div>

        {/* Description & Steps */}
        <div className="space-y-6">
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-2 border-b pb-1">Description</h4>
            <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed bg-white border border-gray-100 p-4 rounded-lg shadow-sm">
              {bug.description}
            </p>
          </div>
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-2 border-b pb-1">Steps to Reproduce</h4>
            <div className="bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed">
              <pre>{bug.stepsToReproduce}</pre>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gray-500" />
            Comments & Discussion ({bug.comments.length})
          </h4>
          
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2 mb-4">
            {bug.comments.length === 0 ? (
              <p className="text-sm text-gray-500 italic text-center py-4">No comments yet. Start the discussion.</p>
            ) : (
              bug.comments.map(comment => (
                <div key={comment.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs">
                        {comment.author.charAt(0).toUpperCase()}
                      </div>
                      {comment.author}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(comment.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 ml-8 whitespace-pre-wrap">{comment.text}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </form>
        </div>

        {/* Action Bar */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Update Status:</span>
          <select
            value={bug.status}
            onChange={(e) => onUpdateStatus(bug.id, e.target.value as Status)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm font-semibold bg-white"
          >
            <option value="Open">Open</option>
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>
    </Modal>
  );
};

export default DetailedBugModal;
