import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    // Helper to get initial state from localStorage or default
    const getInitialState = (key, defaultValue) => {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultValue;
    };

    // User Settings
    const [allowance, setAllowance] = useState(() => getInitialState('nitecrawlers_allowance', 50));
    const [allowanceFrequency, setAllowanceFrequency] = useState(() => getInitialState('nitecrawlers_allowanceFrequency', 'weekly'));
    const [hasOnboarded, setHasOnboarded] = useState(() => getInitialState('nitecrawlers_hasOnboarded', false));

    // Core stats
    const [money, setMoney] = useState(() => getInitialState('nitecrawlers_money', 50));
    const [literacy, setLiteracy] = useState(() => getInitialState('nitecrawlers_literacy', 30));
    const [growth, setGrowth] = useState(() => getInitialState('nitecrawlers_growth', 1));
    const [timeline, setTimeline] = useState(() => getInitialState('nitecrawlers_timeline', 1));

    // Session State
    const [currentScannedItem, setCurrentScannedItem] = useState(null); // Not persisting scanned item for now, maybe usually transient?
    const [transactions, setTransactions] = useState(() => getInitialState('nitecrawlers_transactions', []));

    // Statistics for Profile/Receipt
    const [stats, setStats] = useState(() => getInitialState('nitecrawlers_stats', {
        wantsBought: 0,
        savedForLater: 0,
        skipped: 0,
        totalSpent: 0,
        totalSaved: 0,
        scamsAvoided: 0
    }));

    // Dictionary State (Persisted)
    const [dictionary, setDictionary] = useState(() => getInitialState('nitecrawlers_dictionary', []));

    // Persist all state changes
    useEffect(() => {
        localStorage.setItem('nitecrawlers_allowance', JSON.stringify(allowance));
        localStorage.setItem('nitecrawlers_allowanceFrequency', JSON.stringify(allowanceFrequency));
        localStorage.setItem('nitecrawlers_hasOnboarded', JSON.stringify(hasOnboarded));
        localStorage.setItem('nitecrawlers_money', JSON.stringify(money));
        localStorage.setItem('nitecrawlers_literacy', JSON.stringify(literacy));
        localStorage.setItem('nitecrawlers_growth', JSON.stringify(growth));
        localStorage.setItem('nitecrawlers_timeline', JSON.stringify(timeline));
        localStorage.setItem('nitecrawlers_transactions', JSON.stringify(transactions));
        localStorage.setItem('nitecrawlers_stats', JSON.stringify(stats));
        localStorage.setItem('nitecrawlers_dictionary', JSON.stringify(dictionary));
    }, [allowance, allowanceFrequency, hasOnboarded, money, literacy, growth, timeline, transactions, stats, dictionary]);

    // Initialize money when allowance is set (only if not onboarding, logic might need tweak if persisting)
    // Actually, if we persist 'money', we don't want to reset it on every load if allowance exists.
    // The previous logic was:
    // useEffect(() => {
    //     if (!hasOnboarded) return;
    //     setMoney(allowance);
    // }, [allowance, hasOnboarded]);
    //
    // Issue: If I reload, hasOnboarded is true, allowance is loaded. It might reset money to allowance?
    // Wait, the original code ONLY set money to allowance when allowance changed OR hasOnboarded changed.
    // If we load derived state, we might not need this explicitly if we trust the persisted 'money'.
    // BUT, if the user changes allowance in settings (if that feature exists), money might need update?
    // For now, I will REMOVE this auto-reset to avoid overwriting persisted money on reload.
    // The Onboarding page sets the initial allowance and should probably set the initial money too.
    // I'll check Onboarding.jsx again, but for now let's remove the potential conflict.

    // Dictionary Actions
    const addToDictionary = (item) => {
        // Prevent duplicates by exact name for now
        if (!dictionary.some(d => d.name === item.name)) {
            const newItem = {
                ...item,
                discoveredAt: new Date().toISOString(),
                id: Date.now().toString()
            };
            setDictionary(prev => [newItem, ...prev]);
            return true; // Added
        }
        return false; // Already exists
    };

    const checkSimilarity = (newItemName) => {
        // Simple case-insensitive check for now, can be expanded to category matching
        if (!newItemName) return null;
        const match = dictionary.find(d =>
            d.name.toLowerCase().includes(newItemName.toLowerCase()) ||
            newItemName.toLowerCase().includes(d.name.toLowerCase())
        );
        return match ? match.name : null;
    };

    // Simulation / Consequence Engine
    const simulateChoice = async (choiceType, item) => {
        let result = {
            message: "",
            moneyChange: 0,
            literacyChange: 0,
            growthChange: 0,
            timePassed: 0,
            savingsPrediction: 0
        };

        const itemPrice = item ? item.price : 0;
        const itemName = item ? item.name : "Thing";

        switch (choiceType) {
            case 'buy':
                if (money >= itemPrice) {
                    result.moneyChange = -itemPrice;
                    result.literacyChange = -10; // Spending reduces financial literacy XP!
                    result.growthChange = 0; // Stagnant
                    result.message = `You bought the ${itemName}. It's cool, but your wallet (and XP) took a hit!`;

                    setStats(prev => ({
                        ...prev,
                        wantsBought: prev.wantsBought + 1,
                        totalSpent: prev.totalSpent + itemPrice
                    }));
                } else {
                    // Should be prevented by UI, but fallback:
                    result.moneyChange = 0;
                    result.literacyChange = -2; // Bad financial calculation
                    result.message = `You don't have enough money for the ${itemName}.`;
                }
                result.timePassed = 1;
                break;

            case 'later':
                // Wishlist / Delay
                result.moneyChange = 0;
                result.literacyChange = 5; // Good thought process
                result.growthChange = 1;
                result.message = `Smart move! Putting the ${itemName} on your wishlist gives you time to think.`;
                result.timePassed = 1;

                setStats(prev => ({
                    ...prev,
                    savedForLater: prev.savedForLater + 1
                }));
                break;

            case 'skip':
                // Delayed gratification
                result.moneyChange = 0; // Saved everything
                result.literacyChange = 15; // Big learning moment
                result.growthChange = 2; // Fast growth
                result.message = `Super saver! By skipping the ${itemName}, you kept $${itemPrice} in your pocket!`;
                result.savingsPrediction = itemPrice * 4; // Projected monthly savings if repeated
                result.timePassed = 1;

                setStats(prev => ({
                    ...prev,
                    skipped: prev.skipped + 1,
                    totalSaved: prev.totalSaved + itemPrice
                }));
                break;

            default:
                break;
        }

        // Apply changes
        setMoney(prev => prev + result.moneyChange);
        setLiteracy(prev => Math.min(100, Math.max(0, prev + result.literacyChange)));
        setGrowth(prev => Math.min(5, Math.max(0, prev + result.growthChange)));
        setTimeline(prev => prev + result.timePassed);

        // Log transaction
        if (choiceType !== 'scan') {
            setTransactions(prev => [...prev, {
                day: timeline,
                action: choiceType,
                item: itemName,
                amount: result.moneyChange,
                balance: money + result.moneyChange
            }]);
        }

        // --- Dynamic Tip Generation via Gemini ---
        try {
            console.log("Fetching AI tip for:", itemName, "Action:", choiceType);
            const response = await fetch("http://localhost:8000/api/generate-tip", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: choiceType === 'later' ? 'saving for later' : (choiceType === 'skip' ? 'skipping' : 'buying'),
                    item_name: itemName,
                    price: itemPrice,
                    balance: money + result.moneyChange
                })
            });
            const data = await response.json();
            console.log("AI Tip response:", data);

            if (data.tip) {
                result.tip = data.tip;
            } else {
                result.tip = getFallbackTip(choiceType);
            }
        } catch (error) {
            console.error("Failed to fetch AI tip:", error);
            result.tip = getFallbackTip(choiceType);
        }

        return result;
    };

    const getFallbackTip = (choice) => {
        if (choice === 'buy') return "Buying things for fun lowers your savings power. Try to save up for bigger goals!";
        if (choice === 'later') return "Waiting gives you time to decide if you *really* need it.";
        return "By saying 'No' today, you kept cash for something better tomorrow!";
    };

    return (
        <GameContext.Provider value={{
            allowance, setAllowance,
            allowanceFrequency, setAllowanceFrequency,
            hasOnboarded, setHasOnboarded,
            money, setMoney,
            literacy,
            growth,
            timeline,
            currentScannedItem, setCurrentScannedItem,
            transactions,
            simulateChoice,
            dictionary, addToDictionary, checkSimilarity,
            stats
        }}>
            {children}
        </GameContext.Provider>
    );
};
