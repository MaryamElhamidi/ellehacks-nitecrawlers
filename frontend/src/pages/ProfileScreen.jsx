import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { RefreshCw, Book, Scroll } from 'lucide-react';

const ProfileScreen = () => {
    const { stats, money, allowance, hasOnboarded, dictionary } = useGame();
    const [activeTab, setActiveTab] = useState('receipt'); // 'receipt' | 'collection'

    const getVerdict = () => {
        if (stats.totalSaved > 100) return "Money Master! 🧞‍♂️";
        if (stats.totalSaved > 50) return "Super Saver! 🐿️";
        if (stats.wantsBought > stats.skipped) return "Big Spender! 💸";
        return "Budget Rookie 🌱";
    };

    const handleReset = () => {
        if (confirm("Are you sure you want to reset your progress?")) {
            localStorage.clear();
            window.location.reload();
        }
    };

    if (!hasOnboarded) return <div>Please onboard first.</div>;

    return (
        <div className="flex flex-col h-full bg-[#f4f1ea]">
            {/* Tab Switcher */}
            <div className="flex justify-center pt-6 pb-2 px-4 gap-4 z-10">
                <button
                    onClick={() => setActiveTab('receipt')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-xl border-t-4 border-x-4 transition-all ${activeTab === 'receipt'
                        ? 'bg-[#fffdf0] border-stone-800 -mb-1 z-20 shadow-[0_-4px_0_rgba(0,0,0,0.1)]'
                        : 'bg-stone-200 border-stone-400 text-stone-500 translate-y-1'
                        }`}
                >
                    <Scroll size={18} />
                    <span className="ultra-bold pixel-font text-sm uppercase">Receipt</span>
                </button>
                <button
                    onClick={() => setActiveTab('collection')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-t-xl border-t-4 border-x-4 transition-all ${activeTab === 'collection'
                        ? 'bg-[#fffdf0] border-[var(--color-wood-dark)] -mb-1 z-20 shadow-[0_-4px_0_rgba(0,0,0,0.1)]'
                        : 'bg-stone-200 border-stone-400 text-stone-500 translate-y-1'
                        }`}
                >
                    <Book size={18} />
                    <span className="ultra-bold pixel-font text-sm uppercase">Notebook</span>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-[#fffdf0] border-t-4 border-[var(--color-wood-dark)] pt-6 px-4 overflow-y-auto pb-24 relative shadow-inner">

                {/* View: RECEIPT */}
                {activeTab === 'receipt' && (
                    <div className="flex flex-col items-center animate-fade-in">
                        <div className="w-full max-w-sm border-4 border-stone-800 p-6 font-mono pixel-border bg-white transform rotate-1 shadow-lg">
                            {/* Receipt Header */}
                            <div className="text-center border-b-4 border-dashed border-[var(--color-wood-dark)] pb-4 mb-4">
                                <h2 className="text-xl ultra-bold uppercase tracking-widest text-[var(--color-forest-dark)] mb-1 pixel-font">Receipt</h2>
                                <p className="text-xs text-stone-500 uppercase tracking-widest">Mystic Finance Inc.</p>
                                <p className="text-xs text-stone-500">{new Date().toLocaleDateString()}</p>
                            </div>

                            {/* Items */}
                            <div className="space-y-3 text-sm text-[var(--color-wood-dark)] mb-6 font-bold">
                                <div className="flex justify-between">
                                    <span>Items Bought</span>
                                    <span>x{stats.wantsBought}</span>
                                </div>
                                <div className="flex justify-between text-amber-700">
                                    <span>Saved For Later</span>
                                    <span>x{stats.savedForLater}</span>
                                </div>
                                <div className="flex justify-between text-[var(--color-forest-medium)]">
                                    <span>Skipped (Saved!)</span>
                                    <span>x{stats.skipped}</span>
                                </div>

                                <div className="border-b border-dashed border-[var(--color-wood-light)] my-2"></div>

                                <div className="flex justify-between text-stone-500 font-normal">
                                    <span>Starting Budget</span>
                                    <span>${allowance}</span>
                                </div>
                                <div className="flex justify-between text-red-700 font-normal">
                                    <span>Total Spent</span>
                                    <span>-${stats.totalSpent}</span>
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="border-t-4 border-dashed border-[var(--color-wood-dark)] pt-4 mb-6 space-y-1">
                                <div className="flex justify-between ultra-bold text-xl mt-2 pt-2">
                                    <span>WALLET</span>
                                    <span>${money}</span>
                                </div>
                                <div className="flex justify-between text-xs text-[var(--color-forest-dark)] mt-1">
                                    <span>You Saved</span>
                                    <span>${stats.totalSaved}</span>
                                </div>
                            </div>

                            {/* Verdict Stamp */}
                            <div className="text-center mb-8 transform -rotate-2">
                                <span className="inline-block border-4 border-double border-[var(--color-forest-dark)] text-[var(--color-forest-dark)] px-4 py-1 text-sm ultra-bold uppercase opacity-90" style={{ transform: 'rotate(-10deg)' }}>
                                    {getVerdict()}
                                </span>
                            </div>

                            {/* Reset Button */}
                        </div>
                    </div>
                )}

                {/* View: COLLECTION (Dictionary) */}
                {activeTab === 'collection' && (
                    <div className="animate-fade-in pb-12">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg ultra-bold pixel-font text-[var(--color-wood-dark)]">Your Discoveries</h3>
                            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full border border-amber-200">{dictionary.length} Items</span>
                        </div>

                        {dictionary.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center px-8 opacity-60">
                                <Book className="w-16 h-16 text-stone-400 mb-4" />
                                <h3 className="text-xl font-bold text-stone-600 mb-2">Empty Notebook</h3>
                                <p className="text-stone-500">Scan items to fill your dictionary with financial wisdom!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {dictionary.map((item) => (
                                    <div key={item.id || Math.random()} className="bg-white rounded-xl p-3 shadow-md border-b-4 border-stone-300 relative group overflow-hidden border-2 border-stone-100">
                                        <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity text-xl">
                                            {item.category === 'fashion' && '👕'}
                                            {item.category === 'home' && '🏠'}
                                            {item.category === 'tech' && '📱'}
                                            {item.category === 'education' && '📚'}
                                            {item.category === 'entertainment' && '🎮'}
                                            {item.category === 'food' && '🍎'}
                                        </div>

                                        <h4 className="font-bold text-stone-800 truncate mb-1 text-sm">{item.name}</h4>
                                        <div className="text-[10px] text-stone-500 mb-2">{item.discoveredAt ? new Date(item.discoveredAt).toLocaleDateString() : 'Unknown Date'}</div>

                                        <div className="bg-amber-50 rounded-lg p-2 mb-2 border border-amber-100">
                                            <div className="text-[9px] font-bold text-amber-900 uppercase tracking-widest mb-0.5">Financial Concept</div>
                                            <div className="text-[10px] font-bold text-stone-700 leading-tight">
                                                {item.financialInfo ? item.financialInfo.term : "Opportunity Cost"}
                                            </div>
                                        </div>

                                        <div className="text-right font-bold text-green-700 text-xs">
                                            ${item.price}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileScreen;
