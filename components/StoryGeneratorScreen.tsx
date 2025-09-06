
import React, { useState, useEffect } from 'react';
import { LOADING_MESSAGES } from '../constants';

const StoryGeneratorScreen: React.FC = () => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex(prevIndex => (prevIndex + 1) % LOADING_MESSAGES.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center h-96 animate-fade-in">
            <h2 className="text-4xl font-serif mb-6">The Magic is Happening...</h2>
            <div className="w-20 h-20 mb-8 border-4 border-dashed border-purple-400 rounded-full animate-spin-slow"></div>
            <div className="relative w-full max-w-md h-8">
                {LOADING_MESSAGES.map((message, index) => (
                    <p
                        key={message}
                        className={`absolute w-full text-lg text-indigo-200 transition-opacity duration-500 ${index === currentMessageIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                        {message}
                    </p>
                ))}
            </div>
             <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default StoryGeneratorScreen;
