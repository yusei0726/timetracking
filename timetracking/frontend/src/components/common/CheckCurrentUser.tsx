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

export const useUserId = () => {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const { userId } = await getCurrentUser();
                setUserId(userId);
                console.log(`The userId: ${userId}`);
            } catch (err) {
                console.log(err);
                setUserId(null);
            }
        };

        fetchUserId();
    }, []);

    return userId;
};
