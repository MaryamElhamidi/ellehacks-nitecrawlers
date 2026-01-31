import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    // Core stats
    const [money, setMoney] = useState(1250);
    const [literacy, setLiteracy] = useState(30); // 0-100
    const [growth, setGrowth] = useState(1); // 0-5 stages of island growth
    const [timeline, setTimeline] = useState(1); // Days passed

    // Simulation / Consequence Engine
    const simulateChoice = (choiceType) => {
        let result = {
            message: "",
            moneyChange: 0,
            literacyChange: 0,
            growthChange: 0,
            timePassed: 0
        };

        switch (choiceType) {
            case 'daily':
                // Immediate gratification, slow long term
                result.moneyChange = -150; // Monthly cost projected
                result.literacyChange = 2; // Small learning
                result.growthChange = 0; // Stagnant
                result.timePassed = 30; // 1 month
                result.message = "You enjoyed your daily coffee, but your savings took a hit. Your island stays the same.";
                break;
            case 'weekly':
                // Balanced
                result.moneyChange = -30;
                result.literacyChange = 10;
                result.growthChange = 1; // Slow growth
                result.timePassed = 30;
                result.message = "Great balance! You treated yourself but kept your savings healthy. A new shrub appeared!";
                break;
            case 'skip':
                // Delayed gratification
                result.moneyChange = 0; // Saved everything
                result.literacyChange = 20; // Big learning moment
                result.growthChange = 2; // Fast growth
                result.timePassed = 30;
                result.message = "Super saver! By skipping, you saved enough for a new bridge! Your island is booming.";
                break;
            default:
                break;
        }

        // Apply changes
        setMoney(prev => prev + result.moneyChange);
        setLiteracy(prev => Math.min(100, Math.max(0, prev + result.literacyChange)));
        setGrowth(prev => Math.min(5, Math.max(0, prev + result.growthChange)));
        setTimeline(prev => prev + result.timePassed);

        return result;
    };

    return (
        <GameContext.Provider value={{
            money,
            literacy,
            growth,
            timeline,
            simulateChoice
        }}>
            {children}
        </GameContext.Provider>
    );
};
