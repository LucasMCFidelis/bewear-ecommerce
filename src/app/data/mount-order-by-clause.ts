import { asc, desc, SQL } from "drizzle-orm";

import { mapFieldToColumn } from "./map-field-to-column";

export interface OrderByCondition<TFieldsMap extends Record<string, string>> {
  field: keyof TFieldsMap;
  type: "asc" | "desc";
}

interface MountOrderByClauseProps<
  TTable,
  TFieldsMap extends Record<string, string>,
> {
  table: TTable;
  tableFields: TFieldsMap;
  orderByList: Array<OrderByCondition<TFieldsMap>>;
}

export function mountOrderByClause<
  TTable,
  TFieldsMap extends Record<string, string>,
>({
  table,
  tableFields,
  orderByList,
}: MountOrderByClauseProps<TTable, TFieldsMap>): Array<SQL> | undefined {
  if (!orderByList || orderByList.length === 0) return undefined;

  return orderByList.map((condition) => {
    const column = mapFieldToColumn({
      table,
      tableFields,
      condition,
    });

    return condition.type === "asc" ? asc(column) : desc(column);
  });
}
