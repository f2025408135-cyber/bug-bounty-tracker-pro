import React, { useState, useMemo } from 'react';
import { Bug, Severity, Status, Platform } from '../types';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface TrackerBoardProps {
  bugs: Bug[];
  onUpdateStatus: (id: string, newStatus: Status) => void;
  onDelete: (id: string) => void;
  onViewDetails: (bug: Bug) => void;
}

type SortField = 'createdAt' | 'bounty' | 'cvssScore' | 'severity';
type SortOrder = 'asc' | 'desc';

const severityWeight: Record<Severity, number> = { Low: 1, Medium: 2, High: 3, Critical: 4 };

export const getSeverityColor = (severity: Severity) => {
  switch (severity) {
    case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
    case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Low': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusColor = (status: Status) => {
  switch (status) {
    case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
    case 'In Progress': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Under Review': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Rejected': return 'bg-slate-100 text-slate-800 border-slate-200';
    case 'NA': return 'bg-gray-200 text-gray-600 border-gray-300';
    case 'Open': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const TrackerBoard: React.FC<TrackerBoardProps> = ({ bugs, onUpdateStatus, onDelete, onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [severityFilter, setSeverityFilter] = useState<Severity | 'All'>('All');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'All'>('All');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedBugs = useMemo(() => {
    return bugs
      .filter(bug => {
        const matchesSearch = bug.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              bug.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              bug.reporter.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || bug.status === statusFilter;
        const matchesSeverity = severityFilter === 'All' || bug.severity === severityFilter;
        const matchesPlatform = platformFilter === 'All' || bug.platform === platformFilter;
        return matchesSearch && matchesStatus && matchesSeverity && matchesPlatform;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortField === 'createdAt') {
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortField === 'bounty') {
          comparison = a.bounty - b.bounty;
        } else if (sortField === 'cvssScore') {
          comparison = a.cvssScore - b.cvssScore;
        } else if (sortField === 'severity') {
          comparison = severityWeight[a.severity] - severityWeight[b.severity];
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [bugs, searchTerm, statusFilter, severityFilter, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedBugs.length / itemsPerPage));
  const currentBugs = filteredAndSortedBugs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, severityFilter, platformFilter]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">Tracker Board</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search bugs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Filters:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | 'All')}
            className="pl-3 pr-8 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
            <option value="NA">Not Applicable</option>
          </select>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as Severity | 'All')}
            className="pl-3 pr-8 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
          >
            <option value="All">All Severities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as Platform | 'All')}
            className="pl-3 pr-8 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
          >
            <option value="All">All Platforms</option>
            <option value="HackerOne">HackerOne</option>
            <option value="Bugcrowd">Bugcrowd</option>
            <option value="Intigriti">Intigriti</option>
            <option value="Synack">Synack</option>
            <option value="YesWeHack">YesWeHack</option>
            <option value="Independent">Independent</option>
          </select>
          <span className="text-gray-500 ml-auto">
            Showing {filteredAndSortedBugs.length} results
          </span>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bug Details</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('severity')}>
                <div className="flex items-center gap-1">Severity {sortField === 'severity' && <ArrowUpDown className="w-3 h-3" />}</div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('cvssScore')}>
                <div className="flex items-center gap-1">CVSS {sortField === 'cvssScore' && <ArrowUpDown className="w-3 h-3" />}</div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('bounty')}>
                <div className="flex items-center gap-1">Bounty {sortField === 'bounty' && <ArrowUpDown className="w-3 h-3" />}</div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentBugs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  No bugs found matching your criteria.
                </td>
              </tr>
            ) : (
              currentBugs.map((bug) => (
                <tr key={bug.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{bug.title}</div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      <span className="font-mono text-gray-400">#{bug.id.substring(0,6)}</span>
                      <span>•</span>
                      <span className="truncate max-w-[150px]" title={bug.target}>{bug.target}</span>
                      <span>•</span>
                      <span>by {bug.reporter.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bug.platform}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full border ${getSeverityColor(bug.severity)}`}>
                      {bug.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`font-mono ${bug.cvssScore >= 9 ? 'text-red-600 font-bold' : bug.cvssScore >= 7 ? 'text-orange-600' : ''}`}>
                      {bug.cvssScore.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={bug.status}
                      onChange={(e) => onUpdateStatus(bug.id, e.target.value as Status)}
                      className={`text-xs rounded-md border-0 py-1.5 pl-3 pr-8 font-semibold ring-1 ring-inset focus:ring-2 focus:ring-inset sm:leading-6 ${getStatusColor(bug.status)}`}
                    >
                      <option value="Open">Open</option>
                      <option value="Under Review">Under Review</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="NA">NA</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    ${bug.bounty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onViewDetails(bug)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(bug.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Bug"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackerBoard;
