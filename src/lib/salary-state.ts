import { SalaryHolder } from '@/models/salary.model'
import { create } from 'zustand'

export const useSalaryStore = create((set) => ({
  salary: {
    basicSalary: 0,
    earnings: [],
    deductions: [],
  },
  setSalary: (salary: SalaryHolder) => set({ salary }),
  reset: () => set({ salary: { basicSalary: 0, earnings: [], deductions: [] } })
}))