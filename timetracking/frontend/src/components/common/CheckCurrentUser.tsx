import { useState, useEffect } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';

export const useIsLoggedIn = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        const checkCurrentUser = async () => {
            try {
                await getCurrentUser();
                setIsLoggedIn(true);
            } catch {
                setIsLoggedIn(false);
            }
        };

        checkCurrentUser();
    }, []);

    return isLoggedIn;
};
