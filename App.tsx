
import React, { useState, useCallback } from 'react';
import { AppStep, StoryMode, Genre, StoryLength, UploadedPhoto, StoryOptions, Story } from './types';
import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import PhotoUploader from './components/PhotoUploader';
import OptionsConfigurator from './components/OptionsConfigurator';
import StoryGeneratorScreen from './components/StoryGeneratorScreen';
import StoryViewer from './components/StoryViewer';
import { generateStory } from './services/geminiService';
import { generateMultipleNarrations, cleanupAudioUrls } from './services/elevenlabsService';

const App: React.FC = () => {
    const [step, setStep] = useState<AppStep>(AppStep.MODE_SELECTION);
    const [storyOptions, setStoryOptions] = useState<Partial<StoryOptions>>({});
    const [generatedStory, setGeneratedStory] = useState<Story | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    const handleReset = useCallback(() => {
        setStep(AppStep.MODE_SELECTION);
        setStoryOptions({});
        setGeneratedStory(null);
        setError(null);
        setIsGenerating(false);
    }, []);

    const handleModeSelect = useCallback((mode: StoryMode) => {
        setStoryOptions({ mode });
        setStep(AppStep.PHOTO_UPLOAD);
    }, []);

    const handlePhotosUpload = useCallback((photos: UploadedPhoto[]) => {
        setStoryOptions(prev => ({ ...prev, photos }));
        setStep(AppStep.OPTIONS_CONFIG);
    }, []);

    const handleOptionsConfirm = useCallback(async (options: Omit<StoryOptions, 'mode' | 'photos'>) => {
        const finalOptions = { ...storyOptions, ...options } as StoryOptions;
        setStoryOptions(finalOptions);
        setStep(AppStep.GENERATING);
        setIsGenerating(true);
        setError(null);

        try {
            // Generate the story with images
            const story = await generateStory(finalOptions);
            
            // Generate voice narration for each panel
            try {
                console.log('Starting voice generation for story panels...');
                const narrationTexts = story.panels.map(panel => panel.narration);
                console.log('Narration texts to generate:', narrationTexts);
                
                const audioResults = await generateMultipleNarrations(narrationTexts, finalOptions.genre);
                console.log('Audio generation results:', audioResults);
                
                // Add audio URLs to story panels
                story.panels.forEach((panel, index) => {
                    if (audioResults[index]) {
                        panel.audioUrl = audioResults[index].audioUrl;
                        console.log(`Panel ${index + 1} audio URL set:`, panel.audioUrl);
                    } else {
                        console.warn(`No audio generated for panel ${index + 1}`);
                    }
                });
                console.log('Voice narration successfully added to all panels');
            } catch (audioError) {
                console.error('Voice generation failed, continuing without audio:', audioError);
                // Continue without audio if voice generation fails
            }
            
            setGeneratedStory(story);
            setStep(AppStep.VIEWING_STORY);
        } catch (err) {
            setError('An error occurred while weaving your story. Please try again.');
            setStep(AppStep.OPTIONS_CONFIG); // Go back to options
        } finally {
            setIsGenerating(false);
        }
    }, [storyOptions]);

    const renderStep = () => {
        switch (step) {
            case AppStep.MODE_SELECTION:
                return <ModeSelector onModeSelect={handleModeSelect} />;
            case AppStep.PHOTO_UPLOAD:
                return <PhotoUploader mode={storyOptions.mode!} onPhotosSubmit={handlePhotosUpload} onBack={() => setStep(AppStep.MODE_SELECTION)} />;
            case AppStep.OPTIONS_CONFIG:
                return <OptionsConfigurator options={storyOptions as Required<Pick<StoryOptions, 'mode'|'photos'>>} onConfigSubmit={handleOptionsConfirm} onBack={() => setStep(AppStep.PHOTO_UPLOAD)} />;
            case AppStep.GENERATING:
                return <StoryGeneratorScreen />;
            case AppStep.VIEWING_STORY:
                return <StoryViewer story={generatedStory!} onRestart={handleReset} />;
            default:
                return <ModeSelector onModeSelect={handleModeSelect} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900/50 text-white p-4 sm:p-6 lg:p-8 flex flex-col items-center">
            <Header onReset={handleReset} />
            <main className="w-full max-w-5xl mx-auto mt-8">
                {renderStep()}
            </main>
        </div>
    );
};

export default App;
