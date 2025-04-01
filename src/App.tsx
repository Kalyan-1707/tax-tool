import React from 'react';
import Header from './components/Header';
import IncomeForm from './components/IncomeForm';
import TransactionForm from './components/TransactionForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-4 mt-8 space-y-8">
        <TransactionForm />
        <IncomeForm />
      </main>
    </div>
  );
}

export default App;