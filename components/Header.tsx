
import React from 'react';

interface HeaderProps {
    onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset }) => {
    return (
        <header className="w-full max-w-5xl mx-auto flex justify-between items-center pb-4 border-b border-indigo-400/20">
            <div onClick={onReset} className="cursor-pointer">
                <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
                    StoryWeaver
                </h1>
                <p className="text-sm text-indigo-300/80">Weave your photos into epic tales.</p>
            </div>
            <button
                onClick={onReset}
                className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors"
            >
                Start Over
            </button>
        </header>
    );
};

export default Header;
