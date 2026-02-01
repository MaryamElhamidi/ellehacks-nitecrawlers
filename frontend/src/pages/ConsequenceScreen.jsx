import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ArrowRight, Wallet, Brain, TrendingUp, TrendingDown } from 'lucide-react';

const ConsequenceScreen = () => {
    const location = useLocation();
    const result = location.state?.result;
    const item = location.state?.item;
    const { money, literacy } = useGame();

    if (!result || !item) {
        return <div className="p-8 text-center">Nothing to report!</div>;
    }

    // Determine visual theme based on action logic
    const isPositive = result.literacyChange > 0;
    const isSpending = result.moneyChange < 0;

    return (
        <div className="flex flex-col h-full overflow-y-auto pb-24">
            {/* Header Area */}
            <div className="moss-panel mx-4 mt-4 rounded-xl p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/pixel-weave.png')]"></div>

                <h1 className="text-2xl font-black mb-2 pixel-font tracking-wide relative z-10 text-white drop-shadow-md">
                    {isPositive ? "GREAT CHOICE!" : "PURCHASE MADE"}
                </h1>
                <p className="font-bold opacity-90 relative z-10 text-green-100">{result.message}</p>
            </div>

            <div className="flex-1 px-6 py-8 flex flex-col items-center justify-start space-y-8">

                {/* Visual Impact Cards */}
                <div className="flex w-full gap-4">
                    {/* Wallet Impact */}
                    <div className={`flex-1 p-4 rounded-2xl border-4 ${isSpending ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'} pixel-border relative`}>
                        <div className="absolute -top-3 -left-2 bg-white rounded-full p-1 border-2 border-stone-200 shadow-sm">
                            <Wallet size={16} className="text-stone-600" />
                        </div>
                        <p className="text-xs font-bold text-stone-400 uppercase mb-1">Your Wallet</p>
                        <div className="flex items-center gap-2">
                            <span className={`text-xl font-black ${isSpending ? 'text-red-500' : 'text-green-600'}`}>
                                {isSpending ? `-$${item.price}` : '$0.00'}
                            </span>
                            {isSpending ? <TrendingDown size={16} className="text-red-500" /> : <div className="text-xs text-green-600 font-bold">SAVED</div>}
                        </div>
                        <p className="text-xs text-stone-500 mt-1">New Balance: ${money}</p>
                    </div>

                    {/* XP Impact */}
                    <div className={`flex-1 p-4 rounded-2xl border-4 ${isPositive ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'} pixel-border relative`}>
                        <div className="absolute -top-3 -right-2 bg-white rounded-full p-1 border-2 border-stone-200 shadow-sm">
                            <Brain size={16} className="text-stone-600" />
                        </div>
                        <p className="text-xs font-bold text-stone-400 uppercase mb-1">Knowledge XP</p>
                        <div className="flex items-center gap-2">
                            <span className={`text-xl font-black ${isPositive ? 'text-green-600' : 'text-amber-600'}`}>
                                {result.literacyChange > 0 ? '+' : ''}{result.literacyChange}
                            </span>
                            {isPositive ? <TrendingUp size={16} className="text-green-600" /> : <TrendingDown size={16} className="text-amber-600" />}
                        </div>
                        <p className="text-xs text-stone-500 mt-1">{result.reason}</p>
                    </div>
                </div>


                {/* Mini Receipt Snapshot */}
                <div className="w-full max-w-xs bg-[#fffdf0] border-2 border-stone-300 transform -rotate-2 shadow-md p-4 font-mono text-sm relative">
                    {/* Tape visual */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-yellow-100/50 backdrop-blur-sm border border-yellow-200/50 rotate-1"></div>

                    <div className="text-center font-bold border-b border-dashed border-stone-300 pb-2 mb-2">
                        TRANSACTION
                    </div>
                    <div className="flex justify-between mb-1">
                        <span className="truncate pr-2">{item.name}</span>
                        <span>${item.price}</span>
                    </div>
                    <div className="flex justify-between text-stone-500 text-xs mb-2">
                        <span>Action</span>
                        <span className="uppercase">{location.state?.choiceType}</span>
                    </div>
                    <div className="border-t border-dashed border-stone-300 pt-2 flex justify-between font-bold">
                        <span>TOTAL</span>
                        <span>{isSpending ? `$${item.price}` : '$0.00'}</span>
                    </div>
                </div>

                {/* Educational Tip */}
                <div className="bg-blue-50 border-2 border-blue-100 rounded-xl p-4 w-full relative">
                    <div className="absolute -top-2 left-4 bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded">
                        FINANCIAL TIP
                    </div>
                    <p className="text-blue-800 text-sm font-medium leading-relaxed">
                        "{result.tip}"
                    </p>
                </div>

            </div>

            <div className="mt-auto px-6 pb-24">
                <Link
                    to="/"
                    className="w-full bg-stone-800 text-white font-bold py-4 rounded-2xl shadow-lg border-b-4 border-stone-950 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 pixel-font uppercase tracking-wider"
                >
                    Continue Journey <ArrowRight size={20} />
                </Link>
            </div>
        </div>
    );
};

export default ConsequenceScreen;
