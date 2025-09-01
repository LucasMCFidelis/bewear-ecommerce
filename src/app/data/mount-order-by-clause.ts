import { asc, desc, SQL } from "drizzle-orm";
import { AnyPgColumn } from "drizzle-orm/pg-core";

export interface OrderByCondition<
  TColumns extends Record<string, AnyPgColumn>,
> {
  field: keyof TColumns;
  type: "asc" | "desc";
}

interface MountOrderByClauseProps<
  TColumns extends Record<string, AnyPgColumn>,
> {
  table: TColumns;
  orderByList: Array<OrderByCondition<TColumns>>;
}

export function mountOrderByClause<
  TColumns extends Record<string, AnyPgColumn>,
>({
  table,
  orderByList,
}: MountOrderByClauseProps<TColumns>): Array<SQL> | undefined {
  if (!orderByList || orderByList.length === 0) return undefined;

  return orderByList.map((item) =>
    item.type === "asc" ? asc(table[item.field]) : desc(table[item.field])
  );
}
