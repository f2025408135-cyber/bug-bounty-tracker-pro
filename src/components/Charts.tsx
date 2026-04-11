import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Bug } from '../types';

interface ChartsProps {
  bugs: Bug[];
}

const COLORS = {
  Critical: '#ef4444', 
  High: '#f97316',    
  Medium: '#eab308',  
  Low: '#3b82f6',     
  Open: '#9ca3af',    
  InProgress: '#a855f7', 
  UnderReview: '#f59e0b', 
  Resolved: '#22c55e', 
  Rejected: '#64748b',
  NA: '#e2e8f0', // gray-200
  // Platforms
  HackerOne: '#1b1c1d',
  Bugcrowd: '#ff5a00',
  Intigriti: '#005bea',
  Synack: '#0e1111',
  YesWeHack: '#131e30',
  Independent: '#6366f1' // indigo-500
};

export const BugCharts: React.FC<ChartsProps> = ({ bugs }) => {
  const severityData = useMemo(() => {
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    bugs.forEach(bug => { if (bug.severity in counts) counts[bug.severity]++; });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);
  }, [bugs]);

  const statusData = useMemo(() => {
    const counts = { Open: 0, 'In Progress': 0, 'Under Review': 0, Resolved: 0, Rejected: 0, NA: 0 };
    bugs.forEach(bug => { if (bug.status in counts) counts[bug.status as keyof typeof counts]++; });
    return Object.entries(counts).map(([name, value]) => ({ 
      name, 
      value,
      color: COLORS[name.replace(' ', '') as keyof typeof COLORS]
    })).filter(d => d.value > 0);
  }, [bugs]);

  const monthlyBountyData = useMemo(() => {
    const months: Record<string, number> = {};
    bugs.filter(b => b.status === 'Resolved').forEach(bug => {
      const date = new Date(bug.createdAt);
      const key = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      months[key] = (months[key] || 0) + bug.bounty;
    });
    return Object.entries(months).map(([name, bounty]) => ({ name, bounty }));
  }, [bugs]);

  const platformData = useMemo(() => {
    const data: Record<string, { bugs: number, bounty: number }> = {};
    bugs.forEach(bug => {
      if (!data[bug.platform]) data[bug.platform] = { bugs: 0, bounty: 0 };
      data[bug.platform].bugs++;
      if (bug.status === 'Resolved') {
        data[bug.platform].bounty += bug.bounty;
      }
    });
    return Object.entries(data).map(([name, stats]) => ({
      name,
      ...stats,
      color: COLORS[name as keyof typeof COLORS] || COLORS.Independent
    })).sort((a, b) => b.bounty - a.bounty);
  }, [bugs]);

  if (bugs.length === 0) {
    return <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow-sm border border-gray-100">No data available for charts yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">Severity Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value: any) => [value, 'Bugs']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Status Overview</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <RechartsTooltip formatter={(value: any) => [value, 'Bugs']} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {monthlyBountyData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Bounty Payouts over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyBountyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(val) => `$${val}`} />
                <RechartsTooltip formatter={(value: any) => [`$${value}`, 'Bounty Paid']} />
                <Line type="monotone" dataKey="bounty" stroke="#22c55e" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {platformData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Performance by Platform</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tickFormatter={(val) => `$${val}`} />
                <RechartsTooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="bugs" name="Total Bugs" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="bounty" name="Bounty Earned" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default BugCharts;
