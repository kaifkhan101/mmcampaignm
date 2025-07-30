import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, Download, FileText, TrendingUp, DollarSign, Target, Zap, X, Sparkles } from 'lucide-react';
import { ProcessedData, DataRecord, CampaignStats, ETStats, CreativeStats, AdvertiserStats } from '../types';

interface UploadedFile {
  name: string;
  data: ProcessedData;
}

interface DashboardProps {
  data: ProcessedData;
  uploadedFiles: UploadedFile[];
  isDarkMode: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onReset: () => void;
}

interface CreativePopupProps {
  campaign: string;
  creatives: CreativeStats[];
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

interface CelebrationProps {
  show: boolean;
}

const CreativePopup: React.FC<CreativePopupProps> = ({ campaign, creatives, isOpen, onClose, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`max-w-4xl w-full max-h-[80vh] overflow-hidden rounded-xl shadow-2xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className="text-2xl font-bold">All Creatives - {campaign}</h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid gap-4">
            {creatives.map((creative, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-lg">{creative.name}</h4>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${creative.revenue.toLocaleString()}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Frequency: {creative.frequency}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Associated ETs:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {creative.ets.map((et, etIndex) => (
                      <span
                        key={etIndex}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isDarkMode 
                            ? 'bg-blue-900 text-blue-200' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {et}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Celebration: React.FC<CelebrationProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Confetti/Sprinkles */}
      {[...Array(50)].map((_, i) => (
        <div
          key={`confetti-${i}`}
          className="absolute animate-bounce"
          style={{
            left: i < 25 ? `${Math.random() * 20}%` : `${80 + Math.random() * 20}%`,
            top: `${60 + Math.random() * 40}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random() * 2}s`,
          }}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'][
                Math.floor(Math.random() * 6)
              ]
            }`}
            style={{
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        </div>
      ))}
      
      {/* Balloons */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`balloon-${i}`}
          className="absolute animate-pulse"
          style={{
            left: `${10 + i * 10}%`,
            bottom: '-100px',
            animation: `float-up 4s ease-out ${i * 0.5}s infinite`,
          }}
        >
          <div
            className={`w-8 h-10 rounded-full ${
              ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'][
                i % 6
              ]
            } shadow-lg`}
          />
          <div className="w-px h-8 bg-gray-400 mx-auto" />
        </div>
      ))}
      
      {/* Sparkles */}
      {[...Array(30)].map((_, i) => (
        <Sparkles
          key={`sparkle-${i}`}
          className="absolute text-yellow-400 animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${1 + Math.random()}s`,
          }}
          size={16 + Math.random() * 16}
        />
      ))}
      
      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ 
  data, 
  uploadedFiles, 
  isDarkMode, 
  searchQuery, 
  onSearchChange, 
  onReset 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'ets' | 'creatives' | 'advertisers'>('overview');
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [selectedET, setSelectedET] = useState<string | null>(null);
  const [creativePopup, setCreativePopup] = useState<{
    isOpen: boolean;
    campaign: string;
    creatives: CreativeStats[];
  }>({ isOpen: false, campaign: '', creatives: [] });
  const [showCelebration, setShowCelebration] = useState(false);

  const totalRevenue = useMemo(() => {
    return data.records.reduce((sum, record) => sum + record.revenue, 0);
  }, [data.records]);

  useEffect(() => {
    if (totalRevenue >= 12000) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [totalRevenue]);

  const filteredRecords = useMemo(() => {
    if (!searchQuery) return data.records;
    const query = searchQuery.toLowerCase();
    return data.records.filter(record =>
      record.campaign.toLowerCase().includes(query) ||
      record.creative.toLowerCase().includes(query) ||
      record.et.toLowerCase().includes(query) ||
      record.advertiser.toLowerCase().includes(query)
    );
  }, [data.records, searchQuery]);

  const campaignStats = useMemo((): CampaignStats[] => {
    const campaignMap = new Map<string, CampaignStats>();
    
    filteredRecords.forEach(record => {
      if (!campaignMap.has(record.campaign)) {
        campaignMap.set(record.campaign, {
          name: record.campaign,
          revenue: 0,
          creatives: [],
          ets: []
        });
      }
      
      const campaign = campaignMap.get(record.campaign)!;
      campaign.revenue += record.revenue;
      
      if (!campaign.ets.includes(record.et)) {
        campaign.ets.push(record.et);
      }
    });

    // Calculate creatives for each campaign
    campaignMap.forEach((campaign, campaignName) => {
      const creativeMap = new Map<string, CreativeStats>();
      
      filteredRecords
        .filter(record => record.campaign === campaignName)
        .forEach(record => {
          if (!creativeMap.has(record.creative)) {
            creativeMap.set(record.creative, {
              name: record.creative,
              frequency: 0,
              revenue: 0,
              ets: []
            });
          }
          
          const creative = creativeMap.get(record.creative)!;
          creative.frequency += 1;
          creative.revenue += record.revenue;
          
          if (!creative.ets.includes(record.et)) {
            creative.ets.push(record.et);
          }
        });
      
      campaign.creatives = Array.from(creativeMap.values())
        .sort((a, b) => b.revenue - a.revenue);
    });

    return Array.from(campaignMap.values()).sort((a, b) => b.revenue - a.revenue);
  }, [filteredRecords]);

  const etStats = useMemo((): ETStats[] => {
    const etMap = new Map<string, ETStats>();
    
    filteredRecords.forEach(record => {
      if (!etMap.has(record.et)) {
        etMap.set(record.et, {
          name: record.et,
          revenue: 0,
          creatives: [],
          campaigns: []
        });
      }
      
      const et = etMap.get(record.et)!;
      et.revenue += record.revenue;
      
      if (!et.campaigns.includes(record.campaign)) {
        et.campaigns.push(record.campaign);
      }
    });

    // Calculate creatives for each ET
    etMap.forEach((et, etName) => {
      const creativeMap = new Map<string, CreativeStats>();
      
      filteredRecords
        .filter(record => record.et === etName)
        .forEach(record => {
          if (!creativeMap.has(record.creative)) {
            creativeMap.set(record.creative, {
              name: record.creative,
              frequency: 0,
              revenue: 0,
              ets: [etName]
            });
          }
          
          const creative = creativeMap.get(record.creative)!;
          creative.frequency += 1;
          creative.revenue += record.revenue;
        });
      
      et.creatives = Array.from(creativeMap.values())
        .sort((a, b) => b.revenue - a.revenue);
    });

    return Array.from(etMap.values()).sort((a, b) => b.revenue - a.revenue);
  }, [filteredRecords]);

  const advertiserStats = useMemo((): AdvertiserStats[] => {
    const advertiserMap = new Map<string, AdvertiserStats>();
    
    filteredRecords.forEach(record => {
      if (!advertiserMap.has(record.advertiser)) {
        advertiserMap.set(record.advertiser, {
          name: record.advertiser,
          revenue: 0,
          campaigns: []
        });
      }
      
      const advertiser = advertiserMap.get(record.advertiser)!;
      advertiser.revenue += record.revenue;
      
      if (!advertiser.campaigns.includes(record.campaign)) {
        advertiser.campaigns.push(record.campaign);
      }
    });

    return Array.from(advertiserMap.values()).sort((a, b) => b.revenue - a.revenue);
  }, [filteredRecords]);

  const topCreatives = useMemo(() => {
    const creativeMap = new Map<string, CreativeStats>();
    
    filteredRecords.forEach(record => {
      if (!creativeMap.has(record.creative)) {
        creativeMap.set(record.creative, {
          name: record.creative,
          frequency: 0,
          revenue: 0,
          ets: []
        });
      }
      
      const creative = creativeMap.get(record.creative)!;
      creative.frequency += 1;
      creative.revenue += record.revenue;
      
      if (!creative.ets.includes(record.et)) {
        creative.ets.push(record.et);
      }
    });

    return Array.from(creativeMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [filteredRecords]);

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

  const handleCampaignClick = (campaignName: string) => {
    const campaign = campaignStats.find(c => c.name === campaignName);
    if (campaign) {
      setCreativePopup({
        isOpen: true,
        campaign: campaignName,
        creatives: campaign.creatives
      });
    }
  };

  const exportData = () => {
    const csvContent = [
      ['SUBID', 'Revenue', 'Campaign', 'Creative', 'ET', 'Advertiser', 'File'],
      ...filteredRecords.map(record => [
        record.subid,
        record.revenue,
        record.campaign,
        record.creative,
        record.et,
        record.advertiser,
        record.fileName
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaign_analysis.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Celebration show={showCelebration} />
      
      <CreativePopup
        campaign={creativePopup.campaign}
        creatives={creativePopup.creatives}
        isOpen={creativePopup.isOpen}
        onClose={() => setCreativePopup({ isOpen: false, campaign: '', creatives: [] })}
        isDarkMode={isDarkMode}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Campaign Analytics Dashboard</h2>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Analyzing {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} • {filteredRecords.length} records
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportData}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode 
                ? 'bg-green-700 hover:bg-green-600 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={onReset}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            Upload New Files
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
        <input
          type="text"
          placeholder="Search campaigns, creatives, ETs, or advertisers..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`p-6 rounded-xl border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } ${totalRevenue >= 12000 ? 'ring-2 ring-yellow-400 shadow-lg' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Revenue
              </p>
              <p className={`text-3xl font-bold ${totalRevenue >= 12000 ? 'text-yellow-500' : 'text-green-600'}`}>
                ${totalRevenue.toLocaleString()}
              </p>
              {totalRevenue >= 12000 && (
                <p className="text-sm text-yellow-600 font-medium flex items-center mt-1">
                  <Sparkles className="h-4 w-4 mr-1" />
                  Target Achieved! 🎉
                </p>
              )}
            </div>
            <DollarSign className={`h-8 w-8 ${totalRevenue >= 12000 ? 'text-yellow-500' : 'text-green-600'}`} />
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Campaigns
              </p>
              <p className="text-3xl font-bold text-blue-600">{campaignStats.length}</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total ETs
              </p>
              <p className="text-3xl font-bold text-purple-600">{etStats.length}</p>
            </div>
            <Zap className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Avg Revenue/Record
              </p>
              <p className="text-3xl font-bold text-orange-600">
                ${filteredRecords.length > 0 ? (totalRevenue / filteredRecords.length).toFixed(2) : '0.00'}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'campaigns', label: 'Campaign Analysis' },
            { id: 'ets', label: 'ET Analysis' },
            { id: 'creatives', label: 'Creative Analysis' },
            { id: 'advertisers', label: 'Advertiser Analysis' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : isDarkMode
                  ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-300'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`p-6 rounded-xl border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className="text-xl font-bold mb-4">Revenue by Campaign</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignStats.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
                <XAxis 
                  dataKey="name" 
                  stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
                  fontSize={12}
                />
                <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={`p-6 rounded-xl border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className="text-xl font-bold mb-4">Revenue by Advertiser</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={advertiserStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="revenue"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                >
                  {advertiserStats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-xl border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className="text-xl font-bold mb-6">Top Performing Creatives</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topCreatives.slice(0, 6).map((creative, index) => (
                <div
                  key={index}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600 hover:border-blue-500' 
                      : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1 truncate" title={creative.name}>
                        {creative.name}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                        }`}>
                          #{index + 1}
                        </span>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {creative.frequency} records
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ${creative.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      ETs ({creative.ets.length}):
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {creative.ets.slice(0, 3).map((et, etIndex) => (
                        <span
                          key={etIndex}
                          className={`px-2 py-1 rounded text-xs ${
                            isDarkMode 
                              ? 'bg-purple-900 text-purple-200' 
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {et}
                        </span>
                      ))}
                      {creative.ets.length > 3 && (
                        <span className={`px-2 py-1 rounded text-xs ${
                          isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                        }`}>
                          +{creative.ets.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Performance indicator */}
                  <div className="absolute top-2 right-2">
                    {index === 0 && <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" title="Top Performer" />}
                    {index === 1 && <div className="w-3 h-3 bg-gray-400 rounded-full" title="Second Best" />}
                    {index === 2 && <div className="w-3 h-3 bg-orange-400 rounded-full" title="Third Best" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className="text-xl font-bold mb-4">Campaign-Wise Revenue Breakdown</h3>
            <div className="space-y-4">
              {campaignStats.map((campaign, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => handleCampaignClick(campaign.name)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-lg">{campaign.name}</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {campaign.creatives.length} creatives • {campaign.ets.length} ETs
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ${campaign.revenue.toLocaleString()}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Click to view creatives
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ets' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-xl border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className="text-xl font-bold mb-4">ET-Wise Revenue Breakdown</h3>
            <div className="space-y-4">
              {etStats.map((et, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    selectedET === et.name ? 'ring-2 ring-blue-500' : ''
                  } ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{et.name}</h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {et.creatives.length} creatives • {et.campaigns.length} campaigns
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ${et.revenue.toLocaleString()}
                      </div>
                      <button
                        onClick={() => setSelectedET(selectedET === et.name ? null : et.name)}
                        className={`text-sm px-3 py-1 rounded-full transition-colors ${
                          isDarkMode 
                            ? 'bg-blue-700 hover:bg-blue-600 text-white' 
                            : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                        }`}
                      >
                        {selectedET === et.name ? 'Hide' : 'View'} Creatives
                      </button>
                    </div>
                  </div>
                  
                  {selectedET === et.name && (
                    <div className={`mt-4 p-4 rounded-lg border-2 border-dashed ${
                      isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'
                    }`}>
                      <h5 className="font-semibold mb-3 text-lg">All Creatives of {et.name}</h5>
                      <div className="grid gap-3">
                        {et.creatives.map((creative, creativeIndex) => (
                          <div
                            key={creativeIndex}
                            className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' 
                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h6 className="font-medium">{creative.name}</h6>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Frequency: {creative.frequency}
                                </p>
                              </div>
                              <div className="text-lg font-bold text-green-600">
                                ${creative.revenue.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'creatives' && (
        <div className={`p-6 rounded-xl border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-xl font-bold mb-4">All Creatives Performance</h3>
          <div className="grid gap-4">
            {topCreatives.map((creative, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{creative.name}</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Frequency: {creative.frequency} • ETs: {creative.ets.length}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    ${creative.revenue.toLocaleString()}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {creative.ets.map((et, etIndex) => (
                    <span
                      key={etIndex}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isDarkMode 
                          ? 'bg-blue-900 text-blue-200' 
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {et}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'advertisers' && (
        <div className={`p-6 rounded-xl border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-xl font-bold mb-4">Advertiser Performance</h3>
          <div className="grid gap-4">
            {advertiserStats.map((advertiser, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{advertiser.name}</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {advertiser.campaigns.length} campaigns
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    ${advertiser.revenue.toLocaleString()}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {advertiser.campaigns.map((campaign, campaignIndex) => (
                    <span
                      key={campaignIndex}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isDarkMode 
                          ? 'bg-purple-900 text-purple-200' 
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {campaign}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;