import React, { useState } from 'react';
import { 
  Calendar, 
  Edit, 
  Save, 
  Trash2, 
  Filter, 
  SortAsc, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  Tag,
  Brain
} from 'lucide-react';

// Mock data for trades
const mockTrades = [
  {
    id: 1,
    date: '2024-03-15',
    asset: 'BTC/USD',
    type: 'Long',
    entry: 65432,
    exit: 67890,
    volume: 0.5,
    pnl: 1229,
    roi: 3.75,
    notes: 'Followed the breakout strategy perfectly. Waited for confirmation before entry.',
    emotions: ['Calm', 'Confident']
  },
  {
    id: 2,
    date: '2024-03-14',
    asset: 'ETH/USD',
    type: 'Short',
    entry: 3200,
    exit: 3150,
    volume: 2,
    pnl: 100,
    roi: 1.56,
    notes: 'Hesitated on entry, could have entered earlier for better position.',
    emotions: ['Hesitant', 'Anxious']
  },
  {
    id: 3,
    date: '2024-03-13',
    asset: 'BTC/USD',
    type: 'Short',
    entry: 68000,
    exit: 67500,
    volume: 0.3,
    pnl: 150,
    roi: 0.74,
    notes: 'Revenge trade after previous loss. Need to be more disciplined.',
    emotions: ['Revenge', 'Impulsive']
  },
  {
    id: 4,
    date: '2024-03-12',
    asset: 'SOL/USD',
    type: 'Long',
    entry: 120,
    exit: 118,
    volume: 10,
    pnl: -20,
    roi: -1.67,
    notes: 'FOMO entry without proper analysis. Lesson learned.',
    emotions: ['FOMO', 'Greedy']
  },
  {
    id: 5,
    date: '2024-03-11',
    asset: 'XRP/USD',
    type: 'Long',
    entry: 0.50,
    exit: 0.55,
    volume: 1000,
    pnl: 50,
    roi: 10.0,
    notes: 'Followed the plan perfectly. Good risk management.',
    emotions: ['Calm', 'Disciplined']
  }
];

// Available emotion tags
const emotionTags = [
  'Calm', 'Confident', 'Disciplined', 'Patient',
  'Hesitant', 'Anxious', 'Fearful', 'Doubtful',
  'FOMO', 'Greedy', 'Excited', 'Overconfident',
  'Revenge', 'Angry', 'Frustrated', 'Impulsive'
];

export const  Notebook = () => {
  const [trades, setTrades] = useState(mockTrades);
  const [selectedTrade, setSelectedTrade] = useState(trades[0]);
  const [editMode, setEditMode] = useState(false);
  const [editedNotes, setEditedNotes] = useState(selectedTrade?.notes || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [emotionFilter, setEmotionFilter] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // Filter trades based on search term and emotion filter
  const filteredTrades = trades.filter(trade => {
    const matchesSearch = searchTerm === '' || 
      trade.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEmotion = emotionFilter === '' || 
      trade.emotions.includes(emotionFilter);
    
    return matchesSearch && matchesEmotion;
  });

  const handleTradeSelect = (trade: typeof selectedTrade) => {
    if (editMode) {
      // Prompt user to save changes before switching
      if (window.confirm('You have unsaved changes. Save before switching?')) {
        handleSaveNotes();
      }
    }
    setSelectedTrade(trade);
    setEditedNotes(trade.notes);
    setEditMode(false);
    
    // Simulate AI suggestions based on trade notes
    simulateAiSuggestions(trade);
  };

  const handleEditNotes = () => {
    setEditMode(true);
  };

  const handleSaveNotes = () => {
    if (!selectedTrade) return;
    
    // Update the selected trade with edited notes
    const updatedTrades = trades.map(trade => 
      trade.id === selectedTrade.id 
        ? { ...trade, notes: editedNotes } 
        : trade
    );
    
    setTrades(updatedTrades);
    setSelectedTrade({ ...selectedTrade, notes: editedNotes });
    setEditMode(false);
  };

  const handleAddEmotion = (emotion: string) => {
    if (!selectedTrade) return;
    
    // Don't add duplicate emotions
    if (selectedTrade.emotions.includes(emotion)) return;
    
    const updatedEmotions = [...selectedTrade.emotions, emotion];
    const updatedTrades = trades.map(trade => 
      trade.id === selectedTrade.id 
        ? { ...trade, emotions: updatedEmotions } 
        : trade
    );
    
    setTrades(updatedTrades);
    setSelectedTrade({ ...selectedTrade, emotions: updatedEmotions });
  };

  const handleRemoveEmotion = (emotion: string) => {
    if (!selectedTrade) return;
    
    const updatedEmotions = selectedTrade.emotions.filter(e => e !== emotion);
    const updatedTrades = trades.map(trade => 
      trade.id === selectedTrade.id 
        ? { ...trade, emotions: updatedEmotions } 
        : trade
    );
    
    setTrades(updatedTrades);
    setSelectedTrade({ ...selectedTrade, emotions: updatedEmotions });
  };

  // Simulate AI suggestions based on trade notes and performance
  const simulateAiSuggestions = (trade: typeof selectedTrade) => {
    // This would be replaced with actual AI analysis in production
    const suggestions: string[] = [];
    
    // Simple keyword-based suggestion logic
    if (trade.notes.toLowerCase().includes('hesitat')) {
      suggestions.push('Hesitant');
    }
    
    if (trade.notes.toLowerCase().includes('fomo')) {
      suggestions.push('FOMO');
    }
    
    if (trade.notes.toLowerCase().includes('revenge')) {
      suggestions.push('Revenge');
    }
    
    if (trade.notes.toLowerCase().includes('calm') || 
        trade.notes.toLowerCase().includes('disciplin')) {
      suggestions.push('Disciplined');
    }
    
    // Performance-based suggestions
    if (trade.pnl < 0 && trade.type === 'Long' && trade.roi < -5) {
      suggestions.push('Overconfident');
    }
    
    // Filter out emotions already tagged
    const filteredSuggestions = suggestions.filter(
      suggestion => !trade.emotions.includes(suggestion)
    );
    
    setAiSuggestions(filteredSuggestions);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trade Notebook</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search trades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <select
            value={emotionFilter}
            onChange={(e) => setEmotionFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">All Emotions</option>
            {emotionTags.map(emotion => (
              <option key={emotion} value={emotion}>{emotion}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Trade List Panel */}
        <div className="col-span-1 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="font-semibold">Trade History</h2>
            <button className="p-2 hover:bg-gray-700 rounded-lg">
              <SortAsc className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
            {filteredTrades.map(trade => (
              <div 
                key={trade.id}
                onClick={() => handleTradeSelect(trade)}
                className={`p-4 border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer transition-colors ${
                  selectedTrade?.id === trade.id ? 'bg-gray-700' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{trade.date}</span>
                  </div>
                  <span className={`flex items-center gap-1 text-sm ${
                    trade.type === 'Long' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {trade.type === 'Long' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {trade.asset}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {trade.entry} → {trade.exit}
                  </span>
                  <span className={`font-semibold ${
                    trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl}
                  </span>
                </div>
                {trade.emotions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {trade.emotions.slice(0, 2).map(emotion => (
                      <span 
                        key={emotion} 
                        className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full text-xs"
                      >
                        {emotion}
                      </span>
                    ))}
                    {trade.emotions.length > 2 && (
                      <span className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full text-xs">
                        +{trade.emotions.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Trade Details Panel */}
        <div className="col-span-2 space-y-6">
          {selectedTrade ? (
            <>
              {/* Trade Overview Card */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
                      <span className={`${
                        selectedTrade.type === 'Long' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {selectedTrade.type}
                      </span>
                      {selectedTrade.asset}
                    </h2>
                    <div className="text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {selectedTrade.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      selectedTrade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {selectedTrade.pnl >= 0 ? '+' : ''}${selectedTrade.pnl}
                    </div>
                    <div className={`text-sm ${
                      selectedTrade.roi >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {selectedTrade.roi >= 0 ? '+' : ''}{selectedTrade.roi}% ROI
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Entry</div>
                    <div className="font-medium">${selectedTrade.entry}</div>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Exit</div>
                    <div className="font-medium">${selectedTrade.exit}</div>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Volume</div>
                    <div className="font-medium">{selectedTrade.volume}</div>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Type</div>
                    <div className={`font-medium ${
                      selectedTrade.type === 'Long' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {selectedTrade.type}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Trade Notes</h3>
                  {editMode ? (
                    <button 
                      onClick={handleSaveNotes}
                      className="p-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1"
                    >
                      <Save className="w-4 h-4" />
                      <span className="text-sm">Save</span>
                    </button>
                  ) : (
                    <button 
                      onClick={handleEditNotes}
                      className="p-2 hover:bg-gray-700 rounded-lg flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="text-sm">Edit</span>
                    </button>
                  )}
                </div>
                
                {editMode ? (
                  <textarea
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    className="w-full h-32 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Add your trade notes here..."
                  />
                ) : (
                  <div className="bg-gray-900/50 p-4 rounded-lg min-h-[80px]">
                    {selectedTrade.notes || "No notes added yet."}
                  </div>
                )}
              </div>

              {/* Emotional Tags Section */}
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Emotional Tags</h3>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      {selectedTrade.emotions.length} tags
                    </span>
                  </div>
                </div>

                {/* Current Tags */}
                <div className="mb-4">
                  <h4 className="text-sm text-gray-400 mb-2">Current Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrade.emotions.length > 0 ? (
                      selectedTrade.emotions.map(emotion => (
                        <div 
                          key={emotion}
                          className="flex items-center gap-1 px-3 py-1 bg-gray-700 rounded-full"
                        >
                          <span>{emotion}</span>
                          <button 
                            onClick={() => handleRemoveEmotion(emotion)}
                            className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-gray-600"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">No emotions tagged yet</div>
                    )}
                  </div>
                </div>

                {/* AI Suggestions */}
                {aiSuggestions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm text-gray-400 mb-2 flex items-center gap-1">
                      <Brain className="w-4 h-4 text-purple-400" />
                      AI Suggested Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.map(emotion => (
                        <button
                          key={emotion}
                          onClick={() => handleAddEmotion(emotion)}
                          className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full hover:bg-purple-500/30 transition-colors"
                        >
                          {emotion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Tags */}
                <div>
                  <h4 className="text-sm text-gray-400 mb-2">Add Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {emotionTags
                      .filter(emotion => !selectedTrade.emotions.includes(emotion))
                      .map(emotion => (
                        <button
                          key={emotion}
                          onClick={() => handleAddEmotion(emotion)}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm transition-colors"
                        >
                          {emotion}
                        </button>
                      ))
                    }
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 flex items-center justify-center h-64">
              <p className="text-gray-400">Select a trade to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}