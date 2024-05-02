import { SelectChangeEvent } from "@mui/material";
import {
  DataGrid,
  DataGridProps,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { ReactNode } from "react";

interface DataGridProp extends DataGridProps {
  searchQuery?: (e: any) => void;
  onPageSizeChange?: (
    event?: SelectChangeEvent<number>,
    child?: ReactNode
  ) => void;
  pageSizeOptions?: number[];
  onPageChange?: (event?: any, page?: number) => void;
  loading?: boolean;
  useMuiPagination?: boolean;
  withParams?: boolean;
  hidden?: boolean;
  hideFilterBar?: boolean;
  enableKeepGroupedColumnHidden?: boolean;
  disableAggregation?: boolean;
  rows: any;
  columns: any;
}

const DataTable: any = ({ props }: { props: DataGridProp }) => {
  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={props.rows}
        columns={props.columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 25, 50, 100]}
      />
    </div>
  );
};

export default DataTable;
