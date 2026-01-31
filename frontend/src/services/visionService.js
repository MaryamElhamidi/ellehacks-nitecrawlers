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

        return {
            name: bestMatch,
            allLabels: labels.map(l => l.description),
            raw: response.data
        };

    } catch (error) {
        console.error("Error calling Vision API:", error);
        throw error;
    }
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
