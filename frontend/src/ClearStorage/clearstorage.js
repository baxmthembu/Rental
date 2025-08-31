import { useEffect } from "react";

const ClearStorage = () => {
    useEffect(() => {
        // Check if this is a new session
        if (!sessionStorage.getItem('sessionActive')) {
            // Clear localStorage for new sessions
            localStorage.clear();
            // Mark this session as active
            sessionStorage.setItem('sessionActive', 'true');
        }

        const handleBeforeUnload = () => {
            // Check if this is likely a tab close
            if (!sessionStorage.getItem('isReloading')) {
                localStorage.clear();
            }
        };

        // Add event listener
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            // Clean up event listener
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return null;
};

export default ClearStorage;