import React, { useState, useEffect, useCallback } from 'react';
import { Budget } from '../../types';

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  initialValues: Budget;
  onChange: (values: Budget) => void;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({ min, max, step, initialValues, onChange }) => {
    const [minVal, setMinVal] = useState(initialValues.min ?? min);
    const [maxVal, setMaxVal] = useState(initialValues.max ?? max);

    // Use separate string state for inputs to allow temporary invalid/empty values
    const [minInput, setMinInput] = useState(String(minVal));
    const [maxInput, setMaxInput] = useState(String(maxVal));

    // When the slider's value changes, update the corresponding input's text
    useEffect(() => {
        setMinInput(String(minVal));
    }, [minVal]);

    useEffect(() => {
        setMaxInput(String(maxVal));
    }, [maxVal]);
    
    // Propagate changes to the parent component
    useEffect(() => {
        onChange({ min: minVal, max: maxVal });
    }, [minVal, maxVal, onChange]);
    
    // Handlers for the range sliders
    const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (value > maxVal) {
            setMinVal(value);
            setMaxVal(value);
        } else {
            setMinVal(value);
        }
    };
    
    const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (value < minVal) {
            setMaxVal(value);
            setMinVal(value);
        } else {
            setMaxVal(value);
        }
    };

    // Handlers for the number inputs (updates string state)
    const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMinInput(e.target.value);
    };

    const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMaxInput(e.target.value);
    };

    // Validate and sync state when an input is blurred
    const handleInputBlur = useCallback(() => {
        let newMin = parseInt(minInput, 10);
        let newMax = parseInt(maxInput, 10);

        if (isNaN(newMin)) newMin = min;
        if (isNaN(newMax)) newMax = max;

        // Clamp values to the absolute min/max
        newMin = Math.max(min, Math.min(newMin, max));
        newMax = Math.max(min, Math.min(newMax, max));

        // Ensure min is not greater than max
        if (newMin > newMax) {
            [newMin, newMax] = [newMax, newMin]; // Swap them
        }

        setMinVal(newMin);
        setMaxVal(newMax);
    }, [minInput, maxInput, min, max]);

    return (
        <div className="w-full mt-6 space-y-8">
            {/* Minimum Budget Section */}
            <div>
                 <div className="flex justify-between items-center mb-3">
                    <label htmlFor="min-budget-input" className="block text-gray-700 font-semibold">
                        Minimum Budget
                    </label>
                    <div className="relative">
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                         <input
                            id="min-budget-input"
                            type="number"
                            value={minInput}
                            onChange={handleMinInputChange}
                            onBlur={handleInputBlur}
                            className="w-40 pl-7 pr-2 py-2 border border-ion-gray-medium rounded-md text-right font-bold text-ion-blue focus:ring-2 focus:ring-ion-blue focus:outline-none"
                            aria-label="Minimum budget amount"
                         />
                    </div>
                </div>
                <input
                    type="range"
                    value={minVal}
                    min={min}
                    max={max}
                    step={step}
                    onChange={handleMinSliderChange}
                    className="w-full h-2 bg-ion-gray-medium rounded-lg appearance-none cursor-pointer thumb-style"
                    aria-label="Minimum budget slider"
                />
            </div>

            {/* Maximum Budget Section */}
            <div>
                 <div className="flex justify-between items-center mb-3">
                    <label htmlFor="max-budget-input" className="block text-gray-700 font-semibold">
                        Maximum Budget
                    </label>
                    <div className="relative">
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                         <input
                            id="max-budget-input"
                            type="number"
                            value={maxInput}
                            onChange={handleMaxInputChange}
                            onBlur={handleInputBlur}
                            className="w-40 pl-7 pr-2 py-2 border border-ion-gray-medium rounded-md text-right font-bold text-ion-blue focus:ring-2 focus:ring-ion-blue focus:outline-none"
                            aria-label="Maximum budget amount"
                         />
                    </div>
                </div>
                <input
                    type="range"
                    value={maxVal}
                    min={min}
                    max={max}
                    step={step}
                    onChange={handleMaxSliderChange}
                    className="w-full h-2 bg-ion-gray-medium rounded-lg appearance-none cursor-pointer thumb-style"
                    aria-label="Maximum budget slider"
                />
            </div>
            
             <style>{`
                /* Hide number input arrows on Chrome, Safari, Edge, Opera */
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
                }

                /* Hide number input arrows on Firefox */
                input[type=number] {
                  -moz-appearance: textfield;
                }

                .thumb-style {
                    -webkit-appearance: none;
                    appearance: none;
                    background-color: #D9DDE1; /* ion-gray-medium */
                }
                .thumb-style::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    background: #0033A0;
                    cursor: pointer;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                    margin-top: -1px; /* Adjust if track height changes */
                }

                .thumb-style::-moz-range-thumb {
                    width: 24px;
                    height: 24px;
                    background: #0033A0;
                    cursor: pointer;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                }
            `}</style>
        </div>
    );
};