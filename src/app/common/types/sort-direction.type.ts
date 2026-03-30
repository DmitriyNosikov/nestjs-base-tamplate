export const SortDirectionTypeEnum = {
  ASC: 'ASC',
  DESC: 'DESC'
} as const;

export type SortDirectionType = (typeof SortDirectionTypeEnum)[keyof typeof SortDirectionTypeEnum];