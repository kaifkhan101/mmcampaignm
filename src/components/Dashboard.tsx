import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, Search, Upload, X, Eye, TrendingUp, DollarSign, Target, Users, BarChart3 } from 'lucide-react';
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

interface CreativePopupData {
  campaign: string;
  creatives: CreativeStats[];
  et: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  data,
  uploadedFiles,
  isDarkMode,
  searchQuery,
  onSearchChange,
  onReset
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'ets' | 'advertisers'>('overview');
  const [selectedET, setSelectedET] = useState<string | null>(null);
  const [creativePopup, setCreativePopup] = useState<CreativePopupData | null>(null);

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRevenue = data.records.reduce((sum, record) => sum + record.revenue, 0);
    const totalRecords = data.records.length;
    const uniqueSubids = new Set(data.records.map(r => r.subid)).size;
    
    return {
      totalRevenue,
      totalRecords,
      uniqueSubids,
      totalCampaigns: data.campaigns.size,
      totalETs: data.ets.size,
      totalCreatives: data.creatives.size,
      totalAdvertisers: data.advertisers.size
    };
  }, [data]);

  // Calculate campaign statistics
  const campaignStats = useMemo((): CampaignStats[] => {
    const campaignMap = new Map<string, CampaignStats>();
    
    data.records.forEach(record => {
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

    // Calculate creative stats for each campaign
    campaignMap.forEach((campaign, campaignName) => {
      const creativeMap = new Map<string, CreativeStats>();
      
      data.records
        .filter(r => r.campaign === campaignName)
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
  }, [data]);

  // Calculate ET statistics
  const etStats = useMemo((): ETStats[] => {
    const etMap = new Map<string, ETStats>();
    
    data.records.forEach(record => {
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

    // Calculate creative stats for each ET
    etMap.forEach((et, etName) => {
      const creativeMap = new Map<string, CreativeStats>();
      
      data.records
        .filter(r => r.et === etName)
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
      
      et.creatives = Array.from(creativeMap.values())
        .sort((a, b) => b.revenue - a.revenue);
    });

    return Array.from(etMap.values()).sort((a, b) => b.revenue - a.revenue);
  }, [data]);

  // Calculate advertiser statistics
  const advertiserStats = useMemo((): AdvertiserStats[] => {
    const advertiserMap = new Map<string, AdvertiserStats>();
    
    data.records.forEach(record => {
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
  }, [data]);

  // Filter data based on search query
  const filteredCampaignStats = useMemo(() => {
    if (!searchQuery) return campaignStats;
    return campaignStats.filter(campaign => 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [campaignStats, searchQuery]);

  const filteredETStats = useMemo(() => {
    if (!searchQuery) return etStats;
    return etStats.filter(et => 
      et.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [etStats, searchQuery]);

  const filteredAdvertiserStats = useMemo(() => {
    if (!searchQuery) return advertiserStats;
    return advertiserStats.filter(advertiser => 
      advertiser.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [advertiserStats, searchQuery]);

  // Get filtered ET campaigns for ET Analysis
  const getETCampaignStats = (etName: string) => {
    const etCampaignMap = new Map<string, { name: string; revenue: number; creatives: CreativeStats[] }>();
    
    data.records
      .filter(r => r.et === etName)
      .forEach(record => {
        if (!etCampaignMap.has(record.campaign)) {
          etCampaignMap.set(record.campaign, {
            name: record.campaign,
            revenue: 0,
            creatives: []
          });
        }
        
        const campaign = etCampaignMap.get(record.campaign)!;
        campaign.revenue += record.revenue;
      });

    // Calculate creative stats for each campaign within this ET
    etCampaignMap.forEach((campaign, campaignName) => {
      const creativeMap = new Map<string, CreativeStats>();
      
      data.records
        .filter(r => r.et === etName && r.campaign === campaignName)
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

    return Array.from(etCampaignMap.values()).sort((a, b) => b.revenue - a.revenue);
  };

  const exportToCSV = () => {
    const headers = ['SUBID', 'Revenue', 'Campaign', 'Creative', 'ET', 'Advertiser', 'File Name'];
    const csvContent = [
      headers.join(','),
      ...data.records.map(record => [
        record.subid,
        record.revenue,
        record.campaign,
        record.creative,
        record.et,
        record.advertiser,
        record.fileName
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaign_analysis.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCampaignClick = (campaign: string, creatives: CreativeStats[], et: string) => {
    setCreativePopup({ campaign, creatives, et });
  };

  const closeCreativePopup = () => {
    setCreativePopup(null);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Revenue
              </p>
              <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className={`p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Records
              </p>
              <p className="text-2xl font-bold">{stats.totalRecords.toLocaleString()}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className={`p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Campaigns
              </p>
              <p className="text-2xl font-bold">{stats.totalCampaigns}</p>
            </div>
            <Target className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className={`p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Advertisers
              </p>
              <p className="text-2xl font-bold">{stats.totalAdvertisers}</p>
            </div>
            <Users className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-lg font-semibold mb-4">Top 10 Campaigns by Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaignStats.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
              <XAxis 
                dataKey="name" 
                stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
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
              <Bar dataKey="revenue" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`p-6 rounded-lg border ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className="text-lg font-semibold mb-4">Revenue by Advertiser</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={advertiserStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="revenue"
              >
                {advertiserStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* File Summary */}
      <div className={`p-6 rounded-lg border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className="text-lg font-semibold mb-4">Uploaded Files ({uploadedFiles.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {uploadedFiles.map((file, index) => (
            <div key={index} className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center mb-2">
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                <span className="font-medium truncate">{file.name}</span>
              </div>
              <div className="text-sm space-y-1">
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Records: {file.data.records.length.toLocaleString()}
                </p>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Revenue: ${file.data.records.reduce((sum, r) => sum + r.revenue, 0).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCampaigns = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Campaign Analysis</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredCampaignStats.map((campaign, index) => (
          <div key={campaign.name} className={`p-6 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{campaign.name}</h3>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  ${campaign.revenue.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {campaign.creatives.length} Creatives
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {campaign.ets.length} ETs
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Active Creatives</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {campaign.creatives.slice(0, 6).map((creative) => (
                  <div key={creative.name} className={`p-3 rounded border ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <p className="font-medium text-sm truncate">{creative.name}</p>
                    <p className="text-xs text-green-600">${creative.revenue.toLocaleString()}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Freq: {creative.frequency}
                    </p>
                  </div>
                ))}
                {campaign.creatives.length > 6 && (
                  <div className={`p-3 rounded border border-dashed ${
                    isDarkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-600'
                  } flex items-center justify-center`}>
                    <span className="text-sm">+{campaign.creatives.length - 6} more</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Associated ETs</h4>
              <div className="flex flex-wrap gap-2">
                {campaign.ets.map((et) => (
                  <span key={et} className={`px-3 py-1 rounded-full text-sm ${
                    isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {et}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderETs = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ET Analysis</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search ETs..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredETStats.map((et) => (
          <div key={et.name} className={`p-6 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{et.name}</h3>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  ${et.revenue.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {et.creatives.length} Creatives
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {et.campaigns.length} Campaigns
                </p>
                <button
                  onClick={() => setSelectedET(selectedET === et.name ? null : et.name)}
                  className={`mt-2 px-3 py-1 rounded text-sm transition-colors ${
                    selectedET === et.name
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedET === et.name ? 'Hide Details' : 'View Details'}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Associated Campaigns</h4>
              <div className="flex flex-wrap gap-2">
                {et.campaigns.map((campaign) => (
                  <span key={campaign} className={`px-3 py-1 rounded-full text-sm ${
                    isDarkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {campaign}
                  </span>
                ))}
              </div>
            </div>

            {selectedET === et.name && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium mb-4">Campaign-Wise Revenue Breakdown</h4>
                <div className="grid gap-4">
                  {getETCampaignStats(et.name).map((campaign) => (
                    <div key={campaign.name} className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => handleCampaignClick(campaign.name, campaign.creatives, et.name)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium">{campaign.name}</h5>
                          <p className="text-green-600 font-semibold">
                            ${campaign.revenue.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {campaign.creatives.length} Creatives
                          </p>
                          <Eye className="h-4 w-4 mt-1 text-blue-500" />
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

      {/* Creative Popup */}
      {creativePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-4xl w-full max-h-[80vh] overflow-y-auto rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold">{creativePopup.campaign}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    ET: {creativePopup.et} • {creativePopup.creatives.length} Creatives
                  </p>
                </div>
                <button
                  onClick={closeCreativePopup}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid gap-4">
                {creativePopup.creatives.map((creative, index) => (
                  <div key={creative.name} className={`p-4 rounded-lg border ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">{creative.name}</h4>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                          ${creative.revenue.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Frequency: {creative.frequency}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Associated ETs</h5>
                      <div className="flex flex-wrap gap-2">
                        {creative.ets.map((et) => (
                          <span key={et} className={`px-2 py-1 rounded text-xs ${
                            isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                          }`}>
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
      )}
    </div>
  );

  const renderAdvertisers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Advertiser Analysis</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search advertisers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredAdvertiserStats.map((advertiser) => (
          <div key={advertiser.name} className={`p-6 rounded-lg border ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{advertiser.name}</h3>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  ${advertiser.revenue.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {advertiser.campaigns.length} Campaigns
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Associated Campaigns</h4>
              <div className="flex flex-wrap gap-2">
                {advertiser.campaigns.map((campaign) => (
                  <span key={campaign} className={`px-3 py-1 rounded-full text-sm ${
                    isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                  }`}>
                    {campaign}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Campaign Dashboard</h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Comprehensive analysis of {stats.totalRecords.toLocaleString()} records
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={onReset}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload New Files
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'campaigns', label: 'Campaigns', icon: Target },
            { id: 'ets', label: 'ETs', icon: BarChart3 },
            { id: 'advertisers', label: 'Advertisers', icon: Users }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id as any);
                setSelectedET(null);
                onSearchChange('');
              }}
              className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : isDarkMode
                  ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'campaigns' && renderCampaigns()}
      {activeTab === 'ets' && renderETs()}
      {activeTab === 'advertisers' && renderAdvertisers()}
    </div>
  );
};

export default Dashboard;