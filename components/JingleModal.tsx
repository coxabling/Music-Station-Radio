
import React, { useState, useRef } from 'react';
import { FireIcon } from '../constants';

interface JingleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (blob: Blob) => void;
}

export const JingleModal: React.FC<JingleModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    if (!isOpen) return null;

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            
            // Auto-stop after 5 seconds
            setTimeout(() => {
                if (mediaRecorder.state === 'recording') {
                    stopRecording();
                }
            }, 5000);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleSubmit = () => {
        if (audioBlob) {
            onSubmit(audioBlob);
            setAudioBlob(null);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-sm p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                <header className="text-center mb-6">
                    <h2 className="text-xl font-bold font-orbitron text-white">Jingle Generator</h2>
                    <p className="text-gray-400 text-sm">Record a 5-second station ID.</p>
                </header>

                <div className="flex flex-col items-center gap-6">
                    <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all ${isRecording ? 'border-red-500 animate-pulse bg-red-900/20' : 'border-gray-600 bg-gray-800'}`}>
                        {isRecording ? (
                             <span className="text-red-500 font-bold text-2xl">REC</span>
                        ) : (
                             <FireIcon className="w-12 h-12 text-gray-500"/>
                        )}
                    </div>

                    {!audioBlob ? (
                        <button 
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`px-8 py-3 rounded-full font-bold text-white transition-colors ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-[var(--accent-color)] text-black hover:opacity-90'}`}
                        >
                            {isRecording ? 'Stop Recording' : 'Start Recording'}
                        </button>
                    ) : (
                        <div className="w-full space-y-3">
                            <audio src={URL.createObjectURL(audioBlob)} controls className="w-full" />
                            <div className="flex gap-2">
                                <button onClick={() => setAudioBlob(null)} className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">Discard</button>
                                <button onClick={handleSubmit} className="flex-1 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold">Submit</button>
                            </div>
                        </div>
                    )}
                </div>
                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">&times;</button>
            </div>
        </div>
    );
};
