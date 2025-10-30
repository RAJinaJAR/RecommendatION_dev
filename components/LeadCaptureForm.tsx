import React, { useState } from 'react';
import { Product, LeadDetails } from '../types';
import { saveLeadRecord } from '../services/storageService';
import { ActionButton } from './common/ActionButton';
 
interface LeadCaptureFormProps {
  recommendations: { ideal: Product; strong: Product };
  onSubmitted: () => void;
}
 
export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ recommendations, onSubmitted }) => {
  const [formData, setFormData] = useState<LeadDetails>({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.companyName || !formData.email) {
      setError('Please fill in all required fields.');
      return;
    }
   
    setError(null);
    setIsSubmitting(true);
 
    try {
      await saveLeadRecord(formData, recommendations);
      onSubmitted();
    } catch (err) {
      setError('Sorry, something went wrong. Please try again later.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
 
  return (
    <div className="animate-fade-in">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">Ready for the Next Step?</h3>
        <p className="text-ion-gray-dark mb-6 text-center">
            Let's connect. Fill out the form below and a specialist will reach out to you.
        </p>
 
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-ion-gray-medium rounded-md shadow-sm focus:outline-none focus:ring-ion-blue focus:border-ion-blue"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="companyName"
                        id="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-ion-gray-medium rounded-md shadow-sm focus:outline-none focus:ring-ion-blue focus:border-ion-blue"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Work Email <span className="text-red-500">*</span></label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-ion-gray-medium rounded-md shadow-sm focus:outline-none focus:ring-ion-blue focus:border-ion-blue"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-ion-gray-medium rounded-md shadow-sm focus:outline-none focus:ring-ion-blue focus:border-ion-blue"
                    />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Additional Notes (Optional)</label>
                    <textarea
                        name="notes"
                        id="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-ion-gray-medium rounded-md shadow-sm focus:outline-none focus:ring-ion-blue focus:border-ion-blue"
                        placeholder="Is there anything specific you'd like to discuss?"
                    ></textarea>
                </div>
            </div>
            {error && <p className="text-center text-red-500 mt-4 font-semibold">{error}</p>}
            <div className="mt-6 text-center">
                <ActionButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Request a Demo'}
                </ActionButton>
            </div>
        </form>
    </div>
  );
};
