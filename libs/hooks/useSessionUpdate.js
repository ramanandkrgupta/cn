import { useSession } from 'next-auth/react';
import { useState } from 'react';

export function useSessionUpdate() {
    const { data: session, update } = useSession();
    const [isUpdating, setIsUpdating] = useState(false);

    const updateSessionData = async (newData) => {
        try {
            setIsUpdating(true);

            // Map userRole to role for session consistency
            const sessionUpdate = {
                ...session,
                user: {
                    ...session?.user,
                    name: newData.name || session?.user?.name,
                    email: newData.email || session?.user?.email,
                    avatar: newData.avatar,
                    role: newData.userRole || session?.user?.role, // Map userRole to role
                    id: session?.user?.id
                }
            };

            // Update the session
            const result = await update(sessionUpdate);
            
            // Verify the update
            if (!result) {
                throw new Error('Session update failed');
            }

            return true;
        } catch (error) {
            console.error('Session update failed:', error);
            return false;
        } finally {
            setIsUpdating(false);
        }
    };

    return { updateSessionData, isUpdating };
}
