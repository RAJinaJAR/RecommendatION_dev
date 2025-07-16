import React, { useState, useCallback } from 'react';
import { UserAnswers, Question, Budget } from '../types';
import { QUESTIONS } from '../constants';
import { ProgressBar } from './common/ProgressBar';
import { ActionButton } from './common/ActionButton';
import { RangeSlider } from './common/RangeSlider';

interface QuestionnaireProps {
  onComplete: (answers: UserAnswers) => void;
}

const initialAnswers: UserAnswers = {
  industry: null,
  users: 50,
  expectedBudget: { min: 50000, max: 250000 },
  goLiveTimeline: null,
  tradingType: null,
  orgSize: null,
  currentSystem: null,
  priorities: [],
  region: null,
  integrations: [],
};

export const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>(initialAnswers);
  const [animationClass, setAnimationClass] = useState('animate-slide-in');

  const currentQuestion: Question = QUESTIONS[currentStep];

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setAnimationClass('animate-slide-out');
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setAnimationClass('animate-slide-in');
      }, 500);
    } else {
      onComplete(answers);
    }
  };

  const handleSelect = (option: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: option });
    setTimeout(handleNext, 300);
  };

  const handleMultiSelect = (option: string) => {
    const currentValues = (answers[currentQuestion.id] as string[]) || [];
    const newValues = currentValues.includes(option)
      ? currentValues.filter(item => item !== option)
      : [...currentValues, option];
    setAnswers({ ...answers, [currentQuestion.id]: newValues });
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers({ ...answers, users: parseInt(e.target.value, 10) || 0 });
  };

  const handleBudgetChange = useCallback((newBudget: Budget) => {
    setAnswers(prev => ({ ...prev, expectedBudget: newBudget }));
  }, []);

  const isNextDisabled = (): boolean => {
    const value = answers[currentQuestion.id];
    
    switch (currentQuestion.type) {
        case 'multiselect':
            return (value as string[]).length === 0;
        case 'number':
            return isNaN(answers.users) || answers.users <= 0;
        case 'budget-range':
             const { min, max } = answers.expectedBudget;
             return min === null || max === null;
        case 'select':
        case 'dropdown':
             return value === null;
        default:
            return false;
    }
  };
  
  const renderInput = () => {
    switch (currentQuestion.type) {
      case 'select':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {currentQuestion.options?.map(option => (
              <button key={option} onClick={() => handleSelect(option)} className="w-full p-4 text-left border-2 border-ion-gray-medium rounded-lg hover:border-ion-blue hover:bg-ion-blue/10 focus:outline-none focus:ring-2 focus:ring-ion-blue transition-all duration-200">
                {option}
              </button>
            ))}
          </div>
        );
      case 'multiselect':
        const selectedOptions = (answers[currentQuestion.id] as string[]) || [];
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {currentQuestion.options?.map(option => (
              <button key={option} onClick={() => handleMultiSelect(option)} className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${selectedOptions.includes(option) ? 'bg-ion-blue text-white border-ion-blue' : 'border-ion-gray-medium hover:border-ion-blue hover:bg-ion-blue/10'}`}>
                {option}
              </button>
            ))}
          </div>
        );
      case 'number':
        return (
            <div className="mt-6">
                <input
                    type="number"
                    min="1"
                    step="1"
                    value={answers.users > 0 ? answers.users : ''}
                    onChange={handleNumberChange}
                    placeholder="e.g., 50"
                    className="w-full p-4 border-2 border-ion-gray-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-ion-blue"
                    aria-label={currentQuestion.text}
                />
            </div>
        );
      case 'budget-range':
        return (
           <RangeSlider
            min={20000}
            max={2500000}
            step={10000}
            initialValues={answers.expectedBudget}
            onChange={handleBudgetChange}
          />
        );
      case 'dropdown':
         return (
             <div className="mt-6">
                <select onChange={(e) => handleSelect(e.target.value)} defaultValue="" className="w-full p-4 border-2 border-ion-gray-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-ion-blue">
                    <option value="" disabled>Select a region...</option>
                    {currentQuestion.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
             </div>
         );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen p-4 sm:p-8 bg-white">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
        <ProgressBar current={currentStep} total={QUESTIONS.length} />
        <div className={`transition-opacity duration-500 ${animationClass}`}>
            <div className="flex items-start space-x-4 mb-4">
                {currentQuestion.icon}
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">{currentQuestion.text}</h2>
            </div>
            {renderInput()}
        </div>
        <div className="mt-8 flex justify-end">
            {(currentQuestion.type === 'multiselect' || currentQuestion.type === 'number' || currentQuestion.type === 'budget-range') && (
                <ActionButton onClick={handleNext} disabled={isNextDisabled()}>
                    {currentStep === QUESTIONS.length - 1 ? 'Get Recommendation' : 'Next'}
                </ActionButton>
            )}
        </div>
      </div>
    </div>
  );
};