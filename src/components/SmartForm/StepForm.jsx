import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../Header.jsx';
import Step1Route from './Step1Route.jsx';
import Step2Preferences from './Step2Preferences.jsx';

export default function StepForm({ onSearch, theme, onToggleTheme }) {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState({
    origin: searchParams.get('origin') || '',
    destination: searchParams.get('destination') || '',
    startDate: '',
    endDate: '',
    tripLengthPreset: 7,
  });

  function handleStep1Next(data) {
    setStep1Data(data);
    setStep(2);
  }

  function handleBack() {
    setStep(1);
  }

  function handleSubmit(finalData) {
    onSearch(finalData);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Header
        theme={theme}
        onToggleTheme={onToggleTheme}
        starredCount={0}
        onOpenComparison={() => {}}
        onLogoClick={() => window.location.href = '/'}
      />

      <div className="flex-1 max-w-lg mx-auto w-full px-4 sm:px-6 py-12">
        {step === 1 && (
          <Step1Route
            initialValues={step1Data}
            onNext={handleStep1Next}
          />
        )}
        {step === 2 && (
          <Step2Preferences
            step1Data={step1Data}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
