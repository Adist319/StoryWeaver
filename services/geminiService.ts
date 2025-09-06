
import { StoryOptions, Story } from '../types';

// This is a MOCKED service. In a real application, this would
// interact with the GoogleGenAI SDK.
// We simulate the API calls to focus on the frontend experience.

const delay = <T,>(data: T, ms: number): Promise<T> =>
    new Promise(resolve => setTimeout(() => resolve(data), ms));

export const generateStory = async (options: StoryOptions): Promise<Story> => {
    console.log("Generating story with options:", options);

    // 1. Simulate generating the story outline
    await delay(null, 1500); // Simulate network latency and processing time for outline

    const title = `The ${options.genre} of the Brave Hero`;
    const panels = Array.from({ length: options.length }, (_, i) => {
        const panelNumber = i + 1;
        const photoRoles = options.photos.map(p => p.role).join(', ');
        
        return {
            panelNumber,
            imageUrl: `https://picsum.photos/seed/${Math.random()}/1024/768`,
            description: `This is panel ${panelNumber} of an epic ${options.genre} tale. It features characters/elements like: ${photoRoles}. The story is about a grand adventure.`,
            narration: `In a world of ${options.genre}, our story unfolds. Panel ${panelNumber} reveals a new twist in the tale for our heroes.`
        };
    });

    // 2. Simulate generating each panel image and narration
    // The total time will be this loop + the initial 1.5s delay.
    for (let i = 0; i < panels.length; i++) {
        await delay(null, 800); // Simulate individual panel generation
    }
    
    const story: Story = {
        title,
        panels,
    };

    return story;
};
