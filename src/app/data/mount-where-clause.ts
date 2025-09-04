import { and, eq, SQL } from "drizzle-orm";

import { mapFieldToColumn } from "./map-field-to-column";

type Primitive = string | number | Date;

export type WhereCondition<TFieldsMap extends Record<string, string>> = {
  field: keyof TFieldsMap;
  value: Primitive;
};

interface MountWhereClauseProps<
  TTable,
  TFieldsMap extends Record<string, string>,
> {
  table: TTable;
  tableFields: TFieldsMap;
  whereList: Array<WhereCondition<TFieldsMap>>;
}

export function mountWhereClause<
  TTable,
  TFieldsMap extends Record<string, string>,
>({
  table,
  tableFields,
  whereList,
}: MountWhereClauseProps<TTable, TFieldsMap>): SQL | undefined {
  if (!whereList || whereList.length === 0) return undefined;

  const parts = whereList.map((condition) => {
    const column = mapFieldToColumn({
      table,
      tableFields,
      condition,
    });

    return eq(column, condition.value);
  });

  return and(...parts);
}
