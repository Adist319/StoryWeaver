
import React from 'react';
import { Genre, StoryLength, PhotoRole } from './types';

export const GENRE_DETAILS: { [key in Genre]: { icon: JSX.Element; description: string } } = {
    [Genre.ADVENTURE]: { icon: <CompassIcon />, description: "Embark on a thrilling journey to uncharted territories." },
    [Genre.MYSTERY]: { icon: <SearchIcon />, description: "Unravel clues and solve a perplexing enigma." },
    [Genre.ROMANCE]: { icon: <HeartIcon />, description: "Experience a tale of passion, love, and connection." },
    [Genre.SCI_FI]: { icon: <RocketIcon />, description: "Explore futuristic worlds and mind-bending technologies." },
    [Genre.FANTASY]: { icon: <DragonIcon />, description: "Enter a realm of magic, myths, and epic battles." },
    [Genre.HORROR]: { icon: <GhostIcon />, description: "Confront your deepest fears in a chilling narrative." },
    [Genre.COMEDY]: { icon: <ComedyIcon />, description: "Laugh out loud with witty humor and hilarious situations." },
    [Genre.BEDTIME]: { icon: <MoonIcon />, description: "Drift into a gentle story perfect for a peaceful night." },
};

export const STORY_LENGTHS = [
    { label: 'Quick', value: StoryLength.QUICK, description: '3 Panels' },
    { label: 'Standard', value: StoryLength.STANDARD, description: '5 Panels' },
    { label: 'Epic', value: StoryLength.EPIC, description: '8 Panels' },
];

export const PHOTO_ROLES = Object.values(PhotoRole);

export const LOADING_MESSAGES = [
    "Analyzing photo context...",
    "Weaving the threads of your story...",
    "Consulting the muses for inspiration...",
    "Generating personalized story outlines with Gemini...",
    "Painting your first scene...",
    "Crafting character arcs...",
    "Rendering visuals with Fal.ai acceleration...",
    "Synthesizing narration with ElevenLabs tech...",
    "Adding the finishing touches...",
    "Your epic adventure is almost ready!",
];


// Icon Components
function CompassIcon() { return <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17.25l3-3m0 0l3-3m-3 3l-3 3m3-3v6m0-13.5a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function SearchIcon() { return <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m2.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>; }
function HeartIcon() { return <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>; }
function RocketIcon() { return <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>; }
function DragonIcon() { return <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>; }
function GhostIcon() { return <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.789-2.75 9.562C7.29 23.376 4 23.95 4 19c0-4.418 4.03-8 9-8s9 3.582 9 8c0 4.95-3.29 4.376-5.25.562C13.009 17.789 12 14.517 12 11zM12 11a1 1 0 100-2 1 1 0 000 2z" /></svg>; }
function ComedyIcon() { return <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
function MoonIcon() { return <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>; }
