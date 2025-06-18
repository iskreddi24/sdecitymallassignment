import React, { useState, useEffect, useRef } from 'react';

// Main App Component
export default function App() {
  // State Management
  const [memes, setMemes] = useState([]);
  const [newMeme, setNewMeme] = useState({ title: '', imageUrl: '', tags: '' });
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState('gallery');
  const [currentBids, setCurrentBids] = useState({});
  const [votedMemes, setVotedMemes] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [aiCaptions, setAiCaptions] = useState({});
  const [aiVibes, setAiVibes] = useState({});
  
  // Sample user (mock auth)
  const currentUser = "cyberpunk420";

  // Mock AI captions and vibes
  const mockCaptions = [
    "Doge hacks the matrix",
    "To the MOON!",
    "HODL the vibes!",
    "Retro Stonks Vibes",
    "Neon Crypto Chaos",
    "Brrr goes stonks"
  ];

  const mockVibes = [
    "Cyberpunk Dreamscape",
    "Digital Nostalgia",
    "Synthwave Sunrise",
    "Glitch City Vibes",
    "Pixel Paradise",
    "Quantum Quirks"
  ];

  // Initialize with sample data
  useEffect(() => {
    const initialMemes = [
      { id: "1", title: "Doge HODL", image_url: "https://picsum.photos/300/200?random=1", tags: ["crypto", "funny"], upvotes: 69 },
      { id: "2", title: "Stonks Go BRRR", image_url: "https://picsum.photos/300/200?random=2", tags: ["stocks", "meme"], upvotes: 42 },
      { id: "3", title: "Neon Cat Vibes", image_url: "https://picsum.photos/300/200?random=3", tags: ["cats", "cyberpunk"], upvotes: 88 },
      { id: "4", title: "Matrix of Memes", image_url: "https://picsum.photos/300/200?random=4", tags: ["tech", "glitch"], upvotes: 55 },
    ];
    
    setMemes(initialMemes);
    
    // Initialize current bids
    const bids = {};
    initialMemes.forEach(meme => {
      bids[meme.id] = { amount: Math.floor(Math.random() * 1000), user: "user" + Math.floor(Math.random() * 10) };
    });
    setCurrentBids(bids);
    
    // Initialize leaderboard
    setLeaderboard([...initialMemes].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3));
    
    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Generate AI caption (mock for this example)
  const generateCaption = (tags) => {
    const randomIndex = Math.floor(Math.random() * mockCaptions.length);
    return mockCaptions[randomIndex];
  };

  // Generate AI vibe (mock for this example)
  const generateVibe = (tags) => {
    const randomIndex = Math.floor(Math.random() * mockVibes.length);
    return mockVibes[randomIndex];
  };

  // Handle meme creation
  const handleCreateMeme = (e) => {
    e.preventDefault();
    if (!newMeme.title || !newMeme.imageUrl) return;
    
    const tagsArray = newMeme.tags.split(',').map(tag => tag.trim());
    const newId = (memes.length + 1).toString();
    
    const meme = {
      id: newId,
      title: newMeme.title,
      image_url: newMeme.imageUrl || "https://picsum.photos/300/200?random=" + newId,
      tags: tagsArray,
      upvotes: 0
    };
    
    setMemes([meme, ...memes]);
    
    // Reset form
    setNewMeme({ title: '', imageUrl: '', tags: '' });
    
    // Generate AI caption and vibe
    const caption = generateCaption(tagsArray);
    const vibe = generateVibe(tagsArray);
    setAiCaptions(prev => ({ ...prev, [newId]: caption }));
    setAiVibes(prev => ({ ...prev, [newId]: vibe }));
    
    // Update leaderboard
    updateLeaderboard([...memes, meme]);
  };

  // Handle voting
  const handleVote = (memeId, type) => {
    if (votedMemes.has(memeId)) return;
    
    setMemes(memes.map(meme => 
      meme.id === memeId 
        ? { ...meme, upvotes: meme.upvotes + (type === 'up' ? 1 : -1) } 
        : meme
    ));
    
    setVotedMemes(new Set(votedMemes).add(memeId));
    
    // Update leaderboard
    updateLeaderboard(memes.map(meme => 
      meme.id === memeId 
        ? { ...meme, upvotes: meme.upvotes + (type === 'up' ? 1 : -1) } 
        : meme
    ));
    
    // Simulate real-time update via WebSocket
    simulateWebSocketUpdate(`vote:${memeId}:${type}`);
  };

  // Update leaderboard
  const updateLeaderboard = (allMemes) => {
    const sorted = [...allMemes].sort((a, b) => b.upvotes - a.upvotes).slice(0, 10);
    setLeaderboard(sorted);
  };

  // Handle bidding
  const handleBid = (memeId, amount) => {
    if (isNaN(amount) || amount <= 0) return;
    
    setCurrentBids(prev => ({
      ...prev,
      [memeId]: { amount: parseInt(amount), user: currentUser }
    }));
    
    // Simulate real-time update via WebSocket
    simulateWebSocketUpdate(`bid:${memeId}:${currentUser}:${amount}`);
  };

  // Simulate WebSocket updates (in a real app, this would be connected to actual WebSocket)
  const simulateWebSocketUpdate = (data) => {
    // In a real implementation, we'd emit this via Socket.IO
    console.log("WebSocket update:", data);
  };

  // Cyberpunk glitch animation component
  const GlitchText = ({ text }) => (
    <span className="relative inline-block group">
      <span className="neon-text">{text}</span>
      <span className="neon-text glitch absolute top-0 left-0 opacity-75 group-hover:animate-glitch-anim">
        {text}
      </span>
      <span className="neon-text glitch absolute top-0 left-0 opacity-50 group-hover:animate-glitch-anim-delayed">
        {text}
      </span>
    </span>
  );

  // Terminal-style typing effect component
  const TerminalTyping = ({ text, speed = 100 }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, speed);
        return () => clearTimeout(timeout);
      }
    }, [currentIndex, text, speed]);

    return (
      <div className="terminal-cursor">
        {displayedText}
        <span className="animate-pulse">|</span>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <TerminalTyping text="Initializing MemeHustle v2.0..." />
          <div className="mt-4 h-2 w-full bg-gray-900">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-loading-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Cyberpunk Header */}
      <header className="border-b border-green-700/30 p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto relative z-10">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold neon-text">
              <GlitchText text="MEMEHUSTLE" />
            </h1>
            <nav>
              <ul className="flex space-x-4">
                {['gallery', 'create', 'leaderboard'].map(tab => (
                  <li key={tab}>
                    <button 
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded transition-all ${activeTab === tab 
                        ? 'bg-purple-900/50 border border-purple-500/50' 
                        : 'hover:bg-green-900/20'}`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 pt-8">
        {/* Gallery View */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-6 neon-text-glow">
                <GlitchText text="Trending Memes" />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memes.map(meme => (
                  <div 
                    key={meme.id} 
                    className="bg-black/30 backdrop-blur-sm border border-green-700/20 rounded-lg overflow-hidden transform transition-all hover:scale-105 hover:border-green-500/50"
                  >
                    <div className="relative">
                      <img 
                        src={meme.image_url} 
                        alt={meme.title} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-purple-900/70 px-2 py-1 rounded text-xs font-bold">
                        ID: {meme.id}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold mb-2 neon-text">{meme.title}</h3>
                        <span className="text-green-400 font-bold">{meme.upvotes} UPVOTES</span>
                      </div>
                      
                      <div className="mb-3">
                        <span className="text-purple-400">Tags:</span> {meme.tags.join(', ')}
                      </div>
                      
                      <div className="mb-3">
                        <span className="text-blue-400">AI Caption:</span> {aiCaptions[meme.id] || "Loading..."}
                      </div>
                      
                      <div className="mb-3">
                        <span className="text-pink-400">Vibe:</span> {aiVibes[meme.id] || "Analyzing..."}
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleVote(meme.id, 'up')}
                            disabled={votedMemes.has(meme.id)}
                            className={`px-3 py-1 rounded transition-all ${
                              votedMemes.has(meme.id) 
                                ? 'bg-green-900/30 cursor-not-allowed' 
                                : 'bg-green-900/50 hover:bg-green-700/50'
                            }`}
                          >
                            Upvote
                          </button>
                          <button 
                            onClick={() => handleVote(meme.id, 'down')}
                            disabled={votedMemes.has(meme.id)}
                            className={`px-3 py-1 rounded transition-all ${
                              votedMemes.has(meme.id) 
                                ? 'bg-red-900/30 cursor-not-allowed' 
                                : 'bg-red-900/50 hover:bg-red-700/50'
                            }`}
                          >
                            Downvote
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-yellow-400 font-bold">
                            Highest Bid: {currentBids[meme.id]?.amount || 0} CR
                          </div>
                          <div className="text-xs text-green-300">
                            Bidder: {currentBids[meme.id]?.user || 'None'}
                          </div>
                          
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              const amount = e.target.bidAmount.value;
                              handleBid(meme.id, amount);
                              e.target.bidAmount.value = '';
                            }}
                            className="mt-2 flex"
                          >
                            <input 
                              type="number" 
                              name="bidAmount"
                              min="1"
                              placeholder="Bid"
                              className="bg-black/50 border border-green-700/30 rounded-l px-2 py-1 text-sm w-20"
                            />
                            <button 
                              type="submit"
                              className="bg-purple-900/50 hover:bg-purple-700/50 px-2 py-1 rounded-r text-sm"
                            >
                              Bid
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Create Meme View */}
        {activeTab === 'create' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 neon-text-glow">
              <GlitchText text="Create New Meme" />
            </h2>
            
            <form onSubmit={handleCreateMeme} className="space-y-4 bg-black/30 p-6 rounded-lg border border-green-700/20">
              <div>
                <label className="block text-green-300 mb-1">Title</label>
                <input 
                  type="text" 
                  value={newMeme.title}
                  onChange={(e) => setNewMeme({...newMeme, title: e.target.value})}
                  required
                  className="w-full bg-black/50 border border-green-700/30 p-2 rounded text-green-400"
                  placeholder="Enter meme title"
                />
              </div>
              
              <div>
                <label className="block text-green-300 mb-1">Image URL</label>
                <input 
                  type="text" 
                  value={newMeme.imageUrl}
                  onChange={(e) => setNewMeme({...newMeme, imageUrl: e.target.value})}
                  className="w-full bg-black/50 border border-green-700/30 p-2 rounded text-green-400"
                  placeholder="Enter image URL (optional)"
                />
              </div>
              
              <div>
                <label className="block text-green-300 mb-1">Tags (comma-separated)</label>
                <input 
                  type="text" 
                  value={newMeme.tags}
                  onChange={(e) => setNewMeme({...newMeme, tags: e.target.value})}
                  className="w-full bg-black/50 border border-green-700/30 p-2 rounded text-green-400"
                  placeholder="e.g., crypto, funny, doge"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-purple-900/50 hover:bg-purple-700/50 p-3 rounded font-bold neon-border transition-all hover:scale-105"
              >
                CREATE MEME
              </button>
            </form>
            
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4 neon-text-glow">AI Features</h3>
              <div className="bg-black/30 p-4 rounded border border-green-700/20">
                <p className="text-green-300 mb-2">Use Google Gemini API to generate:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><span className="text-pink-400">AI Captions</span> - Automated funny descriptions based on tags</li>
                  <li><span className="text-pink-400">Vibe Analysis</span> - Determine the overall aesthetic of your meme</li>
                </ul>
                <p className="mt-3 text-sm text-green-300">In a real implementation, these features would connect to the Gemini API to generate dynamic content.</p>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard View */}
        {activeTab === 'leaderboard' && (
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 neon-text-glow">
              <GlitchText text="Top Memes" />
            </h2>
            
            <div className="bg-black/30 p-6 rounded-lg border border-green-700/20">
              <div className="space-y-4">
                {leaderboard.map((meme, index) => (
                  <div 
                    key={meme.id} 
                    className={`flex items-center p-3 rounded ${
                      index === 0 ? 'bg-yellow-900/20 border border-yellow-700/30' : 
                      index === 1 ? 'bg-gray-800/50' : 
                      index === 2 ? 'bg-orange-900/20' : 'bg-black/50'
                    }`}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center mr-4 font-bold ${
                      index === 0 ? 'text-yellow-400' : 
                      index === 1 ? 'text-gray-400' : 
                      index === 2 ? 'text-orange-400' : 'text-green-400'
                    }`}>
                      #{index + 1} 
                    </div>
                    <img 
                      src={meme.image_url} 
                      alt={meme.title} 
                      className="w-16 h-12 object-cover rounded mr-4"
                    />
                    <div className="flex-grow">
                      <h3 className="font-bold">{meme.title}</h3>
                      <div className="text-green-400">{meme.upvotes} UPVOTES</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-green-300">ID: {meme.id}</div>
                      <div className="text-xs text-purple-400">{aiVibes[meme.id] || "Calculating..."}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-3 neon-text">Real-Time Updates</h3>
                <div className="bg-black/50 p-4 rounded border border-green-700/20 h-40 overflow-y-auto font-mono text-sm">
                  <div className="space-y-2">
                    <div className="text-green-400">[WS] Connected to cyberpunk market</div>
                    <div className="text-yellow-400">[INFO] Live bid updates active</div>
                    <div className="text-purple-400">[DATA] Leaderboard synced every 5s</div>
                    <div className="text-green-400">[VOTE] Vote stream active</div>
                    <div className="text-pink-400">[AI] Caption generator ready</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-green-700/30 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-green-500/60 text-sm">
          <p>MemeHustle v2.0 | Cyberpunk AI Meme Marketplace</p>
          <p className="mt-1">Built with 💻🔥 in a 1-day hackathon style</p>
        </div>
      </footer>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-1px, -1px); }
          60% { transform: translate(2px, 1px); }
          80% { transform: translate(1px, -2px); }
          100% { transform: translate(0); }
        }

        @keyframes glitch-anim {
          0% { clip-path: inset(0 0 0 0); }
          20% { clip-path: inset(10% 0 90% 0); }
          40% { clip-path: inset(50% 0 50% 0); }
          60% { clip-path: inset(90% 0 10% 0); }
          80% { clip-path: inset(70% 0 30% 0); }
          100% { clip-path: inset(0 0 0 0); }
        }

        .neon-text {
          color: #00ffe7;
          text-shadow: 0 0 5px #00ffe7, 0 0 10px #00ffe7, 0 0 20px #00ffe7, 0 0 40px #00ffe7;
        }

        .neon-text-glow {
          color: #00ffe7;
          text-shadow: 0 0 5px #00ffe7, 0 0 10px #00ffe7, 0 0 20px #00ffe7;
        }

        .neon-border {
          border: 2px solid transparent;
          background-image: linear-gradient(90deg, #00ffe7, #ff00cc, #00ffe7);
          background-clip: padding-box;
          border-radius: 0.375rem;
        }

        .glitch {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          animation: glitch-anim 2s infinite;
          clip-path: inset(0 0 0 0);
        }

        .animate-glitch-anim {
          animation: glitch 0.3s infinite alternate ease-in-out;
        }

        .animate-glitch-anim-delayed {
          animation: glitch 0.3s infinite alternate ease-in-out;
          animation-delay: 0.1s;
        }

        .terminal-cursor::after {
          content: '|';
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }

        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(0,255,231,0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0,255,231,0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .animate-loading-bar {
          animation: loadingBar 2s ease-in-out infinite;
        }

        @keyframes loadingBar {
          0% { width: 0%; }
          50% { width: 100%; }
          100% { width: 0%; }
        }
      `}</style>
    </div>
  );
}