import React, { useState, useEffect } from 'react';
import { UserAnswers, Product, Feedback } from '../types';
import { getRecommendations } from '../services/recommendationService';
import { generateComparisonText, generateAdditionalSuggestion } from '../services/geminiService';
import { saveRecommendationRecord } from '../services/storageService';
import { DetailedFeedbackForm } from './DetailedFeedbackForm';
import { ActionButton } from './common/ActionButton';
import { PRODUCTS, QUESTIONS } from '../constants';

interface RecommendationPageProps {
  answers: UserAnswers;
  onRestart: () => void;
}

const LoadingSpinner: React.FC<{className?: string}> = ({ className = ''}) => (
    <div className={`flex justify-center items-center space-x-2 ${className}`}>
        <div className="w-3 h-3 rounded-full bg-ion-blue animate-bounce [animation-delay:-0.3s]"></div>
	    <div className="w-3 h-3 rounded-full bg-ion-blue animate-bounce [animation-delay:-0.15s]"></div>
	    <div className="w-3 h-3 rounded-full bg-ion-blue animate-bounce"></div>
    </div>
);

const formatAnswer = (key: keyof UserAnswers, value: any): string => {
    if (!value) return "Not provided";
    if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : "None";
    if (key === 'expectedBudget') {
        const { min, max } = value;
        if (min !== null && max !== null) {
            return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
        }
        return "Not provided";
    }
    return String(value);
};

const UserAnswersSummary: React.FC<{answers: UserAnswers}> = ({ answers }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-8 border border-ion-gray-medium rounded-lg">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-ion-gray-light hover:bg-ion-gray-medium transition-colors"
                aria-expanded={isOpen}
            >
                <h3 className="text-xl font-semibold text-gray-800">Your Answers Summary</h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
            </button>
            {isOpen && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 animate-fade-in">
                    {QUESTIONS.map(q => (
                        <div key={q.id}>
                            <p className="font-semibold text-gray-700">{q.text}</p>
                            <p className="text-ion-gray-dark">{formatAnswer(q.id, answers[q.id])}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export const RecommendationPage: React.FC<RecommendationPageProps> = ({ answers, onRestart }) => {
  const [recommendations, setRecommendations] = useState<{ ideal: Product; strong: Product } | null>(null);
  const [justification, setJustification] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [feedbackState, setFeedbackState] = useState<'prompt' | 'positive_review' | 'negative_review' | 'submitted'>('prompt');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  
  const [additionalSuggestion, setAdditionalSuggestion] = useState<string>('');
  const [isSuggestionLoading, setIsSuggestionLoading] = useState<boolean>(false);


  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      
      const recs = getRecommendations(answers);
      setRecommendations(recs);

      const justificationText = await generateComparisonText(answers, recs.ideal, recs.strong);
      setJustification(justificationText);

      setIsLoading(false);
    };

    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);

  const handlePositiveFeedback = async () => {
    if (!recommendations) return;
    setFeedbackState('positive_review');
    setIsSuggestionLoading(true);
    const suggestion = await generateAdditionalSuggestion(answers, recommendations.ideal);
    setAdditionalSuggestion(suggestion);
    setIsSuggestionLoading(false);
  };

  const handleNegativeFeedback = () => {
    setFeedbackState('negative_review');
  };

  const handleFeedbackSubmit = async (feedbackData: Feedback) => {
      if (!recommendations) return;

      setIsSubmittingFeedback(true);
      setSubmissionError(null);

      try {
        await saveRecommendationRecord(answers, recommendations, feedbackData);
        setFeedbackState('submitted');
      } catch (error) {
        console.error("Feedback submission failed:", error);
        setSubmissionError("We couldn't save your feedback right now. Please try again later.");
        // State doesn't need to be reverted as it wasn't optimistically updated
      } finally {
        setIsSubmittingFeedback(false);
      }
  };

  const renderFeedbackSection = () => {
      switch(feedbackState) {
        case 'prompt':
          return (
             <>
              <p className="text-center text-ion-gray-dark mb-4">Did you find this recommendation accurate?</p>
              <div className="flex justify-center gap-4 mb-4">
                  <button
                      type="button"
                      onClick={handlePositiveFeedback}
                      className="px-6 py-2 rounded-full font-semibold border-2 transition-colors bg-white border-gray-300 hover:border-green-400"
                  >
                      👍 Yes, this looks right
                  </button>
                  <button
                      type="button"
                      onClick={handleNegativeFeedback}
                      className="px-6 py-2 rounded-full font-semibold border-2 transition-colors bg-white border-gray-300 hover:border-red-400"
                  >
                      👎 No, something is off
                  </button>
              </div>
            </>
          );
        case 'positive_review':
           return (
              <div className="text-center p-4 sm:p-6 bg-green-50 border-t-4 border-green-400 rounded-lg shadow-inner animate-fade-in">
                  <h3 className="text-xl font-bold text-green-800 mb-4">Great! We're glad we got it right.</h3>
                  <div className="bg-white p-4 rounded-lg shadow-sm min-h-[80px] flex items-center justify-center">
                    {isSuggestionLoading ? (
                      <LoadingSpinner />
                    ) : (
                       <p className="text-gray-700 leading-relaxed">
                          💡 <span className="font-semibold">Next Step:</span> {additionalSuggestion}
                       </p>
                    )}
                  </div>
                  <div className="mt-6">
                      <ActionButton
                          onClick={() => handleFeedbackSubmit({ rating: 'accurate', generatedSuggestion: additionalSuggestion })}
                          disabled={isSuggestionLoading || isSubmittingFeedback}
                          className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
                      >
                         {isSubmittingFeedback ? 'Submitting...' : isSuggestionLoading ? 'Loading...' : 'Submit & Finish'}
                      </ActionButton>
                  </div>
              </div>
           );
        case 'negative_review':
          if (!recommendations) return null;
          return (
            <DetailedFeedbackForm
              answers={answers}
              recommendations={recommendations}
              allProducts={PRODUCTS}
              onSubmit={handleFeedbackSubmit}
              onCancel={() => setFeedbackState('prompt')}
              isSubmitting={isSubmittingFeedback}
            />
          );
        case 'submitted':
          return (
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <p className="text-green-600 font-bold text-xl">✅ Thank you!</p>
              <p className="text-ion-gray-dark mt-1">Your feedback is valuable and helps us improve.</p>
            </div>
          );
        default:
          return null;
      }
  };

  return (
    <div className="min-h-screen bg-ion-gray-light p-4 sm:p-8 animate-fade-in flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-ion-blue text-white p-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Your Personalized Recommendations</h1>
        </div>
        
        {isLoading || !recommendations ? (
            <div className="p-8 text-center h-96 flex flex-col justify-center">
                <h2 className="text-xl text-gray-700 mb-4">Analyzing your answers...</h2>
                <LoadingSpinner />
            </div>
        ) : (
            <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
                    
                    {/* Ideal Fit Column */}
                    <div className="border-2 border-ion-blue rounded-xl p-6 shadow-lg relative bg-white flex flex-col">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-ion-blue text-white px-4 py-1 rounded-full text-sm font-semibold">Ideal Fit</div>
                        <div className="mt-4 text-center">
                            <h2 className="text-3xl font-bold text-ion-blue">{recommendations.ideal.name}</h2>
                            <p className="text-md text-ion-gray-dark mt-2">{recommendations.ideal.description}</p>
                        </div>
                        <div className="mt-6 border-t border-ion-gray-medium pt-4 flex-grow">
                            <h3 className="font-semibold text-lg text-gray-800 mb-3 text-center">Key Strengths</h3>
                            <ul className="space-y-2">
                                {recommendations.ideal.keyStrengths.map(strength => (
                                    <li key={strength} className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-0.5 flex-shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
                                        <span className="text-gray-700">{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Strong Alternative Column */}
                    <div className="border border-ion-gray-medium rounded-xl p-6 shadow-md relative bg-white flex flex-col">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-ion-gray-dark text-white px-4 py-1 rounded-full text-sm font-semibold">Strong Alternative</div>
                        <div className="mt-4 text-center">
                            <h2 className="text-3xl font-bold text-gray-800">{recommendations.strong.name}</h2>
                            <p className="text-md text-ion-gray-dark mt-2">{recommendations.strong.description}</p>
                        </div>
                        <div className="mt-6 border-t border-ion-gray-medium pt-4 flex-grow">
                            <h3 className="font-semibold text-lg text-gray-800 mb-3 text-center">Key Strengths</h3>
                            <ul className="space-y-2">
                                {recommendations.strong.keyStrengths.map(strength => (
                                    <li key={strength} className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mr-2 mt-0.5 flex-shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
                                        <span className="text-gray-700">{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
                
                <UserAnswersSummary answers={answers} />

                <div className="bg-blue-50 border-l-4 border-ion-blue p-6 rounded-r-lg mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Our Recommendation Explained</h3>
                    {justification ? <p className="text-gray-700 leading-relaxed">{justification}</p> : <LoadingSpinner className="justify-start"/>}
                </div>
                
                <div className="bg-ion-gray-light p-6 rounded-lg mt-8">
                    <h3 className="text-xl font-semibold text-center text-gray-800 mb-4">Help Us Improve</h3>
                    {renderFeedbackSection()}
                    {submissionError && <p className="text-center text-red-500 mt-4 font-semibold">{submissionError}</p>}
                </div>


                 <div className="mt-8 text-center">
                    <button onClick={onRestart} className="text-ion-blue hover:underline font-semibold">Start New Assessment</button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};