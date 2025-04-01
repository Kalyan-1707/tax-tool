import React, { useState, useEffect } from 'react';
import { HelpCircle, PlusCircle, MinusCircle, DollarSign, AlertCircle } from 'lucide-react';
import { useFormData } from '../context/FormDataContext'; // Fix: Import useFormData

interface AdditionalIncome {
  id: string;
  source: string;
  amount: string;
  description: string;
}

interface PersonalIncome {
  monthlySalary: string;
  investmentReturns: string;
  rentalIncome: string;
  freelanceEarnings: string;
  additionalSources: AdditionalIncome[];
}

interface CompanyIncome {
  baseSalary: string;
  bonuses: string;
  commission: string;
  stockOptions: string;
  benefits: string;
}

interface FormErrors {
  [key: string]: string;
}

interface IncomeFormProps {
  onNextStep: () => void;
}

const IncomeForm: React.FC<IncomeFormProps> = ({ onNextStep }) => {
  const { updatePersonalIncome, updateCompanyIncome } = useFormData(); // Fix: Use context functions

  const [personalIncome, setPersonalIncome] = useState<PersonalIncome>({
    monthlySalary: '',
    investmentReturns: '',
    rentalIncome: '',
    freelanceEarnings: '',
    additionalSources: [],
  });

  const [companyIncome, setCompanyIncome] = useState<CompanyIncome>({
    baseSalary: '',
    bonuses: '',
    commission: '',
    stockOptions: '',
    benefits: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [personalTotal, setPersonalTotal] = useState<number>(0);
  const [companyTotal, setCompanyTotal] = useState<number>(0);

  const validateNumber = (value: string): boolean => {
    return /^\d*\.?\d{0,2}$/.test(value) && Number(value) >= 0;
  };

  const handlePersonalIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '' || validateNumber(value)) {
      setPersonalIncome(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: '' }));
    } else {
      setErrors(prev => ({ ...prev, [name]: 'Please enter a valid amount' }));
    }
  };

  const handleCompanyIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '' || validateNumber(value)) {
      setCompanyIncome(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: '' }));
    } else {
      setErrors(prev => ({ ...prev, [name]: 'Please enter a valid amount' }));
    }
  };

  const addAdditionalSource = () => {
    setPersonalIncome(prev => ({
      ...prev,
      additionalSources: [
        ...prev.additionalSources,
        { id: Date.now().toString(), source: '', amount: '', description: '' },
      ],
    }));
  };

  const removeAdditionalSource = (id: string) => {
    setPersonalIncome(prev => ({
      ...prev,
      additionalSources: prev.additionalSources.filter(source => source.id !== id),
    }));
  };

  const handleAdditionalSourceChange = (
    id: string,
    field: keyof AdditionalIncome,
    value: string
  ) => {
    setPersonalIncome(prev => ({
      ...prev,
      additionalSources: prev.additionalSources.map(source =>
        source.id === id
          ? {
              ...source,
              [field]:
                field === 'amount'
                  ? validateNumber(value) || value === ''
                    ? value
                    : source.amount
                  : value,
            }
          : source
      ),
    }));
  };

  useEffect(() => {
    const calculateTotal = (obj: Record<string, string>): number => {
      return Object.values(obj).reduce((sum, value) => {
        const numValue = parseFloat(value) || 0;
        return sum + numValue;
      }, 0);
    };

    const additionalSourcesTotal = personalIncome.additionalSources.reduce(
      (sum, source) => sum + (parseFloat(source.amount) || 0),
      0
    );

    const personalSubtotal =
      calculateTotal({
        monthlySalary: personalIncome.monthlySalary,
        investmentReturns: personalIncome.investmentReturns,
        rentalIncome: personalIncome.rentalIncome,
        freelanceEarnings: personalIncome.freelanceEarnings,
      }) + additionalSourcesTotal;

    const companySubtotal = calculateTotal(companyIncome);

    setPersonalTotal(personalSubtotal);
    setCompanyTotal(companySubtotal);
  }, [personalIncome, companyIncome]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ personalIncome, companyIncome });
    
    // Update the context
    updatePersonalIncome(personalIncome); // Fix: Call context update function
    updateCompanyIncome(companyIncome); // Fix: Call context update function
    
    // Move to next step
    onNextStep();
  };

  const renderTooltip = (text: string) => (
    <div className="group relative inline-block ml-1">
      <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
      <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-md transition-opacity duration-300 w-48 -left-20 top-6">
        {text}
        <div className="absolute -top-1 left-1/2 -ml-1 w-2 h-2 bg-gray-900 transform rotate-45" />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Income Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Income Section */}
        <section className="space-y-6">
          <h3 className="text-xl font-medium text-gray-700 border-b pb-2">
            Personal Income Sources
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Salary */}
            <div>
              <label
                htmlFor="monthlySalary"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Monthly Salary
                {renderTooltip('Your regular monthly salary before taxes')}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="monthlySalary"
                  name="monthlySalary"
                  value={personalIncome.monthlySalary}
                  onChange={handlePersonalIncomeChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
                    errors.monthlySalary ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.monthlySalary && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.monthlySalary}
                </p>
              )}
            </div>

            {/* Investment Returns */}
            <div>
              <label
                htmlFor="investmentReturns"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Investment Returns
                {renderTooltip('Income from investments, dividends, etc.')}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="investmentReturns"
                  name="investmentReturns"
                  value={personalIncome.investmentReturns}
                  onChange={handlePersonalIncomeChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
                    errors.investmentReturns ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.investmentReturns && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.investmentReturns}
                </p>
              )}
            </div>

            {/* Rental Income */}
            <div>
              <label
                htmlFor="rentalIncome"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Rental Income
                {renderTooltip('Income from property rentals')}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="rentalIncome"
                  name="rentalIncome"
                  value={personalIncome.rentalIncome}
                  onChange={handlePersonalIncomeChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
                    errors.rentalIncome ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.rentalIncome && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.rentalIncome}
                </p>
              )}
            </div>

            {/* Freelance Earnings */}
            <div>
              <label
                htmlFor="freelanceEarnings"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Freelance Earnings
                {renderTooltip('Income from freelance work or consulting')}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="freelanceEarnings"
                  name="freelanceEarnings"
                  value={personalIncome.freelanceEarnings}
                  onChange={handlePersonalIncomeChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
                    errors.freelanceEarnings ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.freelanceEarnings && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.freelanceEarnings}
                </p>
              )}
            </div>
          </div>

          {/* Additional Income Sources */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-700">
                Additional Income Sources
              </h4>
              <button
                type="button"
                onClick={addAdditionalSource}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <PlusCircle className="h-5 w-5 mr-1" />
                Add Source
              </button>
            </div>

            {personalIncome.additionalSources.map((source, index) => (
              <div
                key={source.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md"
              >
                <div>
                  <label
                    htmlFor={`source-${source.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Source Name
                  </label>
                  <input
                    type="text"
                    id={`source-${source.id}`}
                    value={source.source}
                    onChange={e =>
                      handleAdditionalSourceChange(source.id, 'source', e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 border-gray-300"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`amount-${source.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      id={`amount-${source.id}`}
                      value={source.amount}
                      onChange={e =>
                        handleAdditionalSourceChange(source.id, 'amount', e.target.value)
                      }
                      className="w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 border-gray-300"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label
                    htmlFor={`description-${source.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      id={`description-${source.id}`}
                      value={source.description}
                      onChange={e =>
                        handleAdditionalSourceChange(
                          source.id,
                          'description',
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalSource(source.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <MinusCircle className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <p className="text-lg font-semibold text-gray-800">
              Personal Income Total:{' '}
              <span className="text-blue-600">${personalTotal.toFixed(2)}</span>
            </p>
          </div>
        </section>

        {/* Company Income Section */}
        <section className="space-y-6">
          <h3 className="text-xl font-medium text-gray-700 border-b pb-2">
            Company Income (NASCORP)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Base Salary */}
            <div>
              <label
                htmlFor="baseSalary"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Base Salary
                {renderTooltip('Annual base salary from NASCORP')}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="baseSalary"
                  name="baseSalary"
                  value={companyIncome.baseSalary}
                  onChange={handleCompanyIncomeChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
                    errors.baseSalary ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.baseSalary && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.baseSalary}
                </p>
              )}
            </div>

            {/* Bonuses */}
            <div>
              <label
                htmlFor="bonuses"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bonuses
                {renderTooltip('Annual bonuses and performance incentives')}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="bonuses"
                  name="bonuses"
                  value={companyIncome.bonuses}
                  onChange={handleCompanyIncomeChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
                    errors.bonuses ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.bonuses && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.bonuses}
                </p>
              )}
            </div>

            {/* Commission */}
            <div>
              <label
                htmlFor="commission"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Commission
                {renderTooltip('Sales or performance-based commission')}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="commission"
                  name="commission"
                  value={companyIncome.commission}
                  onChange={handleCompanyIncomeChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
                    errors.commission ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.commission && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.commission}
                </p>
              )}
            </div>

            {/* Stock Options */}
            <div>
              <label
                htmlFor="stockOptions"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Stock Options
                {renderTooltip('Value of vested stock options')}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="stockOptions"
                  name="stockOptions"
                  value={companyIncome.stockOptions}
                  onChange={handleCompanyIncomeChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
                    errors.stockOptions ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.stockOptions && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.stockOptions}
                </p>
              )}
            </div>

            {/* Benefits */}
            <div>
              <label
                htmlFor="benefits"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Benefits Value
                {renderTooltip('Monetary value of company benefits')}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="benefits"
                  name="benefits"
                  value={companyIncome.benefits}
                  onChange={handleCompanyIncomeChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
                    errors.benefits ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.benefits && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.benefits}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-lg font-semibold text-gray-800">
              Company Income Total:{' '}
              <span className="text-blue-600">${companyTotal.toFixed(2)}</span>
            </p>
          </div>
        </section>

        <div className="pt-6 border-t">
          <p className="text-xl font-bold text-gray-800">
            Total Annual Income:{' '}
            <span className="text-blue-600">
              ${(personalTotal + companyTotal).toFixed(2)}
            </span>
          </p>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Submit Income Information
          </button>
        </div>
      </form>
    </div>
  );
};

export default IncomeForm;