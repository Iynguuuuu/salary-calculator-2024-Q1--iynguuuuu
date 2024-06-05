"use client";
import { useSalaryStore } from "@/lib/salary-state";
import { SalaryHolder } from "@/models/salary.model";
import { useEffect, useState } from "react";

export function SalaryShowcase() {
  const [salaryHolder, setSalaryHolder] = useState<SalaryHolder>({
    basicSalary: 0,
    earnings: [],
    deductions: [],
  });

  const [salaryDisplay, setSalaryDisplay] = useState<{
    basicSalary: number;
    grossEarning: number;
    grossDeduction: number;
    employeeEPF: number;
    APIT: number;
    netSalary: number;
    employerEPF: number;
    employerETF: number;
    CTC: number;
  }>({
    basicSalary: 0,
    grossEarning: 0,
    grossDeduction: 0,
    employeeEPF: 0,
    APIT: 0,
    netSalary: 0,
    employerEPF: 0,
    employerETF: 0,
    CTC: 0
  });

  const prepareSalaryDisplay = () => {
    if (!salaryHolder) {
      return;
    }

    if (!salaryHolder.basicSalary) {
      return;
    }

    const totalEarnings = salaryHolder.basicSalary;
    
    const totalEarningForEPF =
      salaryHolder.basicSalary +
      salaryHolder.earnings
        .filter((v) => v.isEpfEtf)
        .reduce((acc, curr) => {
          return acc + curr.amount;
        }, 0);

    const grossDeduction = salaryHolder.deductions.reduce((acc, curr) => {
      return acc + curr.amount;
    }, 0);

    const grossEarnings = totalEarnings + salaryHolder.earnings
      .filter((v) => v.isEpfEtf)
      .reduce((acc, curr) => {
        return acc + curr.amount;
      }, 0);

    const grossSalaryForEpf = totalEarningForEPF - grossDeduction;

    const employeeEPF = grossSalaryForEpf * 0.08;

    const employerEPF = grossSalaryForEpf * 0.12;
    const employerETF = grossSalaryForEpf * 0.03;

    const apiT = grossEarnings * 0.18;

    const netSalary = grossEarnings - employeeEPF - apiT;

    const ctc = grossEarnings + employerEPF + employerETF;

    setSalaryDisplay({
      basicSalary: totalEarnings,
      grossEarning: grossEarnings,
      grossDeduction: grossDeduction,
      employeeEPF: employeeEPF,
      APIT: apiT,
      netSalary: netSalary,
      employerEPF: employerEPF,
      employerETF: employerETF,
      CTC: ctc,
    });
  };

  useEffect(() => {
    useSalaryStore.subscribe((state: any) => {
      if (!state.salary) return;
      if (!state.salary.basicSalary) return;
      setSalaryHolder(state.salary);
      prepareSalaryDisplay();
    });
  });

  return (
    <div className=" border rounded-xl px-5 py-5">
      <h2 className="text-lg font-bold mb-10"> Your Salary</h2>

      <div>
        <table>
          <thead>
            <tr>
              <th className="text-left text-gray-500 ">Items</th>
              <th className="text-right text-gray-500 px-[8rem] py-3">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Basic Salary</td>
              <td className="text-right px-[8rem]">
                {salaryHolder.basicSalary || "-"}
              </td>
            </tr>
            <tr>
              <td>Gross Earning</td>
              <td className="text-right px-[8rem]">
                {salaryDisplay?.grossEarning || "-"}
              </td>
            </tr>
            <tr>
              <td>Gross Deduction</td>
              <td className="text-right px-[8rem]">
                {-salaryDisplay?.grossDeduction || "-"}
              </td>
            </tr>
            <tr>
              <td>Employee EPF (8%)</td>
              <td className="text-right px-[8rem]">
                {-salaryDisplay?.employeeEPF || "-"}
              </td>
            </tr>
            <tr>
              <td>APIT</td>
              <td className="text-right px-[8rem]">
                { -salaryDisplay?.APIT || "-"}
              </td>
            </tr>
            <br />
            <tr className="font-bold border">
              <td>Net Salary (taken home)</td>
              <td className="text-right px-[8rem]">
                {salaryDisplay?.netSalary || "-"}
              </td>
            </tr>
            <br />
            <tr>
              <td className="text-gray-500 font-bold">
                Contribution from employer
              </td>
            </tr>
            <tr>
              <td>Employeer EPF (12%)</td>
              <td className="text-right px-[8rem]">
                {`${salaryDisplay?.employerEPF} ` || "-"}
              </td>
            </tr>
            <tr>
              <td>Employeer ETF (3%)</td>
              <td className="text-right px-[8rem]">
                {`${salaryDisplay?.employerETF}` || "-"}
              </td>
            </tr>
            <br />
            <tr>
              <td>CTC (Cost to company)</td>
              <td className="text-right px-[8rem]">
                {" "}
                {`${salaryDisplay?.CTC}` || "-"}
              </td>
            </tr>
          </tbody>
        </table>
        <div></div>
      </div>
    </div>
  );
}
