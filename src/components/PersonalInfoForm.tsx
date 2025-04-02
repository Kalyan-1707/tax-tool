import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useFormData } from '../context/FormDataContext';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  contactMethod: 'email' | 'phone' | 'both';
  address: string;
}

interface FormErrors {
  [key: string]: string;
}

interface PersonalInfoFormProps {
  onNextStep: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onNextStep }) => {
  const { formData: contextFormData, updatePersonalInfo } = useFormData();
  const [formData, setFormData] = useState<FormData>(contextFormData.personalInfo);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fullNameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const dobInputRef = useRef<HTMLInputElement>(null);
  //const contactMethodRef = useRef<HTMLFieldSetElement>(null);

  // Update local state when context data changes
  useEffect(() => {
    setFormData(contextFormData.personalInfo);
  }, [contextFormData.personalInfo]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.contactMethod) {
      newErrors.contactMethod = 'Please select a contact method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (validateForm()) {
      try {
        // Update the context with form data
        updatePersonalInfo(formData);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSubmitSuccess(true);

        // Move to next step after short delay to show success message
        onNextStep();
      } catch (error) {
        setSubmitSuccess(false);
        console.error("Error submitting form:", error);
      }
    } else {
      // Focus on the first invalid field
      if (!formData.fullName.trim() && fullNameInputRef.current) {
        fullNameInputRef.current.focus();
      } else if (!formData.email.trim() && emailInputRef.current) {
        emailInputRef.current.focus();
      } else if (!formData.dateOfBirth && dobInputRef.current) {
        dobInputRef.current.focus();
      } 
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (submitted) {
      validateForm();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Personal Information
      </h2>

      {submitSuccess && (
        <div
          role="alert"
          className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded flex items-center"
          aria-live="polite"
        >
          <CheckCircle2 className="h-5 w-5 mr-2" />
          <span>Information saved! Moving to next step...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Full Name Field */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={`w-full min-h-[44px] px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-required="true"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            ref={fullNameInputRef}
          />
          {errors.fullName && (
            <p
              id="fullName-error"
              className="mt-1 text-sm text-red-600 flex items-center"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full min-h-[44px] px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            ref={emailInputRef}
          />
          {errors.email && (
            <p
              id="email-error"
              className="mt-1 text-sm text-red-600 flex items-center"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone Number Field */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number <span className="text-gray-500">(optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full min-h-[44px] px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={!!errors.phone}
            aria-describedby="phone-hint phone-error"
          />
          <p id="phone-hint" className="mt-1 text-sm text-gray-500">
            Format: +1 (555) 555-5555
          </p>
          {errors.phone && (
            <p
              id="phone-error"
              className="mt-1 text-sm text-red-600 flex items-center"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.phone}
            </p>
          )}
        </div>

        {/* Date of Birth Field */}
        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className={`w-full min-h-[44px] px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-required="true"
            aria-invalid={!!errors.dateOfBirth}
            aria-describedby={errors.dateOfBirth ? 'dob-error' : undefined}
            ref={dobInputRef}
          />
          {errors.dateOfBirth && (
            <p
              id="dob-error"
              className="mt-1 text-sm text-red-600 flex items-center"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.dateOfBirth}
            </p>
          )}
        </div>

        {/* Preferred Contact Method */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-gray-700 mb-2">
            Preferred Contact Method <span className="text-red-500">*</span>
          </legend>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="contact-email"
                name="contactMethod"
                value="email"
                checked={formData.contactMethod === 'email'}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label
                htmlFor="contact-email"
                className="ml-2 text-sm text-gray-700"
              >
                Email
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="contact-phone"
                name="contactMethod"
                value="phone"
                checked={formData.contactMethod === 'phone'}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label
                htmlFor="contact-phone"
                className="ml-2 text-sm text-gray-700"
              >
                Phone
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="contact-both"
                name="contactMethod"
                value="both"
                checked={formData.contactMethod === 'both'}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label
                htmlFor="contact-both"
                className="ml-2 text-sm text-gray-700"
              >
                Both
              </label>
            </div>
          </div>
        </fieldset>

        {/* Address Field */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Address <span className="text-gray-500">(optional)</span>
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
            aria-describedby="address-hint"
          />
          <p id="address-hint" className="mt-1 text-sm text-gray-500">
            Enter your full mailing address
          </p>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full min-h-[44px] bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitted && !submitSuccess}
          >
            {submitted && !submitSuccess ? 'Submitting...' : 'Save Personal Information & Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoForm;