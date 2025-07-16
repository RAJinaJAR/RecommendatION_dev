import React, { useState, useMemo } from 'react';
import { UserAnswers, Product, Feedback } from '../types';
import { ActionButton } from './common/ActionButton';

interface DetailedFeedbackFormProps {
  answers: UserAnswers;
  recommendations: { ideal: Product; strong: Product };
  allProducts: Product[];
  onSubmit: (feedback: Feedback) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const FormSection: React.FC<{title: string; description?: string; children: React.ReactNode}> = ({ title, description, children }) => (
    <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-1">{title}</h4>
        {description && <p className="text-sm text-ion-gray-dark mb-4">{description}</p>}
        <div className="mt-4">{children}</div>
    </div>
);

type RankableFactor = {
    id: keyof UserAnswers;
    label: string;
};

const RANKABLE_FACTORS: RankableFactor[] = [
    { id: 'priorities', label: 'Key Business Priorities (Trading, Risk, etc.)' },
    { id: 'expectedBudget', label: 'Annual Budget' },
    { id: 'goLiveTimeline', label: 'Go-Live Timeline' },
    { id: 'users', label: 'Number of Users' },
    { id: 'tradingType', label: 'Trading Style (Physical vs. Financial)' },
    { id: 'integrations', label: 'System Integration Needs' },
];

export const DetailedFeedbackForm: React.FC<DetailedFeedbackFormProps> = ({
  answers,
  recommendations,
  allProducts,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [weights, setWeights] = useState<{[key: string]: number}>(
    RANKABLE_FACTORS.reduce((acc, factor) => ({...acc, [factor.id]: 0}), {})
  );
  const [userCorrection, setUserCorrection] = useState<{ ideal: string | null; strong: string | null }>({
    ideal: null,
    strong: null,
  });
  const [comment, setComment] = useState('');

  const totalWeight = useMemo(() => {
    return Object.values(weights).reduce((sum, current) => sum + current, 0);
  }, [weights]);

  const handleWeightChange = (factorId: keyof UserAnswers, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0) {
        setWeights(prev => ({...prev, [factorId]: 0}));
    } else {
        setWeights(prev => ({...prev, [factorId]: Math.min(100, numValue)}));
    }
  };

  const handleProductSelect = (productId: string, role: 'ideal' | 'strong') => {
    setUserCorrection(prev => {
        const newCorrection = { ...prev };
        const otherRole = role === 'ideal' ? 'strong' : 'ideal';

        // If the product is already selected for the other role, clear that selection
        if (newCorrection[otherRole] === productId) {
            newCorrection[otherRole] = null;
        }

        // Toggle the selection for the current role
        if (newCorrection[role] === productId) {
            newCorrection[role] = null; // Unselect if already selected
        } else {
            newCorrection[role] = productId; // Select
        }

        return newCorrection;
    });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userCorrection.ideal) {
      alert("Please select at least one product as your 'Ideal Fit'.");
      return;
    }
    if (totalWeight !== 100) {
        alert("The total priority weight must equal 100%.");
        return;
    }

    const feedback: Feedback = {
      rating: 'inaccurate',
      comment: comment,
      userCorrection: {
        ideal: userCorrection.ideal,
        strong: userCorrection.strong || undefined,
      },
      priorityWeights: weights,
    };
    onSubmit(feedback);
  };
  
  const PillButton: React.FC<{
      onClick: () => void,
      disabled: boolean,
      isActive: boolean,
      children: React.ReactNode,
      activeClasses: string,
      inactiveClasses: string
  }> = ({ onClick, disabled, isActive, children, activeClasses, inactiveClasses }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`px-3 py-1.5 text-sm font-semibold rounded-full border-2 transition-all duration-200 w-full ${isActive ? activeClasses : inactiveClasses}`}
    >
        {children}
    </button>
  );

  return (
    <div className="bg-white border-t-4 border-red-400 mt-6 p-6 sm:p-8 rounded-lg shadow-inner animate-fade-in">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Refine Your Recommendation</h3>
      <p className="text-ion-gray-dark mb-6">
        We're sorry our initial recommendation wasn't quite right. Please help us improve by telling us what you expected.
      </p>
      
      <form onSubmit={handleSubmit}>

        <FormSection 
            title="1. How would you prioritize these factors?"
            description="Distribute 100% among the factors below based on their importance to your decision."
        >
            <div className="space-y-3">
                {RANKABLE_FACTORS.map((factor) => (
                    <div key={factor.id} className="grid grid-cols-12 items-center gap-4">
                        <label htmlFor={`weight-${factor.id}`} className="col-span-8 text-gray-700">{factor.label}</label>
                        <div className="col-span-4 flex items-center">
                            <input
                                id={`weight-${factor.id}`}
                                type="number"
                                min="0"
                                max="100"
                                step="5"
                                value={weights[factor.id]}
                                onChange={e => handleWeightChange(factor.id, e.target.value)}
                                className="w-20 p-2 border border-ion-gray-medium rounded-md text-center focus:ring-2 focus:ring-ion-blue focus:outline-none"
                                disabled={isSubmitting}
                            />
                            <span className="ml-2 font-semibold text-ion-gray-dark">%</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className={`mt-4 text-right font-bold text-lg ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
                Total: {totalWeight}% / 100%
            </div>
        </FormSection>

        <FormSection title="2. Which products are a better fit?" description="Designate your 'Ideal Fit' and an optional 'Strong Alternative'.">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allProducts.map(product => {
                const isRecommended = product.id === recommendations.ideal.id || product.id === recommendations.strong.id;
                const isIdeal = userCorrection.ideal === product.id;
                const isStrong = userCorrection.strong === product.id;
                
                let cardClasses = "p-4 border-2 rounded-lg text-left transition-all duration-300 relative flex flex-col h-full";
                if (isIdeal) {
                    cardClasses += ' border-ion-blue bg-blue-50 ring-2 ring-ion-blue';
                } else if (isStrong) {
                    cardClasses += ' border-ion-gray-dark bg-gray-50 ring-1 ring-ion-gray-dark';
                } else {
                    cardClasses += ' border-ion-gray-medium bg-white';
                }

                return (
                <div key={product.id} className={cardClasses}>
                    {isRecommended && <div className="absolute -top-3 -right-3 bg-ion-blue text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow-md">Our Rec</div>}
                    
                    {isIdeal && <div className="absolute top-2 right-2 bg-ion-blue text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow-md">Your Ideal Fit</div>}
                    {isStrong && <div className="absolute top-2 right-2 bg-ion-gray-dark text-white text-xs px-2 py-0.5 rounded-full font-semibold shadow-md">Your Strong Alt.</div>}

                    <div className="flex-grow">
                        <h5 className="font-bold text-lg text-gray-800">{product.name}</h5>
                        <p className="text-sm text-ion-gray-dark mt-1">{product.description}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-ion-gray-medium flex justify-center items-center gap-x-2">
                       <PillButton
                          onClick={() => handleProductSelect(product.id, 'ideal')}
                          disabled={isSubmitting}
                          isActive={isIdeal}
                          activeClasses="bg-ion-blue text-white border-ion-blue"
                          inactiveClasses="bg-white text-ion-blue border-ion-blue hover:bg-blue-50"
                       >
                         {isIdeal ? '✓ Ideal' : 'Set as Ideal'}
                       </PillButton>
                       <PillButton
                          onClick={() => handleProductSelect(product.id, 'strong')}
                          disabled={isSubmitting}
                          isActive={isStrong}
                          activeClasses="bg-ion-gray-dark text-white border-ion-gray-dark"
                          inactiveClasses="bg-white text-ion-gray-dark border-ion-gray-dark hover:bg-gray-50"
                       >
                         {isStrong ? '✓ Alternative' : 'Set as Alt.'}
                       </PillButton>
                    </div>
                </div>
                );
            })}
            </div>
        </FormSection>

        <FormSection title="3. Additional Comments (Optional)">
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What were you expecting or what did we miss?"
                className="w-full p-3 mt-2 border border-ion-gray-medium rounded-md focus:ring-2 focus:ring-ion-blue focus:outline-none"
                rows={4}
                disabled={isSubmitting}
            />
        </FormSection>

        <div className="mt-8 flex justify-end items-center gap-4">
            <button type="button" onClick={onCancel} disabled={isSubmitting} className="text-ion-gray-dark hover:underline font-semibold disabled:opacity-50">Cancel</button>
            <ActionButton type="submit" disabled={isSubmitting || !userCorrection.ideal || totalWeight !== 100}>
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </ActionButton>
        </div>
      </form>
    </div>
  );
};