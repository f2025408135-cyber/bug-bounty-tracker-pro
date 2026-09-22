import React from 'react';
import { Bug, ActivityLog } from '../types';
import { CheckCircle, AlertCircle, Clock, PlayCircle, MessageSquare, Flag } from 'lucide-react';

interface ActivityFeedProps {
  bugs: Bug[];
  limit?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ bugs, limit = 10 }) => {
  // Extract all activity logs and add bug context
  const allActivities = bugs.flatMap(bug => 
    bug.activity.map(act => ({
      ...act,
      bugId: bug.id,
      bugTitle: bug.title,
      bugSeverity: bug.severity
    }))
  );

  // Sort by timestamp descending
  const sortedActivities = allActivities.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, limit);

  const getIconForAction = (action: string) => {
    if (action.includes('created')) return <Flag className="w-4 h-4 text-blue-500" />;
    if (action.includes('status') && action.includes('Resolved')) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (action.includes('status') && action.includes('Progress')) return <PlayCircle className="w-4 h-4 text-purple-500" />;
    if (action.includes('comment')) return <MessageSquare className="w-4 h-4 text-gray-500" />;
    if (action.includes('Rejected')) return <AlertCircle className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-gray-400" />;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (sortedActivities.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <p className="text-gray-500 text-sm text-center py-4">No recent activity.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Activity</h3>
      <div className="relative border-l border-gray-200 ml-3 space-y-6">
        {sortedActivities.map((activity, index) => (
          <div key={`${activity.id}-${index}`} className="relative pl-6">
            <div className="absolute -left-3.5 bg-white p-1 rounded-full border border-gray-200">
              {getIconForAction(activity.action)}
            </div>
            <div>
              <p className="text-sm text-gray-800">
                <span className="font-semibold text-gray-900">{activity.user}</span> {activity.action}
              </p>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                <span className="truncate max-w-[200px] font-medium" title={activity.bugTitle}>
                  {activity.bugTitle}
                </span>
                <span>•</span>
                <span>{formatTimeAgo(activity.timestamp)}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
