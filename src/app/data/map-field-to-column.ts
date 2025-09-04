import { AnyPgColumn } from "drizzle-orm/pg-core";

import { OrderByCondition } from "./mount-order-by-clause";
import { WhereCondition } from "./mount-where-clause";

interface MapFieldToColumnProps<
  TTable,
  TFieldsMap extends Record<string, string>,
> {
  table: TTable;
  tableFields: TFieldsMap;
  condition: WhereCondition<TFieldsMap> | OrderByCondition<TFieldsMap>;
}

export function mapFieldToColumn<
  TTable,
  TFieldsMap extends Record<string, string>,
>({
  table,
  tableFields,
  condition,
}: MapFieldToColumnProps<TTable, TFieldsMap>): AnyPgColumn {
  const tableAsRecord = table as unknown as Record<
    string,
    AnyPgColumn | undefined
  >;

  const columnKey = tableFields[condition.field as keyof TFieldsMap];

  if (!columnKey || typeof columnKey !== "string") {
    throw new Error(
      `checkColumnExistsToMountClause: invalid mapping for field "${String(condition.field)}". ` +
        `It must map to a string column key on the table object.`
    );
  }

  const column = tableAsRecord[columnKey];
  if (!column) {
    throw new Error(
      `checkColumnExistsToMountClause: column "${columnKey}" not found on table. ` +
        `Check your tableFields mapping.`
    );
  }

  return column;
}
