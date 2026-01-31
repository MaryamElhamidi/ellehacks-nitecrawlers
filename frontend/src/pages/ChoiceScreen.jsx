import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Clock, Ban, DollarSign } from 'lucide-react';
import { useGame } from '../context/GameContext';

const ChoiceCard = ({ title, sub, icon: Icon, color, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full bg-white p-4 rounded-3xl shadow-sm border border-stone-100 transition-all text-left flex items-center space-x-4 group ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
            }`}
    >
        <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shrink-0`}>
            <Icon className="text-white w-7 h-7" />
        </div>
        <div className="flex-1">
            <h3 className="font-bold text-stone-700 text-lg">{title}</h3>
            <p className="text-stone-400 text-sm font-medium">{sub}</p>
        </div>
        {!disabled && (
            <div className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all text-stone-300">
                <ArrowRight />
            </div>
        )}
    </button>
)

const ChoiceScreen = () => {
    const navigate = useNavigate();
    const { simulateChoice, currentScannedItem, money } = useGame();

    useEffect(() => {
        if (!currentScannedItem) {
            navigate('/');
        }
    }, [currentScannedItem, navigate]);

    if (!currentScannedItem) return null;

    const handleChoice = (choice) => {
        const result = simulateChoice(choice, currentScannedItem);
        navigate('/consequence', { state: { choice, result, item: currentScannedItem } });
    };

    const canAfford = money >= currentScannedItem.price;

    return (
        <div className="flex flex-col h-full space-y-6 animate-fade-in px-2 overflow-y-auto pb-6">
            {/* Scanned Item Header */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] shadow-sm text-center transform -rotate-1 relative mx-2 mt-4 border border-stone-100">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full mb-4 shadow-inner">
                    <ShoppingBag className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-2xl font-black text-stone-700 tracking-tight leading-tight mb-1">
                    {currentScannedItem.name}
                </h1>
                <div className="inline-flex items-center bg-stone-100 px-4 py-2 rounded-full">
                    <span className="font-bold text-stone-600 text-lg">${currentScannedItem.price}</span>
                </div>
            </div>

            {/* Allowance Check */}
            <div className="px-4">
                <div className={`p-4 rounded-2xl flex items-center justify-between ${canAfford ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${canAfford ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Your Budget</p>
                            <p className={`font-bold ${canAfford ? 'text-green-700' : 'text-red-700'}`}>
                                ${money} available
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 flex-1">
                <h2 className="text-stone-500 font-bold ml-2 mb-3 text-sm uppercase tracking-wider">Make a decision</h2>
                <div className="space-y-3">
                    <ChoiceCard
                        title="Buy Now"
                        sub={canAfford ? "Purchase immediately" : "Not enough money"}
                        icon={ShoppingBag}
                        color={canAfford ? "bg-amber-400" : "bg-stone-300"}
                        onClick={() => handleChoice('buy')}
                        disabled={!canAfford}
                    />
                    <ChoiceCard
                        title="Save for Later"
                        sub="Add to wishlist"
                        icon={Clock}
                        color="bg-purple-400"
                        onClick={() => handleChoice('later')}
                    />
                    <ChoiceCard
                        title="Skip It"
                        sub="Keep your money"
                        icon={Ban}
                        color="bg-green-400"
                        onClick={() => handleChoice('skip')}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChoiceScreen;
