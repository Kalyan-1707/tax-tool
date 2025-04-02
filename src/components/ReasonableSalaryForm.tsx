import React, { useState, useEffect } from 'react';
import { AlertCircle, DollarSign } from 'lucide-react';
import { useFormData } from '../context/FormDataContext';

interface FormErrors {
  [key: string]: string;
}

interface ReasonableSalaryFormProps {
  onSubmit: (formData: any) => void;
}

const ReasonableSalaryForm: React.FC<ReasonableSalaryFormProps> = ({ onSubmit }) => {
  const { formData: contextFormData, updateReasonableSalary } = useFormData();
  const [salary, setSalary] = useState<string>(contextFormData.reasonableSalary);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string>("");

  // Update local state when context data changes
  useEffect(() => {
    setSalary(contextFormData.reasonableSalary);
  }, [contextFormData.reasonableSalary]);

  const validateSalary = (): boolean => {
    const newErrors: FormErrors = {};
    if (!salary) {
      newErrors.salary = 'Salary is required';
    } else if (!/^\d+(\.\d{0,2})?$/.test(salary)) {
      newErrors.salary = 'Please enter a valid salary amount';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    if (validateSalary()) {
      try {
        // Update global state
        updateReasonableSalary(salary);

        // Trigger the final submission with all form data
        await onSubmit(contextFormData); // Fix: Await onSubmit to handle async behavior
        setSubmitMessage("Information submitted successfully!");
      } catch (error) {
        console.error('Error submitting salary:', error);
        setSubmitMessage(`Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setSubmitMessage("");
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setSalary(value);
      updateReasonableSalary(value); // Update global state as user types
    }

    // Clear error when user starts typing
    if (errors.salary) {
      setErrors(prev => ({ ...prev, salary: '' }));
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Enter Reasonable Salary
      </h2>

      {submitMessage && (
        <div className={`mb-6 p-4 border rounded ${
          isSubmitting ? 'bg-blue-100 border-blue-400 text-blue-700' : 'bg-red-100 border-red-400 text-red-700'
        }`}>
          {submitMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="salary"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Reasonable Salary (USD) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              id="salary"
              name="salary"
              value={salary}
              onChange={handleInputChange}
              placeholder="0.00"
              className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
                errors.salary ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.salary && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.salary}
            </p>
          )}
        </div>

        <div className="pt-4">
          <p className="text-sm text-gray-600 mb-4">
            By submitting this form, you will complete your tax information. A confirmation email will be sent to your email address.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Complete & Submit All Information'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReasonableSalaryForm;
