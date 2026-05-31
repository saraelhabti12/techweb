import React, { useRef, useState, useEffect } from 'react';
import { XMarkIcon, CameraIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const CameraModal = ({ isOpen, onClose, onCapture }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);
    const [isFrontCamera, setIsFrontCamera] = useState(false);

    const startCamera = async () => {
        try {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            const constraints = {
                video: {
                    facingMode: isFrontCamera ? 'user' : 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            const newStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
            setError(null);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. Please ensure you have given permission.");
        }
    };

    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [isOpen, isFrontCamera]);

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            
            // Mirror if using front camera
            if (isFrontCamera) {
                context.translate(canvas.width, 0);
                context.scale(-1, 1);
            }
            
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            canvas.toBlob((blob) => {
                const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
                onCapture(file);
                onClose();
            }, 'image/jpeg', 0.8);
        }
    };

    const toggleCamera = () => {
        setIsFrontCamera(!isFrontCamera);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                />
                
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="relative bg-black rounded-[2.5rem] overflow-hidden w-full max-w-2xl aspect-[3/4] md:aspect-video border border-white/10 shadow-2xl flex flex-col"
                >
                    {/* Header */}
                    <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/60 to-transparent">
                        <h3 className="text-white font-black uppercase tracking-widest text-xs">Camera Preview</h3>
                        <button onClick={onClose} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Viewport */}
                    <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
                        {error ? (
                            <div className="text-center p-8">
                                <p className="text-red-400 font-bold mb-4">{error}</p>
                                <button onClick={startCamera} className="px-6 py-3 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest">Retry</button>
                            </div>
                        ) : (
                            <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                className={`w-full h-full object-cover ${isFrontCamera ? 'scale-x-[-1]' : ''}`}
                            />
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    {/* Controls */}
                    <div className="p-8 flex items-center justify-center gap-12 bg-gradient-to-t from-black/60 to-transparent absolute bottom-0 inset-x-0 z-20">
                        <button 
                            onClick={toggleCamera}
                            className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all active:scale-90"
                            title="Switch Camera"
                        >
                            <ArrowsRightLeftIcon className="w-6 h-6" />
                        </button>

                        <button 
                            onClick={takePhoto}
                            disabled={!stream}
                            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent group active:scale-90 transition-all disabled:opacity-50"
                        >
                            <div className="w-16 h-16 rounded-full bg-white group-hover:scale-95 transition-transform" />
                        </button>

                        <div className="w-14" /> {/* Spacer for balance */}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CameraModal;
