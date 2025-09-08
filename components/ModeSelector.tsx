
import React from 'react';
import { StoryMode } from '../types';

interface ModeSelectorProps {
    onModeSelect: (mode: StoryMode) => void;
}

const ModeCard: React.FC<{ title: string; description: string; onClick: () => void; icon: React.ReactElement; }> = ({ title, description, onClick, icon }) => (
    <div
        onClick={onClick}
        className="group relative bg-gray-800/50 border border-indigo-400/20 rounded-lg p-8 cursor-pointer hover:bg-indigo-900/40 hover:border-purple-400/50 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
    >
        <div className="absolute top-0 right-0 text-indigo-500/10 transform translate-x-1/4 -translate-y-1/4 group-hover:text-purple-400/20 transition-colors duration-300">
            <div className="w-48 h-48">{icon}</div>
        </div>
        <div className="relative">
            <h3 className="text-3xl font-serif text-purple-300">{title}</h3>
            <p className="mt-2 text-indigo-200/80">{description}</p>
        </div>
    </div>
);

const ModeSelector: React.FC<ModeSelectorProps> = ({ onModeSelect }) => {
    return (
        <div className="text-center animate-fade-in">
            <h2 className="text-4xl font-serif mb-4">Choose Your Canvas</h2>
            <p className="max-w-2xl mx-auto text-lg text-indigo-200/90 mb-12">
                How many photos will anchor your tale? Each choice opens a different path to storytelling magic.
            </p>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <ModeCard
                    title="Single Photo"
                    description="Transform one moment into a quick, captivating story."
                    onClick={() => onModeSelect(StoryMode.SINGLE)}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
                />
                <ModeCard
                    title="Multi-Photo"
                    description="Weave multiple images into an epic adventure with complex characters."
                    onClick={() => onModeSelect(StoryMode.MULTI)}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.752 3.752 0 01-4.498 0 3 3 0 01-4.498 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
            </div>
        </div>
    );
};

export default ModeSelector;
