"use client";
import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const GoogleOneTap = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) return;

    const initializeGsi = () => {
      if (!window.google || !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return;

      try {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: async (response) => {
            try {
              const result = await signIn('google', {
                credential: response.credential,
                redirect: false,
                callbackUrl: '/dashboard',
                prompt: 'none',
                authorization: {
                  params: {
                    prompt: 'none',
                    redirect_uri: `${window.location.origin}/api/auth/callback/google`
                  }
                }
              });

              if (result?.error) {
                toast.error(result.error);
              } else if (result?.url) {
                toast.success('Successfully logged in!');
                router.push('/dashboard');
              }
            } catch (error) {
              console.error('Sign in error:', error);
              toast.error('Failed to sign in');
            }
          },
          auto_select: true,
          prompt_parent_id: 'googleButton'
        });

        window.google.accounts.id.renderButton(
          document.getElementById('googleButton'),
          {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: '100%',
            height: 50,
            longtitle: true
          }
        );

        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            console.log('One Tap not displayed:', notification.getNotDisplayedReason());
          }
        });
      } catch (error) {
        console.error('Google Sign In Error:', error);
      }
    };

    const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (script) {
      if (window.google) {
        initializeGsi();
      } else {
        script.addEventListener('load', initializeGsi);
      }
    }

    return () => {
      if (window.google) {
        window.google.accounts.id.cancel();
      }
    };
  }, [session, router]);

  return (
    <div 
      id="googleButton" 
      className="w-full flex justify-center items-center"
      style={{ 
        minHeight: '50px',
        maxHeight: '50px',
        overflow: 'hidden'
      }}
    />
  );
};

export default GoogleOneTap; 