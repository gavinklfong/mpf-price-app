
import React from 'react';
import './SummaryTable.css';

import DataTable from 'react-data-table-component';

export interface Row {
    trustee: string
    fund: string
    mth12: number
    mth6: number
    mth3: number
    mth1: number
}

const formatterOption = {
    style: 'percent',
    signDisplay: 'exceptZero',
    minimumFractionDigits: 2
 };
const PercentFormatter = Intl.NumberFormat("en-US", formatterOption);

const formatCell = (value:number) => {
    if (value > 0) 
        return <div><div style={{ color: 'green' }}>{PercentFormatter.format(value)}</div></div>
    else if (value < 0)
        return <div><div style={{ color: 'red' }}>{PercentFormatter.format(value)}</div></div>
    else {
        return <div><div style={{ color: 'grey' }}>{PercentFormatter.format(value)}</div></div>
    }
}

const conditionalRowStyles = [
    {
      when: (row: Row) => (row.mth1 > 0) || (row.mth3 > 0) || (row.mth6 > 0) || (row.mth12 > 0),
      style: {
        backgroundColor: 'green',
        color: 'white',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
    {
        when: (row: Row) => (row.mth1 < 0) || (row.mth3 < 0) || (row.mth6 < 0) || (row.mth12 < 0),
        style: {
          backgroundColor: 'red',
          color: 'white',
          '&:hover': {
            cursor: 'pointer',
          },
        },
      },
  ];


const columns = [
    {
      name: 'Trustee',
      selector: 'trustee',
      sortable: true,
      left: true,
      width: '50px'
    },
    {
      name: 'Fund',
      selector: 'fund',
      sortable: true,
      left: true,
      width: '300px'
    },
    // {
    //   name: '12 M',
    //   selector: 'mth12',
    //   sortable: true,
    //   center: true,
    //   compact: true,
    //   width: '70px',
    //   cell: (row: Row) => formatCell(row.mth12)
    // },
    {
      name: '6M',
      selector: 'mth6',
      sortable: true,
      center: true,
      compact: true,
      width: '60px',
      cell: (row: Row) => formatCell(row.mth6)
    },
    {
      name: '3M',
      selector: 'mth3',
      sortable: true,
      center: true,
      compact: true,
      width: '60px',
      cell: (row: Row) => formatCell(row.mth3)
    },
    {
      name: '1M',
      selector: 'mth1',
      sortable: true,
      center: true,
      compact: true,
      width: '60px',
      cell: (row: Row) => formatCell(row.mth1)
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: '40px', // override the row height
      }
    },
    headCells: {
      style: {
        paddingLeft: '5px', // override the cell padding for head cells
        paddingRight: '5px',
        fontSize: 'small'
      },
    },
    cells: {
      style: {
        paddingLeft: '5px', // override the cell padding for data cells
        paddingRight: '5px',
        fontSize: 'small'
      },
    },
  };

const paginationServerOptions = { persistSelectedOnPageChange: false, persistSelectedOnSort: false };


interface Props {
    data: Row[];
    progressPending: boolean
}

const SummaryTable: React.FC<Props> = (props) => {

    return (
        <DataTable
        columns={columns}
        data={props.data}
        responsive={true}
        paginationServerOptions={paginationServerOptions}
        customStyles={customStyles}
        noHeader={true}
        fixedHeader={true}
        defaultSortField="mth6"
        defaultSortAsc={false}
        progressPending={props.progressPending}
      />
    )
}

export default SummaryTable