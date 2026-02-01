import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Clock, Ban, DollarSign } from 'lucide-react';
import { useGame } from '../context/GameContext';

const ChoiceCard = ({ title, sub, icon: Icon, color, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full p-4 rounded-xl shadow-sm border-b-4 transition-all text-left flex items-center space-x-4 group relative overflow-hidden ${disabled ? 'opacity-50 cursor-not-allowed bg-stone-200 border-stone-300' : 'bg-[#fffdf0] border-[var(--color-wood-light)] hover:translate-y-1 hover:border-b-0 active:border-b-0 active:translate-y-1'
            }`}
    >
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center shrink-0 border-2 border-black/10 shadow-inner`}>
            <Icon className="text-white w-6 h-6 drop-shadow-sm" />
        </div>
        <div className="flex-1">
            <h3 className="ultra-bold text-stone-700 text-lg uppercase">{title}</h3>
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
    const { simulateChoice, currentScannedItem, money, addToDictionary } = useGame();

    useEffect(() => {
        if (!currentScannedItem) {
            navigate('/');
        }
    }, [currentScannedItem, navigate]);

    if (!currentScannedItem) return null;

    const handleChoice = async (choice) => {
        // Save to dictionary naturally as user interacts
        addToDictionary(currentScannedItem);

        // Show loading state if needed here, but for now we just await
        const result = await simulateChoice(choice, currentScannedItem);

        navigate('/consequence', { state: { choice, result, item: currentScannedItem } });
    };

    const canAfford = money >= currentScannedItem.price;
    const { financialInfo } = currentScannedItem;

    return (
        <div className="flex flex-col h-full space-y-6 animate-fade-in px-4 overflow-y-auto pb-24 custom-scrollbar">
            {/* Scanned Item Header */}
            <div className="bg-white p-6 pixel-border shadow-sm text-center relative mt-4 transform rotate-1">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-stone-100 rounded-full mb-4 pixel-border">
                    <ShoppingBag className="w-8 h-8 text-stone-600" />
                </div>
                <h1 className="text-xl font-black text-stone-800 tracking-tight leading-tight mb-1 pixel-font">
                    {currentScannedItem.name}
                </h1>
                <div className="inline-flex items-center bg-green-100 px-3 py-1 rounded-full border-2 border-green-500 border-dashed transform -rotate-2 mt-2">
                    <span className="font-bold text-green-800 text-lg">${currentScannedItem.price}</span>
                </div>
            </div>

            {/* Financial Concept Card */}
            {financialInfo && (
                <div className="bg-amber-50 p-4 rounded-xl border-b-4 border-amber-200 relative group">
                    <div className="absolute -top-3 -right-2 bg-yellow-400 text-yellow-900 text-[10px] ultra-bold px-2 py-1 rounded-full border-2 border-yellow-600 shadow-sm animate-bounce-slow">
                        FUN FACT!
                    </div>
                    <h3 className="text-sm ultra-bold text-amber-800 uppercase tracking-wider mb-1">
                        {financialInfo.term}
                    </h3>
                    <p className="text-stone-700 font-bold text-sm mb-2 leading-relaxed">
                        "{financialInfo.simpleDefinition}"
                    </p>
                    <div className="bg-white/60 p-3 rounded-lg border border-amber-100 italic text-stone-600 text-xs">
                        💡 {financialInfo.kidExplanation}
                    </div>
                </div>
            )}

            {/* Allowance Check */}
            <div>
                <div className={`p-4 rounded-xl flex items-center justify-between border-b-4 ${canAfford ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border-2 ${canAfford ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'}`}>
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] ultra-bold uppercase tracking-wider text-stone-500">YOUR WALLET</p>
                            <p className={`ultra-bold ${canAfford ? 'text-green-700' : 'text-red-700'}`}>
                                ${money} AVAILABLE
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <h2 className="text-stone-400 font-bold mb-3 text-xs uppercase tracking-wider text-center">What will you do?</h2>
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
