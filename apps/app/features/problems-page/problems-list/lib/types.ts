export type ProblemListFilterField = "difficulty" | "status" | "topic";

export type ProblemListFilterOperator = "is";

export type ProblemListFilterRow = {
  id: string;
  field: ProblemListFilterField;
  operator: ProblemListFilterOperator;
  /** Empty string means the row does not constrain results. */
  value: string;
};
