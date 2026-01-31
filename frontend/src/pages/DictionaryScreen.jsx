import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Book } from 'lucide-react';
import { useGame } from '../context/GameContext';
import dictionaryIcon from '../assets/dictionary_icon.png';

const DictionaryScreen = () => {
    const navigate = useNavigate();
    const { dictionary, allowance } = useGame();

    return (
        <div className="flex flex-col h-full bg-stone-100 overflow-hidden relative p-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 z-10 px-2 transition-all">
                <button
                    onClick={() => navigate('/')}
                    className="p-3 bg-white border-b-4 border-stone-200 rounded-xl hover:bg-stone-50 active:border-b-0 active:translate-y-1 transition-all"
                >
                    <ArrowLeft className="w-6 h-6 text-stone-600" />
                </button>
                <div className="flex-1 bg-white px-4 py-3 pixel-border shadow-sm flex items-center justify-between">
                    <span className="font-bold text-stone-700 text-lg flex items-center gap-2 pixel-font">
                        <img src={dictionaryIcon} alt="Dictionary" className="w-8 h-8 pixelated" style={{ imageRendering: 'pixelated' }} />
                        Collection
                    </span>
                    <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{dictionary.length} Items</span>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto pb-20 custom-scrollbar">
                {dictionary.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center px-8 opacity-60">
                        <Book className="w-16 h-16 text-stone-400 mb-4" />
                        <h3 className="text-xl font-bold text-stone-600 mb-2">Empty Notebook</h3>
                        <p className="text-stone-500">Scan items to fill your dictionary with financial wisdom!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {dictionary.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl p-3 shadow-sm border-b-4 border-stone-200 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                    {item.category === 'fashion' && '👕'}
                                    {item.category === 'home' && '🏠'}
                                    {item.category === 'tech' && '📱'}
                                    {item.category === 'education' && '📚'}
                                    {item.category === 'entertainment' && '🎮'}
                                    {item.category === 'food' && '🍎'}
                                </div>

                                <h4 className="font-bold text-stone-800 truncate mb-1">{item.name}</h4>
                                <div className="text-xs text-stone-500 mb-2">{new Date(item.discoveredAt).toLocaleDateString()}</div>

                                <div className="bg-amber-50 rounded-lg p-2 mb-2">
                                    <div className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-1">Financial Concept</div>
                                    <div className="text-xs font-bold text-stone-700">
                                        {item.financialInfo ? item.financialInfo.term : "Opportunity Cost"}
                                    </div>
                                </div>

                                <div className="text-right font-bold text-green-600 text-sm">
                                    ${item.price}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-20 right-0 -mr-16 w-64 h-64 bg-yellow-200/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-16 w-64 h-64 bg-green-200/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>
    );
};

export default DictionaryScreen;
