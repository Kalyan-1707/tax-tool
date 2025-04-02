import React, { createContext, useState, useContext, ReactNode } from 'react';

// Personal Info form data interface
interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  contactMethod: 'email' | 'phone' | 'both';
  address: string;
}

// Income Form interfaces
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

// Transaction Form interface
interface TransactionData {
  date: string;
  type: string;
  amount: string;
  description: string;
  category: string;
  paymentMethod: string;
}

// Combined form data interface
interface FormData {
  personalInfo: PersonalInfo;
  incomeData: {
    personalIncome: PersonalIncome;
    companyIncome: CompanyIncome;
  };
  transactionData: TransactionData;
  reasonableSalary: string;
}

interface FormDataContextType {
  formData: FormData;
  updatePersonalInfo: (data: PersonalInfo) => void;
  updatePersonalIncome: (data: PersonalIncome) => void;
  updateCompanyIncome: (data: CompanyIncome) => void;
  updateTransactionData: (data: TransactionData) => void;
  updateReasonableSalary: (salary: string) => void;
}

const defaultFormData: FormData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    contactMethod: 'email',
    address: '',
  },
  incomeData: {
    personalIncome: {
      monthlySalary: '',
      investmentReturns: '',
      rentalIncome: '',
      freelanceEarnings: '',
      additionalSources: [],
    },
    companyIncome: {
      baseSalary: '',
      bonuses: '',
      commission: '',
      stockOptions: '',
      benefits: '',
    },
  },
  transactionData: {
    date: '',
    type: '',
    amount: '',
    description: '',
    category: '',
    paymentMethod: '',
  },
  reasonableSalary: '',
};

const FormDataContext = createContext<FormDataContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'tax_form_data';

export const FormDataProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(() => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : defaultFormData;
  });

  const updatePersonalInfo = (data: PersonalInfo) => {
    setFormData(prevState => ({
      ...prevState,
      personalInfo: data,
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      ...formData,
      personalInfo: data,
    }));
  };

  const updatePersonalIncome = (data: PersonalIncome) => {
    setFormData(prevState => ({
      ...prevState,
      incomeData: {
        ...prevState.incomeData,
        personalIncome: data,
      },
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      ...formData,
      incomeData: {
        ...formData.incomeData,
        personalIncome: data,
      },
    }));
  };

  const updateCompanyIncome = (data: CompanyIncome) => {
    setFormData(prevState => ({
      ...prevState,
      incomeData: {
        ...prevState.incomeData,
        companyIncome: data,
      },
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      ...formData,
      incomeData: {
        ...formData.incomeData,
        companyIncome: data,
      },
    }));
  };

  const updateTransactionData = (data: TransactionData) => {
    setFormData(prevState => ({
      ...prevState,
      transactionData: data,
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      ...formData,
      transactionData: data,
    }));
  };

  const updateReasonableSalary = (salary: string) => {
    setFormData(prevState => ({
      ...prevState,
      reasonableSalary: salary,
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      ...formData,
      reasonableSalary: salary,
    }));
  };

  return (
    <FormDataContext.Provider
      value={{
        formData,
        updatePersonalInfo,
        updatePersonalIncome,
        updateCompanyIncome,
        updateTransactionData,
        updateReasonableSalary,
      }}
    >
      {children}
    </FormDataContext.Provider>
  );
};

export const useFormData = (): FormDataContextType => {
  const context = useContext(FormDataContext);
  if (context === undefined) {
    throw new Error('useFormData must be used within a FormDataProvider');
  }
  return context;
};
