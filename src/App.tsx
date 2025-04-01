import React, { useState } from 'react';
import Header from './components/Header';
import PersonalInfoForm from './components/PersonalInfoForm';
import IncomeForm from './components/IncomeForm';
import TransactionForm from './components/TransactionForm';
import ReasonableSalaryForm from './components/ReasonableSalaryForm';
import { FormDataProvider } from './context/FormDataContext';
import { submitToWeb3Forms } from './utils/web3forms';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitStatus, setSubmitStatus] = useState<{
    isSubmitting: boolean;
    success: boolean;
    message: string;
  }>({
    isSubmitting: false,
    success: false,
    message: '',
  });

  const goToNextStep = () => {
    setCurrentStep(prevStep => Math.min(prevStep + 1, 4));
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  };

  const handleFinalSubmit = async (formData: any) => {
    setSubmitStatus({
      isSubmitting: true,
      success: false,
      message: 'Submitting your information...',
    });

    try {
      // Prepare data for submission
      const submissionData = {
        form_name: "Tax Management System - Complete Form",
        personal_info: formData.personalInfo,
        income_data: formData.incomeData,
        expenses: formData.transactionData,
        reasonable_salary: formData.reasonableSalary,
        // Add these for the email notification
        subject: `Tax Form Submission - ${formData.personalInfo.fullName}`,
        from_name: formData.personalInfo.fullName,
        email: formData.personalInfo.email,
      };

      // Submit all data to Web3Forms
      const result = await submitToWeb3Forms(submissionData);

      if (result.success) {
        setSubmitStatus({
          isSubmitting: false,
          success: true,
          message: 'Your information has been successfully submitted! You will receive a confirmation email shortly.',
        });
      } else {
        setSubmitStatus({
          isSubmitting: false,
          success: false,
          message: `Error: ${result.message}`,
        });
      }
    } catch (error) {
      setSubmitStatus({
        isSubmitting: false,
        success: false,
        message: `An unexpected error occurred. Please try again later.`,
      });
      console.error('Final submission error:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoForm onNextStep={goToNextStep} />;
      case 2:
        return <IncomeForm onNextStep={goToNextStep} />;
      case 3:
        return <TransactionForm onNextStep={goToNextStep} />;
      case 4:
        return <ReasonableSalaryForm onSubmit={handleFinalSubmit} />;
      default:
        return null;
    }
  };

  return (
    <FormDataProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto p-4 mt-8 space-y-8">
          {/* Wizard Progress Bar */}
          <div className="flex flex-wrap justify-between items-center mb-8">
            {['Personal Info', 'Income', 'Expenses', 'Reasonable Salary'].map((label, index) => (
              <button
                key={index}
                onClick={() => goToStep(index + 1)}
                className={`px-4 py-2 m-2 rounded-md flex-grow sm:flex-grow-0 ${
                  currentStep === index + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                <span className="inline-block w-6 h-6 rounded-full bg-white text-blue-600 mr-2 text-center leading-6">
                  {index + 1}
                </span>
                {label}
              </button>
            ))}
          </div>

          {/* Submission Status Messages */}
          {submitStatus.message && (
            <div 
              className={`p-4 mb-6 rounded-md ${
                submitStatus.success 
                  ? 'bg-green-100 border border-green-400 text-green-700' 
                  : 'bg-yellow-100 border border-yellow-400 text-yellow-700'
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          {/* Step Content */}
          {renderStepContent()}
        </main>
      </div>
    </FormDataProvider>
  );
}

export default App;