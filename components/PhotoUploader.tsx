
import React, { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { StoryMode, UploadedPhoto, PhotoRole } from '../types';
import { PHOTO_ROLES } from '../constants';

interface PhotoUploaderProps {
    mode: StoryMode;
    onPhotosSubmit: (photos: UploadedPhoto[]) => void;
    onBack: () => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ mode, onPhotosSubmit, onBack }) => {
    const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const maxPhotos = mode === StoryMode.MULTI ? 3 : 1;

    const fileToData = (file: File): Promise<Omit<UploadedPhoto, 'role' | 'file'>> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    const base64 = event.target.result.split(',')[1];
                    resolve({ id: `${file.name}-${Date.now()}`, previewUrl: URL.createObjectURL(file), base64 });
                } else {
                    reject(new Error('Failed to read file.'));
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleFiles = useCallback(async (files: FileList | null) => {
        if (!files) return;
        const newFiles = Array.from(files).slice(0, maxPhotos - photos.length);
        const processedFiles = await Promise.all(
            newFiles.map(async file => {
                const data = await fileToData(file);
                return { ...data, file, role: PhotoRole.HERO };
            })
        );
        setPhotos(prev => [...prev, ...processedFiles]);
    }, [maxPhotos, photos.length]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files);
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };
    const handleDragEvents = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
        else if (e.type === 'dragleave') setIsDragging(false);
    };

    const updatePhotoRole = (id: string, role: PhotoRole) => {
        setPhotos(photos.map(p => p.id === id ? { ...p, role } : p));
    };
    
    const removePhoto = (id: string) => {
        setPhotos(photos.filter(p => p.id !== id));
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-4xl font-serif text-center mb-4">Upload Your Muse{maxPhotos > 1 ? 's' : ''}</h2>
            <p className="max-w-2xl mx-auto text-lg text-indigo-200/90 text-center mb-8">
                {mode === StoryMode.SINGLE 
                    ? "Select a single photo to be the heart of your narrative."
                    : `Choose up to 3 photos. Each can play a unique role in your epic.`}
            </p>

            {photos.length < maxPhotos && (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragEvents}
                    onDragEnter={handleDragEvents}
                    onDragLeave={handleDragEvents}
                    className={`relative block w-full border-2 ${isDragging ? 'border-purple-400' : 'border-indigo-400/30'} border-dashed rounded-lg p-12 text-center hover:border-indigo-400/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors mb-8`}
                >
                    <input type="file" className="sr-only" onChange={handleInputChange} multiple={maxPhotos > 1} accept="image/*" />
                    <svg className="mx-auto h-12 w-12 text-indigo-400/80" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span className="mt-2 block text-sm font-semibold text-white">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-900 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-indigo-500">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleInputChange} multiple={maxPhotos > 1} accept="image/*" />
                        </label> or drag and drop
                    </span>
                    <p className="text-xs text-indigo-400/60">PNG, JPG, GIF up to 10MB</p>
                </div>
            )}

            {photos.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {photos.map(photo => (
                        <div key={photo.id} className="bg-gray-800/50 p-4 rounded-lg border border-indigo-400/20">
                            <img src={photo.previewUrl} alt="Upload preview" className="w-full h-48 object-cover rounded-md mb-4"/>
                            {mode === StoryMode.MULTI && (
                                <div className="mb-2">
                                    <label htmlFor={`role-${photo.id}`} className="block text-sm font-medium text-indigo-200">Assign Role</label>
                                    <select 
                                      id={`role-${photo.id}`}
                                      value={photo.role}
                                      onChange={(e) => updatePhotoRole(photo.id, e.target.value as PhotoRole)}
                                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-white"
                                    >
                                      {PHOTO_ROLES.map(role => <option key={role}>{role}</option>)}
                                    </select>
                                </div>
                            )}
                            <button onClick={() => removePhoto(photo.id)} className="w-full text-center text-sm text-red-400 hover:text-red-300">Remove</button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-between items-center">
                <button onClick={onBack} className="px-6 py-2 border border-indigo-400/50 text-sm font-medium rounded-md shadow-sm text-indigo-200 hover:bg-indigo-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors">Back</button>
                <button onClick={() => onPhotosSubmit(photos)} disabled={photos.length === 0} className="px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors">Continue</button>
            </div>
        </div>
    );
};

export default PhotoUploader;
