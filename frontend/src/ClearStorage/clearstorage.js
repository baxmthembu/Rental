/*import { useEffect } from "react";

const ClearStorage = () => {
    useEffect(() => {
        const closeTab = async(event) => {
            const id = localStorage.getItem('userId')
            
            if(!id) return;

            if(event.currentTarget.perfomance.navigation.type !== 1){
                localStorage.clear()
            }
        }

        window.addEventListener('unload', closeTab);

        return () => {
            window.removeEventListener('unload', closeTab)
        }
    }, []);
    return null;
}

export default ClearStorage*/

import { useEffect } from "react";

const ClearStorage = () => {
    useEffect(() => {
        const handleUnload = (event) => {
            // Check if the user is closing the tab or window
            if (window.performance.getEntriesByType("navigation")[0].type !== "reload") { // 1 indicates reload
                localStorage.clear()
            }
        };

        // Attach the `beforeunload` event listener
        window.addEventListener("unload", handleUnload);

        return () => {
            window.removeEventListener("unload", handleUnload);
        };
    }, []);

    return null;
};

export default ClearStorage;


/*import { useEffect } from "react";

const ClearStorage = () => {
    useEffect(() => {
        const handleUnload = () => {
            const id = localStorage.getItem("userId");

            if (!id) return;

            // Clear localStorage when the tab/window is closed
            localStorage.clear();
        };

        // Listen for the `beforeunload` event to handle tab/window closures
        window.addEventListener("beforeunload", handleUnload);

        return () => {
            window.removeEventListener("beforeunload", handleUnload);
        };
    }, []);

    return null;
};

export default ClearStorage;*/
