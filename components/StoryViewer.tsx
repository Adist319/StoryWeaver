import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Story } from '../types';

interface StoryViewerProps {
    story: Story;
    onRestart: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ story, onRestart }) => {
    const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
    
    const currentPanel = story.panels[currentPanelIndex];

    const goToNext = useCallback(() => {
        setCurrentPanelIndex(prev => (prev + 1) % story.panels.length);
    }, [story.panels.length]);

    const goToPrev = () => {
        setCurrentPanelIndex(prev => (prev - 1 + story.panels.length) % story.panels.length);
    };
    
    // Handle audio playback for current panel
    useEffect(() => {
        if (currentPanel.audioUrl) {
            // Stop any existing audio
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            
            // Create new audio element
            const audio = new Audio(currentPanel.audioUrl);
            audioRef.current = audio;
            
            // Set up event listeners
            audio.addEventListener('loadstart', () => setIsAudioLoading(true));
            audio.addEventListener('canplay', () => setIsAudioLoading(false));
            audio.addEventListener('play', () => setIsAudioPlaying(true));
            audio.addEventListener('pause', () => setIsAudioPlaying(false));
            audio.addEventListener('ended', () => {
                setIsAudioPlaying(false);
                // Auto-advance to next panel when audio ends if in play mode
                if (isPlaying) {
                    goToNext();
                }
            });
            
            // Auto-play audio when panel changes
            audio.play().catch(err => {
                console.log('Audio autoplay prevented:', err);
                // User interaction might be required
            });
            
            return () => {
                audio.pause();
                audio.removeEventListener('loadstart', () => {});
                audio.removeEventListener('canplay', () => {});
                audio.removeEventListener('play', () => {});
                audio.removeEventListener('pause', () => {});
                audio.removeEventListener('ended', () => {});
            };
        }
    }, [currentPanel.audioUrl, currentPanelIndex, isPlaying, goToNext]);
    
    // Handle auto-play slideshow
    useEffect(() => {
        if (isPlaying && !currentPanel.audioUrl) {
            // If no audio, use timer for auto-advance
            autoPlayTimerRef.current = setTimeout(goToNext, 5000);
            return () => {
                if (autoPlayTimerRef.current) {
                    clearTimeout(autoPlayTimerRef.current);
                }
            };
        }
    }, [isPlaying, currentPanelIndex, goToNext, currentPanel.audioUrl]);
    
    const togglePlay = () => {
        setIsPlaying(!isPlaying);
        
        // Toggle audio playback
        if (audioRef.current) {
            if (!isPlaying) {
                audioRef.current.play().catch(err => console.log('Audio play failed:', err));
            } else {
                audioRef.current.pause();
            }
        }
    };
    
    const toggleAudio = () => {
        if (audioRef.current) {
            if (isAudioPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(err => console.log('Audio play failed:', err));
            }
        }
    };

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
                
                {/* Audio indicator */}
                {currentPanel.audioUrl && (
                    <div className="absolute top-4 right-4">
                        {isAudioLoading ? (
                            <div className="bg-black/50 p-2 rounded-full">
                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        ) : (
                            <button onClick={toggleAudio} className="bg-black/50 p-2 rounded-full hover:bg-black/80 transition-colors">
                                {isAudioPlaying ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                    </svg>
                                )}
                            </button>
                        )}
                    </div>
                )}
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
            
            {/* Audio status indicator */}
            {currentPanel.audioUrl && (
                <div className="mt-4 text-sm text-indigo-300">
                    {isAudioLoading ? 'Loading narration...' : 
                     isAudioPlaying ? '🔊 Narration playing' : '🔇 Narration paused'}
                </div>
            )}
        </div>
    );
};

export default StoryViewer;