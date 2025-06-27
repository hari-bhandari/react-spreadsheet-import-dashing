import { Column, useRowSelection } from "react-data-grid"
import { Box, Checkbox, Input, Switch, Tooltip } from "@chakra-ui/react"
import type { Data, Fields } from "../../../types"
import type { ChangeEvent } from "react"
import type { Meta } from "../types"
import { CgInfo } from "react-icons/cg"
import { TableSelect } from "../../../components/Selects/TableSelect"

const SELECT_COLUMN_KEY = "select-row"

function autoFocusAndSelect(input: HTMLInputElement | null) {
  input?.focus()
  input?.select()
}

export const generateColumns = <T extends string>(fields: Fields<T>): Column<Data<T> & Meta>[] => [
  {
    key: SELECT_COLUMN_KEY,
    name: "",
    width: 35,
    minWidth: 35,
    maxWidth: 35,
    resizable: false,
    sortable: false,
    frozen: true,
    cellClass: "rdg-checkbox",
    renderCell: (props) => {
      const { isRowSelected, onRowSelectionChange } = useRowSelection()
      return (
        <Checkbox
          bg="white"
          aria-label="Select"
          isChecked={isRowSelected}
          onChange={(event) => {
            onRowSelectionChange({
              row: props.row,
              checked: Boolean(event.target.checked),
              isShiftClick: (event.nativeEvent as MouseEvent).shiftKey,
            })
          }}
        />
      )
    },
  },
  ...fields.map(
    (column): Column<Data<T> & Meta> => ({
      key: column.key,
      name: column.label,
      minWidth: 150,
      resizable: true,
      renderHeaderCell: () => (
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
      editable: column.fieldType.type !== "checkbox",
      renderEditCell: ({ row, onRowChange, onClose }) => {
        let component

        switch (column.fieldType.type) {
          case "select":
            component = (
              <TableSelect
                value={column.fieldType.options.find((option) => option.value === ((row as any)[column.key] as string))}
                onChange={(value) => {
                  onRowChange({ ...row, [column.key]: value?.value }, true)
                }}
                options={column.fieldType.options}
              />
            )
            break
          default:
            component = (
              <Box paddingInlineStart="0.5rem">
                <Input
                  ref={autoFocusAndSelect}
                  variant="unstyled"
                  autoFocus
                  size="small"
                  value={(row as any)[column.key] as string}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    onRowChange({ ...row, [column.key]: event.target.value })
                  }}
                  onBlur={() => onClose(true)}
                />
              </Box>
            )
        }

        return component
      },
      renderCell: ({ row, onRowChange }) => {
        let component

        switch (column.fieldType.type) {
          case "checkbox":
            component = (
              <Box
                display="flex"
                alignItems="center"
                height="100%"
                onClick={(event) => {
                  event.stopPropagation()
                }}
              >
                <Switch
                  isChecked={(row as any)[column.key] as boolean}
                  onChange={() => {
                    onRowChange({ ...row, [column.key]: !(row as any)[column.key] })
                  }}
                />
              </Box>
            )
            break
          case "select":
            component = (
              <Box minWidth="100%" minHeight="100%" overflow="hidden" textOverflow="ellipsis">
                {column.fieldType.options.find((option) => option.value === (row as any)[column.key])?.label || null}
              </Box>
            )
            break
          default:
            component = (
              <Box minWidth="100%" minHeight="100%" overflow="hidden" textOverflow="ellipsis">
                {(row as any)[column.key]}
              </Box>
            )
        }

        if (row.__errors?.[column.key]) {
          return (
            <Tooltip placement="top" hasArrow label={row.__errors?.[column.key]?.message}>
              {component}
            </Tooltip>
          )
        }

        return component
      },
      cellClass: (row: Meta) => {
        switch (row.__errors?.[column.key]?.level) {
          case "error":
            return "rdg-cell-error"
          case "warning":
            return "rdg-cell-warning"
          case "info":
            return "rdg-cell-info"
          default:
            return ""
        }
      },
    }),
  ),
]
