export interface SalaryEarnings {
    title: string;
    amount: number;
    isEpfEtf: boolean;
}

export interface SalaryDeductions {
    title: string;
    amount: number;
}

export interface SalaryHolder {
    basicSalary: number;
    earnings: SalaryEarnings[];
    deductions: SalaryDeductions[];
}