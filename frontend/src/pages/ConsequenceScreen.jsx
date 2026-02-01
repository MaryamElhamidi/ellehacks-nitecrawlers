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
            <div className="bg-[var(--color-forest-medium)] mx-4 mt-8 rounded-[3rem] p-8 text-center relative overflow-hidden flex flex-col items-center justify-center shadow-xl min-h-[160px] h-auto border-b-6 border-[var(--color-forest-dark)]">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/pixel-weave.png')]"></div>

                <h1 className="text-3xl font-black mb-3 pixel-font tracking-wide relative z-10 text-white drop-shadow-md uppercase">
                    {isPositive ? "GREAT CHOICE!" : "PURCHASE MADE"}
                </h1>
                <p className="font-bold opacity-100 relative z-10 text-white text-lg break-words whitespace-normal max-w-full leading-relaxed shadow-sm">
                    {result.message}
                </p>
            </div>

            <div className="flex-1 px-6 py-6 flex flex-col items-center justify-start space-y-6">

                {/* Visual Impact Cards */}
                <div className="flex w-full gap-4">
                    {/* Wallet Impact */}
                    <div className={`flex-1 p-6 rounded-2xl border-4 ${isSpending ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'} pixel-border relative min-h-[140px] flex flex-col justify-center shadow-sm`}>
                        <div className="absolute -top-3 -left-2 bg-white rounded-full p-2 border-2 border-stone-200 shadow-sm">
                            <Wallet size={20} className="text-stone-600" />
                        </div>
                        <p className="text-xs font-medium text-stone-400 uppercase mb-2 tracking-widest">Your Wallet</p>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-2xl ultra-bold ${isSpending ? 'text-red-500' : 'text-green-600'}`}>
                                {isSpending ? `-$${item.price}` : '$0.00'}
                            </span>
                            {isSpending ? <TrendingDown size={20} className="text-red-500" /> : <div className="text-xs text-green-600 ultra-bold">SAVED</div>}
                        </div>
                        <p className="text-xs text-stone-500 font-bold">New Balance: ${money}</p>
                    </div>

                    {/* XP Impact */}
                    <div className={`flex-1 p-6 rounded-2xl border-4 ${isPositive ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'} pixel-border relative min-h-[140px] flex flex-col justify-center shadow-sm`}>
                        <div className="absolute -top-3 -right-2 bg-white rounded-full p-2 border-2 border-stone-200 shadow-sm">
                            <Brain size={20} className="text-stone-600" />
                        </div>
                        <p className="text-xs font-medium text-stone-400 uppercase mb-2 tracking-widest">Knowledge XP</p>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-2xl ultra-bold ${isPositive ? 'text-green-600' : 'text-amber-600'}`}>
                                {result.literacyChange > 0 ? '+' : ''}{result.literacyChange}
                            </span>
                            {isPositive ? <TrendingUp size={20} className="text-green-600" /> : <TrendingDown size={20} className="text-amber-600" />}
                        </div>
                        <p className="text-xs text-stone-500 font-bold leading-tight">{result.reason}</p>
                    </div>
                </div>


                {/* Mini Receipt Snapshot */}
                <div className="w-full max-w-sm bg-[#fffdf0] border-2 border-stone-300 transform -rotate-1 shadow-lg p-6 font-mono text-sm relative min-h-[160px] flex flex-col justify-center">
                    {/* Tape visual */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-yellow-100/50 backdrop-blur-sm border border-yellow-200/50 rotate-1 shadow-sm"></div>

                    <div className="text-center ultra-bold border-b-2 border-dashed border-stone-300 pb-3 mb-3">
                        TRANSACTION
                    </div>
                    <div className="flex justify-between mb-2 text-base">
                        <span className="truncate pr-2 font-bold text-stone-800">{item.name}</span>
                        <span className="font-bold">${item.price}</span>
                    </div>
                    <div className="flex justify-between text-stone-500 text-xs mb-3">
                        <span>Action</span>
                        <span className="uppercase font-bold bg-stone-100 px-1 rounded">{location.state?.choiceType}</span>
                    </div>
                    <div className="border-t-2 border-dashed border-stone-300 pt-3 flex justify-between font-black text-lg">
                        <span>TOTAL</span>
                        <span>{isSpending ? `$${item.price}` : '$0.00'}</span>
                    </div>
                </div>

                {/* Educational Tip */}
                <div className="bg-blue-50 border-2 border-blue-100 rounded-xl p-6 w-full relative shadow-sm min-h-[100px] flex flex-col justify-center">
                    <div className="absolute -top-3 left-4 bg-blue-100 text-blue-600 text-xs ultra-bold px-3 py-1 rounded-full border border-blue-200">
                        FINANCIAL TIP
                    </div>
                    <p className="text-blue-900 text-base font-bold leading-relaxed">
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
