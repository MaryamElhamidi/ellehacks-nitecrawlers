import axios from 'axios';

const API_KEY = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

export const analyzeImage = async (base64Image) => {
    if (!API_KEY) {
        console.error("Missing Google Cloud API Key. Please Set VITE_GOOGLE_CLOUD_API_KEY in .env");
        // Fallback for demo if no key
        return {
            error: "Missing API Key",
            label: "Mysterious Item"
        }
    }

    try {
        // Remove header if present (data:image/jpeg;base64,)
        const imageContent = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

        const response = await axios.post(API_URL, {
            requests: [
                {
                    image: {
                        content: imageContent
                    },
                    features: [
                        {
                            type: "LABEL_DETECTION",
                            maxResults: 5
                        },
                        {
                            type: "OBJECT_LOCALIZATION",
                            maxResults: 5
                        }
                    ]
                }
            ]
        });

        const labels = response.data.responses[0].labelAnnotations || [];
        const objects = response.data.responses[0].localizedObjectAnnotations || [];

        // Prioritize object detection, fallback to labels
        const bestMatch = objects.length > 0 ? objects[0].name : (labels.length > 0 ? labels[0].description : "Unknown Object");
        const financialInfo = getFinancialInfo(bestMatch);

        return {
            name: bestMatch,
            allLabels: labels.map(l => l.description),
            financialInfo: financialInfo,
            raw: response.data
        };

    } catch (error) {
        console.error("Error calling Vision API:", error);
        throw error;
    }
};

// Helper to get financial literacy info
export const getFinancialInfo = (label) => {
    const l = label.toLowerCase();

    if (l.includes('shoe') || l.includes('sneaker') || l.includes('clothing')) {
        return {
            term: "Depreciation",
            simpleDefinition: "When things lose value over time.",
            kidExplanation: "Like how your shiny new shoes get scuffed and old after you run in them!",
            visualType: "chart-down"
        };
    }
    if (l.includes('cup') || l.includes('mug') || l.includes('bottle')) {
        return {
            term: "Reusable vs. Disposable",
            simpleDefinition: "Using things many times instead of once.",
            kidExplanation: "A good water bottle can be used 1,000 times! That saves money on buying plastic bottles.",
            visualType: "recycle"
        };
    }
    if (l.includes('tech') || l.includes('phone') || l.includes('laptop') || l.includes('electronic')) {
        return {
            term: "Insurance",
            simpleDefinition: "Paying a little now to protect big things later.",
            kidExplanation: "It's like paying for a shield! If your expensive gadget breaks, the shield fixes it for free.",
            visualType: "shield"
        };
    }
    if (l.includes('book') || l.includes('paper')) {
        return {
            term: "Investment",
            simpleDefinition: "Spending money to get smarter or richer later.",
            kidExplanation: "Reading books makes your brain bigger! That helps you get a cool job one day.",
            visualType: "chart-up"
        };
    }
    if (l.includes('toy') || l.includes('game')) {
        return {
            term: "Want vs. Need",
            simpleDefinition: "Knowing what you must have vs. what is just fun.",
            kidExplanation: "You NEED food to grow, but you WANT toys to play. Both are okay, but needs come first!",
            visualType: "scale"
        };
    }
    if (l.includes('food') || l.includes('snack') || l.includes('fruit')) {
        return {
            term: "Perishable",
            simpleDefinition: "Things that go bad effectively.",
            kidExplanation: "You have to eat it fast before it gets yucky! Don't buy more than you can eat.",
            visualType: "apple"
        };
    }

    // Default
    return {
        term: "Opportunity Cost",
        simpleDefinition: "What you give up when you choose something else.",
        kidExplanation: "If you buy this, you can't buy something else with the same money. Choose wisely!",
        visualType: "balance"
    };
};

// Helper to estimate price based on category/label
export const estimatePrice = (label) => {
    const l = label.toLowerCase();

    if (l.includes('shoe') || l.includes('sneaker')) return { price: 85, category: 'fashion' };
    if (l.includes('cup') || l.includes('mug') || l.includes('bottle')) return { price: 15, category: 'home' };
    if (l.includes('phone') || l.includes('electronic') || l.includes('laptop')) return { price: 800, category: 'tech' };
    if (l.includes('book') || l.includes('paper')) return { price: 20, category: 'education' };
    if (l.includes('toy') || l.includes('game')) return { price: 35, category: 'entertainment' };
    if (l.includes('food') || l.includes('snack') || l.includes('fruit')) return { price: 5, category: 'food' };
    if (l.includes('watch')) return { price: 150, category: 'fashion' };

    // Default fallback random
    return { price: Math.floor(Math.random() * 50) + 10, category: 'general' };
};
