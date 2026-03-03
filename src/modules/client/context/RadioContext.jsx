import React, { createContext, useContext, useState } from 'react';

const RadioContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useRadio = () => useContext(RadioContext);

export const RadioProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Chỉ thay đổi trạng thái, KHÔNG tạo Audio instance
    const playTrack = (track) => {
        if (currentTrack?.id === track.id) {
            // Nếu bài đang chọn -> Toggle
            setIsPlaying((prev) => !prev);
        } else {
            // Nếu bài mới -> Set bài mới và LUÔN LUÔN BẬT (true)
            setCurrentTrack(track);
            setIsPlaying(true);
        }
    };

    const togglePlay = () => {
        if (currentTrack) {
            setIsPlaying(!isPlaying);
        }
    };

    const closeRadio = () => {
        setIsPlaying(false);
        setCurrentTrack(null);
    };

    return (
        <RadioContext.Provider value={{ 
            currentTrack, 
            isPlaying, 
            setIsPlaying, 
            playTrack, 
            togglePlay, 
            closeRadio 
        }}>
            {children}
        </RadioContext.Provider>
    );
};