
import React from 'react';
import { ActionButton } from './common/ActionButton';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-8 animate-fade-in">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-ion-blue">
          Find the Right ION CTRM Platform for Your Business
        </h1>
        <p className="text-xl md:text-2xl text-ion-gray-dark mb-8">
          Answer a few questions and get a tailored recommendation instantly.
        </p>
        <ActionButton onClick={onStart}>
          Start Assessment
        </ActionButton>
      </div>
    </div>
  );
};
