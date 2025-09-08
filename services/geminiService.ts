import { GoogleGenerativeAI } from '@google/generative-ai';
import { StoryOptions, Story, StoryPanel, PhotoRole } from '../types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface StoryOutline {
    title: string;
    panels: {
        panelNumber: number;
        description: string;
        narration: string;
        imagePrompt: string;
    }[];
}

const getGenrePromptStyle = (genre: string): string => {
    const genreStyles: Record<string, string> = {
        'Adventure': 'epic adventure, dynamic action, heroic journey',
        'Mystery': 'mysterious atmosphere, dark shadows, detective noir',
        'Romance': 'romantic, soft lighting, emotional connection',
        'Sci-Fi': 'futuristic, high-tech, space opera, cyberpunk elements',
        'Fantasy': 'magical, mythical creatures, enchanted forests',
        'Horror': 'dark, spooky, atmospheric horror, suspenseful',
        'Comedy': 'funny, whimsical, cartoonish, exaggerated expressions',
        'Bedtime Story': 'cozy, warm, gentle, child-friendly illustration'
    };
    return genreStyles[genre] || 'cinematic, high quality';
};

const analyzeUploadedPhotos = async (photos: Array<{ base64: string; role: PhotoRole }>) => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const photoDescriptions = await Promise.all(photos.map(async (photo) => {
        const result = await model.generateContent([
            `Analyze this image and describe the main subject in detail for use in a story. 
             Focus on: physical appearance, clothing, distinctive features, expressions.
             The role in the story will be: ${photo.role}
             Keep the description concise but detailed enough for consistent character generation.`,
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: photo.base64.split(',')[1] || photo.base64
                }
            }
        ]);
        
        return {
            role: photo.role,
            description: result.response.text()
        };
    }));
    
    return photoDescriptions;
};

const generateStoryOutline = async (
    options: StoryOptions,
    photoDescriptions: Array<{ role: PhotoRole; description: string }>
): Promise<StoryOutline> => {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const characterDescriptions = photoDescriptions
        .map(p => `${p.role}: ${p.description}`)
        .join('\n');
    
    const prompt = `Create a ${options.genre} story with exactly ${options.length} panels.
    
    Characters/Elements from photos:
    ${characterDescriptions}
    
    Requirements:
    1. Create an engaging ${options.genre} story that incorporates all the provided characters/elements
    2. Each panel should have a clear visual description for image generation
    3. Each panel should have narration text (1-2 sentences) that tells the story
    4. Maintain character consistency - use the exact descriptions provided
    5. The story should be complete and satisfying within ${options.length} panels
    
    Return the response in this exact JSON format:
    {
        "title": "Story Title",
        "panels": [
            {
                "panelNumber": 1,
                "description": "Detailed scene description",
                "narration": "Story narration for this panel",
                "imagePrompt": "Detailed prompt for image generation including character descriptions"
            }
        ]
    }`;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    try {
        // Extract JSON from the response (handle markdown code blocks)
        const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/) || 
                         responseText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : responseText;
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Failed to parse story outline:', error);
        // Fallback structure
        return {
            title: `A ${options.genre} Tale`,
            panels: Array.from({ length: options.length }, (_, i) => ({
                panelNumber: i + 1,
                description: `Panel ${i + 1} of the ${options.genre} story`,
                narration: `The story continues in panel ${i + 1}...`,
                imagePrompt: `${getGenrePromptStyle(options.genre.toString())}, featuring ${characterDescriptions}`
            }))
        };
    }
};

const generatePanelImage = async (
    imagePrompt: string,
    genre: string,
    characterConsistency: string
): Promise<string> => {
    console.log('=== generatePanelImage CALLED ===');
    console.log('Genre:', genre);
    console.log('Prompt length:', imagePrompt.length);
    
    // Use Nano Banana (Gemini 2.5 Flash Image Preview) via REST API
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const MODEL_ID = "gemini-2.5-flash-image-preview";
    
    // Log API key status (masked for security)
    console.log('API Key loaded:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT LOADED!');
    
    if (!API_KEY) {
        console.error('VITE_GEMINI_API_KEY is not defined! Check .env.local file');
        throw new Error('API key not configured');
    }
    
    // Enhanced prompt following official guidelines - be hyper-specific!
    const enhancedPrompt = `Create a cinematic illustration in ${getGenrePromptStyle(genre)} style.

Scene Description: ${imagePrompt}

Character Details (maintain exact consistency):
${characterConsistency}

Visual Specifications:
- Camera angle: Wide establishing shot with dramatic perspective
- Lighting: ${genre === 'Horror' ? 'Dark, moody shadows with stark contrast' : 
              genre === 'Romance' ? 'Soft, warm golden hour lighting' :
              genre === 'Sci-Fi' ? 'Neon-lit with blue and purple highlights' :
              'Natural dramatic lighting with strong directional light'}
- Mood: Capture the ${genre.toLowerCase()} atmosphere
- Composition: Rule of thirds, with main subject prominently featured
- Texture and detail: Highly detailed with visible textures on clothing and environment
- Color palette: Rich, saturated colors appropriate for ${genre} genre
- Artistic style: Professional digital illustration, concept art quality

Important: Generate a wordless image with no text, letters, or written elements.`;
    
    console.log('Generating image with Nano Banana:', enhancedPrompt);
    
    try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${API_KEY}`;
        console.log('API URL:', apiUrl.replace(API_KEY, 'KEY_HIDDEN'));
        
        const requestBody = {
            contents: [{ 
                parts: [{ 
                    text: enhancedPrompt 
                }] 
            }]
        };
        console.log('Request body:', JSON.stringify(requestBody).substring(0, 200) + '...');
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log('Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Nano Banana API error:', response.status, response.statusText, errorText);
            throw new Error(`API error: ${response.status} - ${errorText}`);
        }
        
        let data;
        try {
            data = await response.json();
            console.log('Nano Banana response received:', JSON.stringify(data).substring(0, 500));
        } catch (jsonError) {
            console.error('Failed to parse JSON response:', jsonError);
            throw new Error('Invalid JSON response from API');
        }
        
        // Extract image from response - it's actually inlineData (camelCase)!
        if (data.candidates?.[0]?.content?.parts) {
            const parts = data.candidates[0].content.parts;
            for (const part of parts) {
                if (part.inlineData) {  // Note: camelCase, not underscore!
                    const imageBase64 = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType || 'image/png';
                    console.log('Image generated successfully, base64 length:', imageBase64.length);
                    return `data:${mimeType};base64,${imageBase64}`;
                }
            }
        }
        
        console.warn('No image in response, checking structure:', JSON.stringify(data, null, 2));
        throw new Error('No image generated');
    } catch (error: any) {
        console.error('=== IMAGE GENERATION FAILED ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Full error object:', error);
        console.error('===============================');
        
        // TEMPORARY: Throw error instead of fallback to see what's happening
        throw error;
        
        // Fallback to placeholder (commented out temporarily)
        // const seed = Math.random().toString(36).substring(7);
        // const placeholderUrl = `https://picsum.photos/seed/${seed}/1024/768`;
        // console.log('Using placeholder image:', placeholderUrl);
        // return placeholderUrl;
    }
};

export const generateStory = async (options: StoryOptions): Promise<Story> => {
    console.log("=== VERSION 2.0 - FIXED ===");
    console.log("Generating story with Gemini API:", options);
    
    try {
        // Step 1: Analyze uploaded photos
        const photoDescriptions = await analyzeUploadedPhotos(
            options.photos.map(p => ({ base64: p.base64, role: p.role }))
        );
        
        // Step 2: Generate story outline
        const storyOutline = await generateStoryOutline(options, photoDescriptions);
        console.log('Story outline generated:', {
            title: storyOutline.title,
            panelCount: storyOutline.panels.length,
            firstPanelKeys: Object.keys(storyOutline.panels[0] || {})
        });
        
        // Step 3: Generate images for each panel
        const characterConsistency = photoDescriptions
            .map(p => p.description)
            .join('; ');
        
        console.log('Starting image generation for panels...');
        const panels: StoryPanel[] = await Promise.all(
            storyOutline.panels.map(async (panel, index) => {
                console.log(`Generating image for panel ${index + 1}...`);
                const imageUrl = await generatePanelImage(
                    panel.imagePrompt,
                    options.genre.toString(),
                    characterConsistency
                );
                
                console.log(`Panel ${index + 1} image generated:`, imageUrl.substring(0, 100));
                return {
                    panelNumber: panel.panelNumber,
                    imageUrl,
                    description: panel.description,
                    narration: panel.narration
                };
            })
        );
        
        return {
            title: storyOutline.title,
            panels
        };
    } catch (error) {
        console.error('Story generation failed:', error);
        throw new Error('Failed to generate story. Please try again.');
    }
};