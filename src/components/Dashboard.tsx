import React from 'react';
import { Trophy, Star, Zap } from 'lucide-react';

interface DashboardProps {
  metrics: {
    totalBugs: number;
    resolvedBugs: number;
    totalBounty: number;
    monthlyBounty: number;
    yearlyBounty: number;
    monthlyTarget: number;
    yearlyTarget: number;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ metrics }) => {
  const { totalBugs, resolvedBugs, totalBounty, monthlyBounty, yearlyBounty, monthlyTarget, yearlyTarget } = metrics;
  
  const monthlyProgress = monthlyTarget > 0 ? Math.min(100, Math.round((monthlyBounty / monthlyTarget) * 100)) : 0;
  const yearlyProgress = yearlyTarget > 0 ? Math.min(100, Math.round((yearlyBounty / yearlyTarget) * 100)) : 0;

  // Gamification logic
  const currentLevel = Math.floor(Math.sqrt(totalBounty / 100)) + 1;
  const xpForNextLevel = Math.pow(currentLevel, 2) * 100;
  const currentLevelBaseXP = Math.pow(currentLevel - 1, 2) * 100;
  const currentLevelProgress = totalBounty - currentLevelBaseXP;
  const xpNeeded = xpForNextLevel - currentLevelBaseXP;
  const xpPercentage = Math.min(100, Math.round((currentLevelProgress / xpNeeded) * 100));

  const getRankName = (level: number) => {
    if (level < 5) return 'Script Kiddie';
    if (level < 10) return 'Bug Hunter';
    if (level < 20) return 'Elite Hacker';
    if (level < 50) return '0-day Master';
    return 'Cyber Legend';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      
      {/* Gamification Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 p-6 rounded-xl shadow-lg border border-indigo-500/30 text-white flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
          <Trophy className="w-24 h-24 text-yellow-400" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-bold tracking-wider text-indigo-200">LVL {currentLevel}</span>
          </div>
          <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-1">
            {getRankName(currentLevel)}
          </h3>
        </div>

        <div className="relative z-10 mt-6">
          <div className="flex justify-between text-xs font-semibold mb-1.5 text-indigo-200">
            <span>{currentLevelProgress.toLocaleString()} XP</span>
            <span>{xpNeeded.toLocaleString()} XP to LVL {currentLevel + 1}</span>
          </div>
          <div className="w-full bg-indigo-950/50 rounded-full h-2.5 backdrop-blur-sm border border-white/10">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-300 h-full rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)] transition-all duration-1000 ease-out" 
              style={{ width: `${xpPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div>
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Lifetime Stats
          </h3>
          <div className="flex justify-between items-end mt-4">
            <div>
              <p className="text-sm text-gray-500">Total Bugs</p>
              <p className="text-2xl font-bold text-gray-900">{totalBugs}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{resolvedBugs}</p>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">Total Lifetime Bounty</p>
          <p className="text-xl font-bold text-blue-600">${totalBounty.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-3">
        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-6">Bounty Targets</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Monthly Target */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">This Month</span>
              <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                {monthlyProgress}%
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold text-gray-900">${monthlyBounty.toLocaleString()}</span>
              <span className="text-sm text-gray-500">/ ${monthlyTarget.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full rounded-full ${monthlyProgress >= 100 ? 'bg-green-500' : 'bg-purple-500'}`} 
                style={{ width: `${monthlyProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Yearly Target */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">This Year</span>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                {yearlyProgress}%
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold text-gray-900">${yearlyBounty.toLocaleString()}</span>
              <span className="text-sm text-gray-500">/ ${yearlyTarget.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full rounded-full ${yearlyProgress >= 100 ? 'bg-green-500' : 'bg-indigo-500'}`} 
                style={{ width: `${yearlyProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
