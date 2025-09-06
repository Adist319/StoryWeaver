import React, { useState, useEffect, useCallback } from 'react';
import { Story } from '../types';

interface StoryViewerProps {
    story: Story;
    onRestart: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ story, onRestart }) => {
    const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const currentPanel = story.panels[currentPanelIndex];

    const goToNext = useCallback(() => {
        setCurrentPanelIndex(prev => (prev + 1) % story.panels.length);
    }, [story.panels.length]);

    const goToPrev = () => {
        setCurrentPanelIndex(prev => (prev - 1 + story.panels.length) % story.panels.length);
    };
    
    useEffect(() => {
        // FIX: Replaced timer logic with a browser-compatible implementation that avoids NodeJS types.
        if (isPlaying) {
            const timer = setTimeout(goToNext, 5000);
            return () => clearTimeout(timer);
        }
    }, [isPlaying, currentPanelIndex, goToNext]);
    
    const togglePlay = () => setIsPlaying(!isPlaying);

    return (
        <div className="animate-fade-in flex flex-col items-center">
            <h2 className="text-5xl font-serif text-center mb-8">{story.title}</h2>
            
            <div className="w-full max-w-4xl aspect-video bg-gray-800 rounded-lg shadow-2xl overflow-hidden relative border-4 border-indigo-400/20">
                <img 
                    key={currentPanel.imageUrl}
                    src={currentPanel.imageUrl} 
                    alt={`Story panel ${currentPanel.panelNumber}`}
                    className="w-full h-full object-cover animate-fade-in-slow"
                />
                 <style>{`
                    @keyframes fade-in-slow {
                        from { opacity: 0.5; transform: scale(1.02); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .animate-fade-in-slow {
                        animation: fade-in-slow 0.8s ease-in-out forwards;
                    }
                `}</style>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 backdrop-blur-sm">
                     <p className="text-center text-white text-lg">{currentPanel.narration}</p>
                </div>

                 {/* Navigation */}
                <button onClick={goToPrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/80 transition-colors text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/80 transition-colors text-white">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
            
            {/* Progress Dots */}
            <div className="flex justify-center space-x-2 my-4">
                {story.panels.map((_, index) => (
                    <button key={index} onClick={() => setCurrentPanelIndex(index)} className={`w-3 h-3 rounded-full transition-colors ${currentPanelIndex === index ? 'bg-purple-400' : 'bg-indigo-400/50 hover:bg-indigo-400/80'}`}></button>
                ))}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4 mt-6">
                <button onClick={togglePlay} className="p-4 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 transition-colors">
                    {isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                    )}
                </button>
                 <button onClick={onRestart} className="px-6 py-3 border border-indigo-400/50 text-sm font-medium rounded-md shadow-sm text-indigo-200 hover:bg-indigo-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors">
                    Create New Story
                 </button>
                <button className="px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-colors" disabled>
                    Export Video
                </button>
            </div>
        </div>
    );
};

export default StoryViewer;