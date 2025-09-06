
import React, { useState } from 'react';
import { Genre, StoryLength, StoryMode, StoryOptions, UploadedPhoto } from '../types';
import { GENRE_DETAILS, STORY_LENGTHS } from '../constants';

interface OptionsConfiguratorProps {
    options: Required<Pick<StoryOptions, 'mode'|'photos'>>;
    onConfigSubmit: (options: Omit<StoryOptions, 'mode'|'photos'>) => void;
    onBack: () => void;
}

const OptionsConfigurator: React.FC<OptionsConfiguratorProps> = ({ options, onConfigSubmit, onBack }) => {
    const [genre, setGenre] = useState<Genre>(Genre.FANTASY);
    const [length, setLength] = useState<StoryLength>(StoryLength.STANDARD);
    const [protagonistId, setProtagonistId] = useState<string | undefined>(options.photos[0]?.id);
    const [stylePhotoId, setStylePhotoId] = useState<string | undefined>(options.photos[0]?.id);

    const handleSubmit = () => {
        onConfigSubmit({ genre, length, protagonistId, stylePhotoId });
    };
    
    const characterPhotos = options.photos.filter(p => p.role !== 'Setting' && p.role !== 'Magical Item');

    return (
        <div className="animate-fade-in space-y-12">
            <div>
                <h2 className="text-4xl font-serif text-center mb-4">Craft Your Narrative</h2>
                <p className="max-w-2xl mx-auto text-lg text-indigo-200/90 text-center mb-8">
                    Define the tone, length, and focus of your story. Every choice shapes the final masterpiece.
                </p>
            </div>
            
            {/* Genre Selection */}
            <div className="space-y-4">
                <h3 className="text-2xl font-serif">Choose a Genre</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(GENRE_DETAILS).map(([key, { icon, description }]) => (
                        <button key={key} onClick={() => setGenre(key as Genre)} className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${genre === key ? 'bg-indigo-900/70 border-purple-400' : 'bg-gray-800/50 border-indigo-400/20 hover:border-indigo-400/50'}`}>
                            <div className={`mb-2 ${genre === key ? 'text-purple-300' : 'text-indigo-300'}`}>{icon}</div>
                            <h4 className="font-semibold">{key}</h4>
                            <p className="text-xs text-indigo-300/70">{description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Story Length */}
            <div className="space-y-4">
                 <h3 className="text-2xl font-serif">Select Story Length</h3>
                 <div className="flex space-x-4">
                    {STORY_LENGTHS.map(({ label, value, description }) => (
                         <button key={label} onClick={() => setLength(value)} className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 text-center ${length === value ? 'bg-indigo-900/70 border-purple-400' : 'bg-gray-800/50 border-indigo-400/20 hover:border-indigo-400/50'}`}>
                            <h4 className="text-xl font-semibold">{label}</h4>
                            <p className="text-sm text-indigo-300/70">{description}</p>
                        </button>
                    ))}
                 </div>
            </div>
            
            {/* Multi-Photo Options */}
            {options.mode === StoryMode.MULTI && characterPhotos.length > 0 && (
                <div className="grid md:grid-cols-2 gap-8 bg-gray-800/30 p-6 rounded-lg border border-indigo-400/20">
                    <div>
                        <h3 className="text-2xl font-serif mb-4">Protagonist</h3>
                        <p className="text-sm text-indigo-200/80 mb-4">Who is the main character of your story?</p>
                        <div className="flex flex-wrap gap-4">
                            {characterPhotos.map(photo => (
                               <button key={photo.id} onClick={() => setProtagonistId(photo.id)} className={`flex items-center gap-3 p-2 rounded-lg border-2 transition-colors ${protagonistId === photo.id ? 'border-purple-400 bg-indigo-900/50' : 'border-indigo-400/20 hover:bg-gray-700/50'}`}>
                                    <img src={photo.previewUrl} className="w-12 h-12 rounded-md object-cover" alt={photo.role} />
                                    <div>
                                        <p className="font-semibold">{photo.role}</p>
                                        <p className="text-xs text-indigo-300/70">{photo.file.name.substring(0, 15)}...</p>
                                    </div>
                               </button>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="text-2xl font-serif mb-4">Artistic Style</h3>
                         <p className="text-sm text-indigo-200/80 mb-4">Which photo's style should influence the story's art?</p>
                        <div className="flex flex-wrap gap-4">
                            {options.photos.map(photo => (
                                <button key={photo.id} onClick={() => setStylePhotoId(photo.id)} className={`flex items-center gap-3 p-2 rounded-lg border-2 transition-colors ${stylePhotoId === photo.id ? 'border-purple-400 bg-indigo-900/50' : 'border-indigo-400/20 hover:bg-gray-700/50'}`}>
                                     <img src={photo.previewUrl} className="w-12 h-12 rounded-md object-cover" alt={photo.role} />
                                     <div>
                                        <p className="font-semibold">{photo.role}</p>
                                         <p className="text-xs text-indigo-300/70">{photo.file.name.substring(0, 15)}...</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            <div className="flex justify-between items-center pt-8">
                <button onClick={onBack} className="px-6 py-2 border border-indigo-400/50 text-sm font-medium rounded-md shadow-sm text-indigo-200 hover:bg-indigo-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors">Back</button>
                <button onClick={handleSubmit} className="px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-colors flex items-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    Weave My Story
                </button>
            </div>
        </div>
    );
};

export default OptionsConfigurator;
