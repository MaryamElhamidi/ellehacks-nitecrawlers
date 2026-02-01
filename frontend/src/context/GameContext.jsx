import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    // User Settings
    const [allowance, setAllowance] = useState(50);
    const [allowanceFrequency, setAllowanceFrequency] = useState('weekly'); // 'weekly' or 'monthly'
    const [hasOnboarded, setHasOnboarded] = useState(false);

    // Core stats
    const [money, setMoney] = useState(50); // Starts with allowance
    const [literacy, setLiteracy] = useState(30); // 0-100
    const [growth, setGrowth] = useState(1); // 0-5 stages of island growth
    const [timeline, setTimeline] = useState(1); // Days passed

    // Session State
    const [currentScannedItem, setCurrentScannedItem] = useState(null);
    const [transactions, setTransactions] = useState([]);

    // Statistics for Profile/Receipt
    const [stats, setStats] = useState({
        wantsBought: 0,
        savedForLater: 0,
        skipped: 0,
        totalSpent: 0,
        totalSaved: 0,
        scamsAvoided: 0 // Placeholder if we add scams later
    });

    // Dictionary State (Persisted)
    const [dictionary, setDictionary] = useState(() => {
        const saved = localStorage.getItem('nitecrawlers_dictionary');
        return saved ? JSON.parse(saved) : [];
    });

    // Initialize money when allowance is set
    useEffect(() => {
        if (!hasOnboarded) return;
        setMoney(allowance);
    }, [allowance, hasOnboarded]);

    // Persist dictionary
    useEffect(() => {
        localStorage.setItem('nitecrawlers_dictionary', JSON.stringify(dictionary));
    }, [dictionary]);

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
            money,
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
