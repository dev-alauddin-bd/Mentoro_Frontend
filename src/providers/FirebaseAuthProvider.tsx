'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { auth } from '@/lib/firebase';
import { setUser, logout, authStart, setLoading } from '@/redux/features/auth/authSlice';
import { useSyncFirebaseMutation } from '@/redux/features/auth/authApi';

export default function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [syncFirebase] = useSyncFirebaseMutation();

  useEffect(() => {
    // We don't need authStart() here if initialState loading is true, 
    // but it doesn't hurt. However, let's keep it simple.
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const payload = {
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          avatar: firebaseUser.photoURL,
        };
        
        try {
          const response = await syncFirebase(payload).unwrap();
          const { user, accessToken } = response.data;
          dispatch(setUser({ user, token: accessToken }));
        } catch (error) {
          console.error("❌ Firebase sync error:", error);
          const fallbackUser = {
            id: firebaseUser.uid,
            name: payload.name,
            email: firebaseUser.email || '',
            password: '',
            role: 'student' as any,
            avatar: firebaseUser.photoURL,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          dispatch(setUser({ user: fallbackUser, token: '' }));
        }
      } else {
        // If no firebase user, we just stop the loading state.
        // We don't call logout() because the user might be logged in via email/password (non-firebase).
        dispatch(setLoading(false));
      }
    });

    return () => unsubscribe();
  }, [dispatch, syncFirebase]);

  return <>{children}</>;
}
