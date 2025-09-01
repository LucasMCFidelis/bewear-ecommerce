import { and, eq, SQL } from "drizzle-orm";
import { AnyPgColumn } from "drizzle-orm/pg-core";

type Primitive = string | number | Date;

export type WhereCondition<TColumns> = {
  field: keyof TColumns;
  value: Primitive;
};

interface MountWhereClauseProps<TColumns extends Record<string, AnyPgColumn>> {
  table: TColumns;
  whereList: Array<WhereCondition<TColumns>>;
}

export function mountWhereClause<TColumns extends Record<string, AnyPgColumn>>({
  table,
  whereList,
}: MountWhereClauseProps<TColumns>): SQL | undefined {
  if (!whereList || whereList.length === 0) return undefined;

  return and(
    ...whereList.map((condition) => eq(table[condition.field], condition.value))
  );
}
