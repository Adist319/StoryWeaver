import { Genre } from '../types';

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Voice IDs for different genres (using ElevenLabs public voices)
const GENRE_VOICE_MAP: Record<string, string> = {
    'Adventure': '21m00Tcm4TlvDq8ikWAM', // Rachel - Clear, energetic
    'Mystery': 'AZnzlk1XvdvUeBnXmlld', // Domi - Deep, mysterious
    'Romance': 'EXAVITQu4vr4xnSDxMaL', // Bella - Warm, emotional
    'Sci-Fi': 'ErXwobaYiN019PkySvjV', // Antoni - Futuristic feel
    'Fantasy': 'MF3mGyEYCl7XYWbV9V6O', // Elli - Ethereal quality
    'Horror': 'TxGEqnHWrfWFTfGW9XjX', // Josh - Dark, atmospheric
    'Comedy': 'jsCqWAovK2LkecY7zXl4', // Clyde - Upbeat, fun
    'Bedtime Story': 'ThT5KcBeYPX3keUQqHPh', // Dorothy - Gentle, soothing
};

// Fallback voice if genre not found
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel

export interface VoiceSettings {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
}

export interface AudioResult {
    audioUrl: string;
    audioBlob: Blob;
}

const getVoiceIdForGenre = (genre: Genre): string => {
    return GENRE_VOICE_MAP[genre] || DEFAULT_VOICE_ID;
};

const getVoiceSettingsForGenre = (genre: Genre): VoiceSettings => {
    // Adjust voice settings based on genre for better effect
    const genreSettings: Record<string, VoiceSettings> = {
        'Adventure': { stability: 0.5, similarity_boost: 0.75, style: 0.4 },
        'Mystery': { stability: 0.7, similarity_boost: 0.8, style: 0.3 },
        'Romance': { stability: 0.6, similarity_boost: 0.85, style: 0.5 },
        'Sci-Fi': { stability: 0.5, similarity_boost: 0.7, style: 0.6 },
        'Fantasy': { stability: 0.6, similarity_boost: 0.75, style: 0.5 },
        'Horror': { stability: 0.8, similarity_boost: 0.9, style: 0.2 },
        'Comedy': { stability: 0.4, similarity_boost: 0.7, style: 0.7 },
        'Bedtime Story': { stability: 0.75, similarity_boost: 0.8, style: 0.3 },
    };
    
    return genreSettings[genre] || {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.5
    };
};

export const generateVoiceNarration = async (
    text: string,
    genre: Genre
): Promise<AudioResult> => {
    const voiceId = getVoiceIdForGenre(genre);
    const voiceSettings = getVoiceSettingsForGenre(genre);
    
    console.log('Generating voice narration for genre:', genre);
    console.log('Using voice ID:', voiceId);
    console.log('Text to narrate:', text);
    
    // Use CORS proxy for hackathon demo to bypass browser CORS restrictions
    const CORS_PROXY = 'https://corsproxy.io/?';
    const apiUrl = `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`;
    const proxiedUrl = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;
    
    console.log('ElevenLabs API URL:', apiUrl);
    console.log('Using CORS proxy:', proxiedUrl);
    
    try {
        const response = await fetch(
            proxiedUrl,
            {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': ELEVENLABS_API_KEY
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_monolingual_v1',
                    voice_settings: voiceSettings
                })
            }
        );
        
        console.log('ElevenLabs response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('ElevenLabs API error response:', errorText);
            throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
        }
        
        const audioBlob = await response.blob();
        console.log('Audio blob created, size:', audioBlob.size, 'type:', audioBlob.type);
        
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log('Audio URL created:', audioUrl);
        
        return {
            audioUrl,
            audioBlob
        };
    } catch (error) {
        console.error('Voice generation failed with detailed error:', error);
        // Return silence audio as fallback for demo
        console.warn('Returning silent audio as fallback');
        
        // Create a silent audio blob as fallback
        const silentAudioBase64 = 'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
        const byteCharacters = atob(silentAudioBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const silentBlob = new Blob([byteArray], { type: 'audio/wav' });
        const silentUrl = URL.createObjectURL(silentBlob);
        
        return {
            audioUrl: silentUrl,
            audioBlob: silentBlob
        };
    }
};

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateMultipleNarrations = async (
    texts: string[],
    genre: Genre
): Promise<AudioResult[]> => {
    console.log('Generating narrations sequentially with rate limit protection...');
    const results: AudioResult[] = [];
    
    // Always use sequential generation with delays to avoid rate limiting
    for (let i = 0; i < texts.length; i++) {
        try {
            // Add delay between requests (except for the first one)
            if (i > 0) {
                console.log(`Waiting 1.5 seconds before request ${i + 1}/${texts.length}...`);
                await delay(1500); // 1.5 second delay between requests
            }
            
            console.log(`Generating narration ${i + 1}/${texts.length}...`);
            const result = await generateVoiceNarration(texts[i], genre);
            results.push(result);
            console.log(`Successfully generated narration ${i + 1}/${texts.length}`);
        } catch (err: any) {
            console.error(`Failed to generate narration ${i + 1}:`, err);
            
            // If rate limited, wait longer and retry
            if (err.message?.includes('429')) {
                console.log('Rate limited! Waiting 5 seconds before retry...');
                await delay(5000); // 5 second delay on rate limit
                
                // Retry once
                try {
                    const result = await generateVoiceNarration(texts[i], genre);
                    results.push(result);
                    console.log(`Successfully generated narration ${i + 1} on retry`);
                } catch (retryErr) {
                    console.error(`Retry failed for narration ${i + 1}:`, retryErr);
                    // Push null to maintain array index alignment
                    results.push(null as any);
                }
            } else {
                // For other errors, push null to maintain array index alignment
                results.push(null as any);
            }
        }
    }
    
    return results.filter(r => r !== null); // Return only successful results
};

// Cleanup function to revoke object URLs when no longer needed
export const cleanupAudioUrls = (audioResults: AudioResult[]): void => {
    audioResults.forEach(result => {
        if (result.audioUrl.startsWith('blob:')) {
            URL.revokeObjectURL(result.audioUrl);
        }
    });
};