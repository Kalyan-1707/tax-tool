import React, { useState, useRef } from 'react';
import { AlertCircle, DollarSign } from 'lucide-react';
import { useFormData } from '../context/FormDataContext'; // Fix: Import useFormData

interface TransactionData {
  date: string;
  type: string;
  amount: string;
  description: string;
  category: string;
  paymentMethod: string;
}

interface FormErrors {
  [key: string]: string;
}

interface TransactionFormProps {
  onNextStep: () => void;
}

const TRANSACTION_TYPES = [
  'Operating Expenses',
  'Owner\'s Withdrawal',
  'Fund Distribution',
  'Other Expenses',
] as const;

const PAYMENT_METHODS = [
  'Cash',
  'Bank Transfer',
  'Check',
  'Credit Card',
] as const;

const CATEGORIES = [
  'Marketing',
  'IT & Technology',
  'Human Resources',
  'Finance',
  'Operations',
  'Sales',
  'Research & Development',
  'Administration',
] as const;

const TransactionForm: React.FC<TransactionFormProps> = ({ onNextStep }) => {
  const { updateTransactionData } = useFormData(); // Fix: Use context function

  const [formData, setFormData] = useState<TransactionData>({
    date: '',
    type: '',
    amount: '',
    description: '',
    category: '',
    paymentMethod: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const typeInputRef = useRef<HTMLSelectElement>(null);
  const amountInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const categoryInputRef = useRef<HTMLSelectElement>(null);
  const paymentMethodInputRef = useRef<HTMLSelectElement>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Transaction date is required';
    }

    // Type validation
    if (!formData.type) {
      newErrors.type = 'Transaction type is required';
    }

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (!/^\d+(\.\d{0,2})?$/.test(formData.amount)) {
      newErrors.amount = 'Please enter a valid amount';
    }

    // Description validation
    if (!formData.description) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    // Payment method validation
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'amount') {
      // Only allow numbers and up to 2 decimal places
      if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      date: '',
      type: '',
      amount: '',
      description: '',
      category: '',
      paymentMethod: '',
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        // Update the context
        updateTransactionData(formData); // Fix: Call context update function

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Transaction submitted:', formData);

        setSubmitSuccess(true);

        // Reset success message after 2 seconds and proceed to next step
        setTimeout(() => {
          setSubmitSuccess(false);
          onNextStep();
        }, 2000);
      } catch (error) {
        console.error('Error submitting transaction:', error);
      }
    } else {
      if (!formData.date && dateInputRef.current) {
        dateInputRef.current.focus();
      } else if (!formData.type && typeInputRef.current) {
        typeInputRef.current.focus();
      } else if (!formData.amount && amountInputRef.current) {
        amountInputRef.current.focus();
      } else if (!formData.description && descriptionInputRef.current) {
        descriptionInputRef.current.focus();
      } else if (!formData.category && categoryInputRef.current) {
        categoryInputRef.current.focus();
      } else if (!formData.paymentMethod && paymentMethodInputRef.current) {
        paymentMethodInputRef.current.focus();
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Record Transaction
      </h2>

      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Transaction recorded successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Transaction Date */}
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Transaction Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
              errors.date ? 'border-red-500' : 'border-gray-300'
            }`}
            ref={dateInputRef}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.date}
            </p>
          )}
        </div>

        {/* Transaction Type */}
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Transaction Type <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
              errors.type ? 'border-red-500' : 'border-gray-300'
            }`}
            ref={typeInputRef}
          >
            <option value="">Select a type</option>
            {TRANSACTION_TYPES.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.type}
            </p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount (USD) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              ref={amountInputRef}
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.amount}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter transaction details (minimum 10 characters)"
            ref={descriptionInputRef}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.description}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category/Department <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
            ref={categoryInputRef}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.category}
            </p>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <label
            htmlFor="paymentMethod"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Payment Method <span className="text-red-500">*</span>
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
              errors.paymentMethod ? 'border-red-500' : 'border-gray-300'
            }`}
            ref={paymentMethodInputRef}
          >
            <option value="">Select a payment method</option>
            {PAYMENT_METHODS.map(method => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
          {errors.paymentMethod && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.paymentMethod}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Recording Transaction...' : 'Save Transaction & Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;