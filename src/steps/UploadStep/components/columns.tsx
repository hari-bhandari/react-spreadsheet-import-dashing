import type { Column, RenderHeaderCellProps, RenderCellProps } from "react-data-grid"
import { Box, Tooltip } from "@chakra-ui/react"
import type { Fields } from "../../../types"
import { CgInfo } from "react-icons/cg"

export const generateColumns = <T extends string>(fields: Fields<T>) =>
  fields.map(
    (column): Column<any> => ({
      key: column.key,
      name: column.label,
      minWidth: 150,
      renderHeaderCell: (_: RenderHeaderCellProps<any, unknown>): React.ReactNode => (
        <Box display="flex" gap={1} alignItems="center" position="relative">
          <Box flex={1} overflow="hidden" textOverflow="ellipsis">
            {column.label}
          </Box>
          {column.description && (
            <Tooltip placement="top" hasArrow label={column.description}>
              <Box flex={"0 0 auto"}>
                <CgInfo size="16px" />
              </Box>
            </Tooltip>
          )}
        </Box>
      ),
      renderCell: ({ row }: RenderCellProps<any, unknown>): React.ReactNode => (
        <Box minWidth="100%" minHeight="100%" overflow="hidden" textOverflow="ellipsis">
          {row[column.key]}
        </Box>
      ),
    }),
  )
