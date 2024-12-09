import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SignInForm } from '../components/auth/SignInForm';
import { SignUpForm } from '../components/auth/SignUpForm';
import { OnboardingForm } from '../components/auth/OnboardingForm';

export const AuthPage: React.FC = () => {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in');

  useEffect(() => {
    // Check if user exists but doesn't have a username set
    if (user && !user.user_metadata.username) {
      setShowOnboarding(true);
    }
  }, [user]);

  if (user && !showOnboarding) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-sage-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full">
        {showOnboarding ? (
          <OnboardingForm onComplete={() => setShowOnboarding(false)} />
        ) : view === 'sign_in' ? (
          <>
            <h1 className="text-3xl font-display font-semibold text-sage-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-sage-600 mb-8">
              Sign in to continue to Vibe Studio
            </p>
            <SignInForm />
            <div className="mt-8 text-center border-t border-sage-100 pt-6">
              <p className="text-sage-600 mb-2">
                Don't have an account?
              </p>
              <button
                onClick={() => setView('sign_up')}
                className="text-coral-500 hover:text-coral-600 font-medium"
              >
                Sign Up
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-display font-semibold text-sage-900 mb-2">
              Create Account
            </h1>
            <p className="text-sage-600 mb-8">
              Join Vibe Studio to start collaborating
            </p>
            <SignUpForm onSignUpComplete={() => setShowOnboarding(true)} />
            <div className="mt-8 text-center border-t border-sage-100 pt-6">
              <p className="text-sage-600 mb-2">
                Already have an account?
              </p>
              <button
                onClick={() => setView('sign_in')}
                className="text-coral-500 hover:text-coral-600 font-medium"
              >
                Sign In
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};