import React from 'react';
import { Volume2, Globe, MessageCircle } from 'lucide-react';

const ParentView = () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const handlePlayAudio = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const textToSpeak = "Small recurring expenses add up to big amounts over time. Gastar un poco todos los días es como una gota que llena el vaso. ¡Suma mucho al final!";
            const response = await fetch("http://localhost:8000/api/tts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: textToSpeak,
                    voice_id: "21m00Tcm4TlvDq8ikWAM"
                }),
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            audio.play();
        } catch (error) {
            console.error("Failed to play audio:", error);
            alert("Failed to play audio. Check backend logs.");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex flex-col h-full pt-8 px-4 space-y-6">

            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full text-orange-500 mb-2">
                    <Globe />
                </div>
                <h1 className="text-2xl font-black text-stone-700">Family Talk</h1>
                <p className="text-stone-400 font-medium text-sm">Translate concepts, not just words.</p>
            </div>

            {/* Translation Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-100">
                <div className="bg-orange-50 p-4 border-b border-orange-100 flex justify-between items-center">
                    <span className="font-bold text-orange-800 text-sm tracking-wide">English → Spanish</span>
                    <button
                        onClick={handlePlayAudio}
                        className={`text-orange-400 hover:text-orange-600 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    >
                        <Volume2 size={20} />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <p className="text-xs font-bold text-stone-400 uppercase mb-1">The Concept</p>
                        <p className="text-lg font-medium text-stone-700">"Small recurring expenses add up to big amounts over time."</p>
                    </div>
                    <hr className="border-stone-100" />
                    <div>
                        <p className="text-xs font-bold text-stone-400 uppercase mb-1">To Parent</p>
                        <p className="text-xl font-medium text-stone-800 italic font-serif">"Gastar un poco todos los días es como una gota que llena el vaso. ¡Suma mucho al final!"</p>
                    </div>
                </div>
            </div>

            {/* Conversation Starters */}
            <div className="space-y-3">
                <h2 className="font-bold text-stone-600 ml-2">Conversation Starters</h2>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex items-start space-x-3">
                    <MessageCircle className="text-blue-400 mt-1 shrink-0" size={18} />
                    <p className="text-stone-600 text-sm font-medium">"Do we have any 'small drops' filling our cup right now?"</p>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex items-start space-x-3">
                    <MessageCircle className="text-blue-400 mt-1 shrink-0" size={18} />
                    <p className="text-stone-600 text-sm font-medium">"What is something big we want to save for together?"</p>
                </div>
            </div>
        </div>
    );
};

export default ParentView;
