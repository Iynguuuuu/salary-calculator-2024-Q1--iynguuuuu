"use client";
import { SalaryShowcase } from "@/components/customs/SalaryShowcase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSalaryStore } from "@/lib/salary-state";
import { SalaryHolder } from "@/models/salary.model";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Cross1Icon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  basicSalary: z.number(),
  earnings: z.array(
    z.object({
      title: z.string().min(1),
      amount: z.number(),
      isEpfEtf: z.boolean(),
    })
  ),
  deductions: z.array(
    z.object({
      title: z.string().min(1),
      amount: z.number(),
    })
  ),
});

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      basicSalary: 0,
      earnings: [{ title: "", amount: 0, isEpfEtf: false }],
      deductions: [{ title: "", amount: 0 }],
    },
  });

  const salaryStateUpdate = useSalaryStore((state: any) => state.setSalary);
  const salaryStateReset = useSalaryStore((state: any) => state.reset);


  const onUpdateSalaryHolder = (salaryHolder: SalaryHolder) => {
    salaryStateUpdate(salaryHolder);
  };

  const resetAll = () => {
    form.reset();
    salaryStateReset();

  };

  const {
    fields: earningFields,
    append: appendEarning,
    remove: removeEarning,
  } = useFieldArray({
    control: form.control,
    name: "earnings",
  });

  const {
    fields: deductionFields,
    append: appendDeduction,
    remove: removeDeduction,
  } = useFieldArray({
    control: form.control,
    name: "deductions",
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    onUpdateSalaryHolder(data);
  }

  useEffect(() => {
    console.log("useEffect");
  }, []);

  return (
    <div className="flex w-full ml-[5rem] p-10">
      <Card className="bg-gray-100 w-[50%] p-4">
        <div className="flex">
          <div>
            <h2 className="text-lg font-bold mb-4">Calculate Your Salary</h2>
          </div>

          <div className="ml-auto">
            <Button variant="ghost" className="text-blue">
              <ReloadIcon className="mr-2 h-4 w-4 bg-blue" onClick={resetAll} /> Reset
            </Button>
          </div>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="basicSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Basic Salary</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white w-2/3"
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                      />
                    </FormControl>
                    <FormDescription>Enter your basic salary.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <h3 className="font-bold">Earnings</h3>
                <FormDescription>
                  Allowance, Fixed Allowance, bonus and etc.
                </FormDescription>
                {earningFields.map((item, index) => (
                  <div key={item.id} className="space-y-4">
                    <br />
                    <div className="flex flex-row space-x-5">
                      <FormField
                        control={form.control}
                        name={`earnings.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="bg-white"
                                placeholder="Title"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`earnings.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="bg-white"
                                type="number"
                                placeholder="Amount"
                                {...field}
                                onChange={(event) =>
                                  field.onChange(+event.target.value)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button className="rounded-full bg-[#ebe7e7]"
                        variant="outline"
                        size="icon"
                        type="button"
                        onClick={() => removeEarning(index)}>
                        <Cross1Icon />
                      </Button>

                      <FormField
                        control={form.control}
                        name={`earnings.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="mt-[7px] flex flex-row space-x-5">
                                <Checkbox
                                  onCheckedChange={field.onChange} {...field}></Checkbox>
                                <div className="mt-[-2px]">EPF/ETF</div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
                <br />
                <Button
                  variant="ghost"
                  className="text-[blue]"
                  type="button"
                  onClick={() =>
                    appendEarning({ title: "", amount: 0, isEpfEtf: false })
                  }>
                  + Add New Allowance
                </Button>
              </div>

              <hr />

              <div>
                <h3 className="font-bold">Deductions</h3>
                <FormDescription>
                  Salary Advances, Loan deductions and all
                </FormDescription>

                {deductionFields.map((item, index) => (
                  <div key={item.id} className="space-y-4">
                    <br />
                    <div className="flex flex-row space-x-5">
                      <FormField
                        control={form.control}
                        name={`deductions.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="bg-white"
                                placeholder="Title"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`deductions.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            {/* <FormLabel>Amount</FormLabel> */}
                            <FormControl>
                              <Input
                                className="bg-white"
                                type="number"
                                placeholder="Amount"
                                {...field}
                                onChange={(event) =>
                                  field.onChange(+event.target.value)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button className="rounded-full bg-[#ebe7e7]"
                        variant="outline"
                        size="icon"
                        type="button"
                        onClick={() => removeDeduction(index)}>
                        <Cross1Icon />
                      </Button>

                    </div>
                  </div>
                ))}
                <br />
                <Button
                  variant="ghost"
                  className="text-[blue]"
                  type="button"
                  onClick={() =>
                    appendDeduction({ title: "", amount: 0 })
                  }>
                  + Add New Allowance
                </Button>
              </div>
              <div className="text-end">
                <Button className="bg-blue-400" type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </div>
      </Card>

      <div className="ml-[1rem]">
        <SalaryShowcase></SalaryShowcase>
      </div>
    </div>
  );
}
