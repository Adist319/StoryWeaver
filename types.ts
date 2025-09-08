
export enum AppStep {
    MODE_SELECTION,
    PHOTO_UPLOAD,
    OPTIONS_CONFIG,
    GENERATING,
    VIEWING_STORY,
}

export enum StoryMode {
    SINGLE = 'Single Photo',
    MULTI = 'Multi-Photo',
}

export enum Genre {
    ADVENTURE = 'Adventure',
    MYSTERY = 'Mystery',
    ROMANCE = 'Romance',
    SCI_FI = 'Sci-Fi',
    FANTASY = 'Fantasy',
    HORROR = 'Horror',
    COMEDY = 'Comedy',
    BEDTIME = 'Bedtime Story',
}

export enum StoryLength {
    QUICK = 3,
    STANDARD = 5,
    EPIC = 8,
}

export enum PhotoRole {
    HERO = 'Hero',
    SIDEKICK = 'Sidekick',
    VILLAIN = 'Villain',
    SETTING = 'Setting',
    ITEM = 'Magical Item',
}

export interface UploadedPhoto {
    id: string;
    file: File;
    previewUrl: string;
    base64: string;
    role: PhotoRole;
}

export interface StoryOptions {
    mode: StoryMode;
    genre: Genre;
    length: StoryLength;
    photos: UploadedPhoto[];
    protagonistId?: string;
    stylePhotoId?: string;
}

export interface StoryPanel {
    panelNumber: number;
    imageUrl: string;
    description: string;
    narration: string;
    audioUrl?: string;
}

export interface Story {
    title: string;
    panels: StoryPanel[];
}
