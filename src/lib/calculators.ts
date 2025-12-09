export const calculateMortgage = ({
  loanAmount,
  interestRate,
  loanTerm,
}: {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
}): number => {
  if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
    return 0;
  }
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  const numerator =
    monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
  const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
  const monthlyPayment = loanAmount * (numerator / denominator);
  return monthlyPayment;
};

export const calculateLoanAmortization = ({
  loanAmount,
  interestRate,
  loanTerm,
}: {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
}) => {
  if (loanAmount <= 0 || interestRate < 0 || loanTerm <= 0) {
    return { monthlyPayment: 0, amortizationSchedule: [] };
  }

  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  const monthlyPayment =
    monthlyInterestRate === 0
      ? loanAmount / numberOfPayments
      : loanAmount *
        ((monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
          (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1));

  let balance = loanAmount;
  const amortizationSchedule = [];

  for (let i = 1; i <= numberOfPayments; i++) {
    const interestPayment = balance * monthlyInterestRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;

    amortizationSchedule.push({
      month: i,
      principal: principalPayment,
      interest: interestPayment,
      balance: balance > 0 ? balance : 0,
    });
  }

  return { monthlyPayment, amortizationSchedule };
};

export const calculateSavings = ({
  initialInvestment,
  monthlyContribution,
  interestRate,
  years,
}: {
  initialInvestment: number;
  monthlyContribution: number;
  interestRate: number;
  years: number;
}) => {
  const annualRate = interestRate / 100;
  const monthlyRate = annualRate / 12;
  const totalMonths = years * 12;
  
  let futureValue = initialInvestment * Math.pow(1 + monthlyRate, totalMonths);
  
  if (monthlyRate > 0) {
    futureValue += monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
  } else {
    futureValue += monthlyContribution * totalMonths;
  }

  const data = [];
  for (let year = 1; year <= years; year++) {
    const months = year * 12;
    let value = initialInvestment * Math.pow(1 + monthlyRate, months);
    if (monthlyRate > 0) {
        value += monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    } else {
        value += monthlyContribution * months;
    }
    data.push({ year, value });
  }

  return { futureValue, data };
};

export const calculateAutoLoan = ({
    carPrice,
    downPayment,
    tradeInValue,
    interestRate,
    loanTerm
}: {
    carPrice: number;
    downPayment: number;
    tradeInValue: number;
    interestRate: number;
    loanTerm: number;
}) => {
    const loanAmount = carPrice - downPayment - tradeInValue;
    return calculateMortgage({ loanAmount, interestRate, loanTerm });
};

export const calculateInvestment = ({
    initialInvestment,
    monthlyContribution,
    interestRate,
    years,
    compoundingFrequency,
}: {
    initialInvestment: number;
    monthlyContribution: number;
    interestRate: number;
    years: number;
    compoundingFrequency: number;
}) => {
    const annualRate = interestRate / 100;
    const totalPeriods = years * compoundingFrequency;
    const ratePerPeriod = annualRate / compoundingFrequency;

    let futureValue = initialInvestment * Math.pow(1 + ratePerPeriod, totalPeriods);

    // This is a simplification for monthly contributions with different compounding
    const monthlyRate = annualRate / 12;
    const totalMonths = years * 12;

    if (monthlyRate > 0) {
        futureValue += monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    } else {
        futureValue += monthlyContribution * totalMonths;
    }

    const data = [];
    for (let year = 1; year <= years; year++) {
        const months = year * 12;
        let value = initialInvestment * Math.pow(1 + (annualRate / compoundingFrequency), year * compoundingFrequency);
        if (monthlyRate > 0) {
            value += monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        } else {
            value += monthlyContribution * months;
        }
        data.push({ year, value });
    }

    return { futureValue, data };
};
