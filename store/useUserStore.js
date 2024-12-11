import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set, get) => ({
      userData: null,
      isLoading: true,
      setUserData: (data) => set({ 
        userData: {
          ...data,
          role: data.userRole
        }, 
        isLoading: false 
      }),
      updateUser: (updates) => {
        const currentData = get().userData;
        const newData = { 
          ...currentData, 
          ...updates,
          role: updates.userRole || updates.role || currentData?.role
        };
        set({ userData: newData });
        return newData;
      },
      resetUser: () => set({ userData: null, isLoading: true }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ userData: state.userData }),
    }
  )
);

export const initializeUserData = async () => {
  try {
    const response = await fetch('/api/v1/members/users/profile', {
      cache: 'no-store'
    });
    if (response.ok) {
      const data = await response.json();
      useUserStore.getState().setUserData(data);
      return data;
    }
    return null;
  } catch (error) {
    console.error('Failed to initialize user data:', error);
    return null;
  }
};

export default useUserStore;