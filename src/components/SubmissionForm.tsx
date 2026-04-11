import React, { useState } from 'react';
import { Bug, Severity, Reporter, Platform } from '../types';

interface SubmissionFormProps {
  onSubmit: (bug: Omit<Bug, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'comments' | 'activity'>) => void;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [severity, setSeverity] = useState<Severity>('Medium');
  const [cvssScore, setCvssScore] = useState<number | ''>('');
  const [target, setTarget] = useState('');
  const [platform, setPlatform] = useState<Platform>('HackerOne');
  const [bounty, setBounty] = useState<number | ''>('');
  
  // Reporter info
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [reporterUsername, setReporterUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reporter: Reporter = {
      name: reporterName,
      email: reporterEmail,
      username: reporterUsername || 'anonymous'
    };

    onSubmit({
      title,
      description,
      stepsToReproduce,
      severity,
      cvssScore: Number(cvssScore) || 0,
      target,
      platform,
      bounty: Number(bounty) || 0,
      reporter,
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setStepsToReproduce('');
    setSeverity('Medium');
    setCvssScore('');
    setTarget('');
    setPlatform('HackerOne');
    setBounty('');
    setReporterName('');
    setReporterEmail('');
    setReporterUsername('');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">Submit Vulnerability Report</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Reporter Information */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-4 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Reporter Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="reporter-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                id="reporter-name"
                type="text"
                required
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label htmlFor="reporter-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="reporter-email"
                type="email"
                required
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label htmlFor="reporter-username" className="block text-sm font-medium text-gray-700 mb-1">Hacker Username</label>
              <input
                id="reporter-username"
                type="text"
                value={reporterUsername}
                onChange={(e) => setReporterUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="janedoe_hax (Optional)"
              />
            </div>
          </div>
        </div>

        {/* Vulnerability Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b pb-2">Vulnerability Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title-input" className="block text-sm font-medium text-gray-700 mb-1">Title / Summary</label>
              <input
                id="title-input"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="e.g. Stored XSS in User Profile"
              />
            </div>
            <div>
              <label htmlFor="target-input" className="block text-sm font-medium text-gray-700 mb-1">Target Asset</label>
              <input
                id="target-input"
                type="text"
                required
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="e.g. api.example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="platform-input" className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
              <select
                id="platform-input"
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="HackerOne">HackerOne</option>
                <option value="Bugcrowd">Bugcrowd</option>
                <option value="Intigriti">Intigriti</option>
                <option value="Synack">Synack</option>
                <option value="YesWeHack">YesWeHack</option>
                <option value="Independent">Independent</option>
              </select>
            </div>
            <div>
              <label htmlFor="severity-input" className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select
                id="severity-input"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label htmlFor="cvss-input" className="block text-sm font-medium text-gray-700 mb-1">CVSS Score (0.0 - 10.0)</label>
              <input
                id="cvss-input"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={cvssScore}
                onChange={(e) => setCvssScore(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="e.g. 7.5"
              />
            </div>
            <div>
              <label htmlFor="bounty-input" className="block text-sm font-medium text-gray-700 mb-1">Suggested Bounty ($)</label>
              <input
                id="bounty-input"
                type="number"
                min="0"
                value={bounty}
                onChange={(e) => setBounty(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description-input" className="block text-sm font-medium text-gray-700 mb-1">Description & Impact</label>
            <textarea
              id="description-input"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Detailed description of the vulnerability and its potential impact..."
            />
          </div>

          <div>
            <label htmlFor="steps-input" className="block text-sm font-medium text-gray-700 mb-1">Steps to Reproduce</label>
            <textarea
              id="steps-input"
              required
              value={stepsToReproduce}
              onChange={(e) => setStepsToReproduce(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
              placeholder="1. Go to https://example.com/login&#10;2. Enter payload: <script>alert(1)</script>&#10;3. Click submit"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200 shadow-sm"
          >
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmissionForm;
