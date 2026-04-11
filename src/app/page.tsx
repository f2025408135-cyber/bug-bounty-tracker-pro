"use client";

import React, { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import SubmissionForm from '@/components/SubmissionForm';
import TrackerBoard from '@/components/TrackerBoard';
import DetailedBugModal from '@/components/DetailedBugModal';
import Tabs, { Tab } from '@/components/Tabs';
import Notification, { NotificationType } from '@/components/Notification';
import BugCharts from '@/components/Charts';
import ActivityFeed from '@/components/ActivityFeed';
import KnowledgeBase from '@/components/KnowledgeBase';
import AIAssistant from '@/components/AIAssistant';
import { Bug, Status, KnowledgeArticle } from '@/types';
import { LayoutDashboard, ListTodo, PlusCircle, Shield, BookOpen, Bot } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Home() {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [monthlyTarget, setMonthlyTarget] = useState<number>(10000);
  const [yearlyTarget, setYearlyTarget] = useState<number>(100000);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Modal State
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Assistant State
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [aiContextBug, setAiContextBug] = useState<Bug | null>(null);

  // Notification State
  const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);

  // Load from local storage
  useEffect(() => {
    const savedBugs = localStorage.getItem('bountyBugs_v3');
    const savedArticles = localStorage.getItem('bountyArticles_v3');
    const savedMonthlyTarget = localStorage.getItem('monthlyTarget');
    const savedYearlyTarget = localStorage.getItem('yearlyTarget');
    
    if (savedBugs) {
      try { setBugs(JSON.parse(savedBugs)); } catch (e) { console.error("Failed to parse bugs"); }
    }
    if (savedArticles) {
      try { setArticles(JSON.parse(savedArticles)); } catch (e) { console.error("Failed to parse articles"); }
    }
    
    if (savedMonthlyTarget) setMonthlyTarget(Number(savedMonthlyTarget));
    if (savedYearlyTarget) setYearlyTarget(Number(savedYearlyTarget));
    
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('bountyBugs_v3', JSON.stringify(bugs));
      localStorage.setItem('bountyArticles_v3', JSON.stringify(articles));
      localStorage.setItem('monthlyTarget', monthlyTarget.toString());
      localStorage.setItem('yearlyTarget', yearlyTarget.toString());
    }
  }, [bugs, articles, monthlyTarget, yearlyTarget, isLoaded]);

  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ message, type });
  };

  const handleAddBug = (newBugData: Omit<Bug, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'comments' | 'activity'>) => {
    const newBug: Bug = {
      ...newBugData,
      id: crypto.randomUUID(),
      status: 'Open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      activity: [{
        id: crypto.randomUUID(),
        action: 'created the report',
        timestamp: new Date().toISOString(),
        user: newBugData.reporter.username
      }],
    };
    setBugs([newBug, ...bugs]);
    showNotification('Bug report submitted successfully!', 'success');
  };

  const handleUpdateStatus = (id: string, newStatus: Status) => {
    setBugs(bugs.map(bug => {
      if (bug.id === id) {
        const newActivity = {
          id: crypto.randomUUID(),
          action: `changed status to ${newStatus}`,
          timestamp: new Date().toISOString(),
          user: 'Admin' // Hardcoded for this demo
        };
        const updatedBug = { 
          ...bug, 
          status: newStatus, 
          updatedAt: new Date().toISOString(),
          activity: [newActivity, ...bug.activity]
        };
        
        // Update selected bug if it's currently open in modal
        if (selectedBug?.id === id) {
          setSelectedBug(updatedBug);
        }

        // Trigger confetti if resolved
        if (newStatus === 'Resolved' && bug.status !== 'Resolved') {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#22c55e', '#3b82f6', '#a855f7']
          });
        }
        
        return updatedBug;
      }
      return bug;
    }));
    showNotification(`Bug status updated to ${newStatus}`, 'info');
  };

  const handleAnalyzeWithAI = (bug: Bug) => {
    setAiContextBug(bug);
    setIsAIAssistantOpen(true);
  };

  const handleAddComment = (id: string, text: string) => {
    setBugs(bugs.map(bug => {
      if (bug.id === id) {
        const newComment = {
          id: crypto.randomUUID(),
          author: 'Admin', // Hardcoded for this demo
          text,
          timestamp: new Date().toISOString()
        };
        const newActivity = {
          id: crypto.randomUUID(),
          action: 'added a comment',
          timestamp: new Date().toISOString(),
          user: 'Admin'
        };
        const updatedBug = {
          ...bug,
          updatedAt: new Date().toISOString(),
          comments: [...bug.comments, newComment],
          activity: [newActivity, ...bug.activity]
        };

        if (selectedBug?.id === id) {
          setSelectedBug(updatedBug);
        }

        return updatedBug;
      }
      return bug;
    }));
    showNotification('Comment added', 'success');
  };

  const handleDeleteBug = (id: string) => {
    if (window.confirm('Are you sure you want to delete this bug report? This action cannot be undone.')) {
      setBugs(bugs.filter(bug => bug.id !== id));
      showNotification('Bug report deleted', 'error');
      if (selectedBug?.id === id) {
        setIsModalOpen(false);
        setSelectedBug(null);
      }
    }
  };

  const openBugDetails = (bug: Bug) => {
    setSelectedBug(bug);
    setIsModalOpen(true);
  };

  const handleAddArticle = (newArticleData: Omit<KnowledgeArticle, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newArticle: KnowledgeArticle = {
      ...newArticleData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setArticles([newArticle, ...articles]);
    showNotification('Knowledge article added successfully!', 'success');
  };

  // Calculate metrics
  const resolvedBugs = bugs.filter(bug => bug.status === 'Resolved').length;
  const totalBounty = bugs
    .filter(bug => bug.status === 'Resolved')
    .reduce((sum, bug) => sum + bug.bounty, 0);

  // Time-based calculations
  const now = new Date();
  const currentMonthBounty = bugs
    .filter(bug => bug.status === 'Resolved' && new Date(bug.createdAt).getMonth() === now.getMonth() && new Date(bug.createdAt).getFullYear() === now.getFullYear())
    .reduce((sum, bug) => sum + bug.bounty, 0);

  const currentYearBounty = bugs
    .filter(bug => bug.status === 'Resolved' && new Date(bug.createdAt).getFullYear() === now.getFullYear())
    .reduce((sum, bug) => sum + bug.bounty, 0);

  const metrics = {
    totalBugs: bugs.length,
    resolvedBugs,
    totalBounty,
    monthlyBounty: currentMonthBounty,
    yearlyBounty: currentYearBounty,
    monthlyTarget,
    yearlyTarget
  };

  if (!isLoaded) return null;

  const dashboardContent = (
    <div className="space-y-6">
      <Dashboard metrics={metrics} />
      <BugCharts bugs={bugs} />
      <ActivityFeed bugs={bugs} />
    </div>
  );

  const trackerContent = (
    <div className="h-[800px]">
      <TrackerBoard 
        bugs={bugs} 
        onUpdateStatus={handleUpdateStatus} 
        onDelete={handleDeleteBug}
        onViewDetails={openBugDetails}
      />
    </div>
  );

  const submissionContent = (
    <div className="max-w-4xl mx-auto">
      <SubmissionForm onSubmit={handleAddBug} />
    </div>
  );

  const knowledgeBaseContent = (
    <div className="h-[800px]">
      <KnowledgeBase articles={articles} onAddArticle={handleAddArticle} />
    </div>
  );

  const tabs: Tab[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, content: dashboardContent },
    { id: 'tracker', label: 'Tracker', icon: <ListTodo size={18} />, content: trackerContent },
    { id: 'submit', label: 'Submit Bug', icon: <PlusCircle size={18} />, content: submissionContent },
    { id: 'knowledge', label: 'Knowledge Base', icon: <BookOpen size={18} />, content: knowledgeBaseContent }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Bug Bounty Tracker <span className="text-blue-600">Pro</span></h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 hidden md:flex">
                <label className="text-sm font-medium text-gray-700">Monthly Target:</label>
                <input
                  type="number"
                  value={monthlyTarget}
                  onChange={(e) => setMonthlyTarget(Number(e.target.value) || 0)}
                  className="w-24 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  min="1"
                />
              </div>
              <div className="flex items-center space-x-2 hidden lg:flex">
                <label className="text-sm font-medium text-gray-700">Yearly Target:</label>
                <input
                  type="number"
                  value={yearlyTarget}
                  onChange={(e) => setYearlyTarget(Number(e.target.value) || 0)}
                  className="w-28 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  min="1"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Tabs tabs={tabs} defaultTab="dashboard" />
        </div>
      </main>

      {/* Modals and Notifications */}
      <DetailedBugModal 
        bug={selectedBug} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onUpdateStatus={handleUpdateStatus}
        onAddComment={handleAddComment}
        onAnalyzeWithAI={handleAnalyzeWithAI}
      />
      
      <AIAssistant 
        isOpen={isAIAssistantOpen} 
        onClose={() => setIsAIAssistantOpen(false)} 
        contextBug={aiContextBug}
      />
      
      {/* Floating Assistant Button */}
      {!isAIAssistantOpen && (
        <button
          onClick={() => { setAiContextBug(null); setIsAIAssistantOpen(true); }}
          className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all hover:scale-110 z-40 group"
        >
          <Bot className="w-6 h-6 group-hover:animate-bounce" />
        </button>
      )}

      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
    </div>
  );
}
