"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

type Person = {
  name: string;
  age: number;
};

type Employee = {
  employeeId: string;
  department: string;
};

type EmployeePerson = Person & Employee;

export const IntersectionsExamples = () => {
  const worker: EmployeePerson = {
    name: "John Doe",
    age: 30,
    employeeId: "E123",
    department: "Engineering",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Person</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <p className="mb-2 font-semibold text-xs">Type: Person & Employee</p>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-semibold">Name:</span> {worker.name}
            </p>
            <p>
              <span className="font-semibold">Age:</span> {worker.age}
            </p>
            <p>
              <span className="font-semibold">Employee ID:</span>{" "}
              {worker.employeeId}
            </p>
            <p>
              <span className="font-semibold">Department:</span>{" "}
              {worker.department}
            </p>
          </div>
        </div>
        <div className="rounded-lg bg-muted p-4">
          <p className="text-xs">
            This type combines properties from both <code>Person</code> and{" "}
            <code>Employee</code> types.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
