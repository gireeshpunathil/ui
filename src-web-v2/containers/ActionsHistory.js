import React from 'react';

import {
  DataTable,
} from 'carbon-components-react';

import {
  CheckmarkOutline20,
  ErrorFilled20,
  Unknown20,
  Fade20,
} from '@carbon/icons-react';

import {
  ActionsButtons,
  SecondaryHeader,
  HealthCheckButton,
} from '../components';

import msgs from '../../nls/kappnav.properties';

const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
  TableToolbar,
  TableToolbarSearch,
  TableToolbarContent,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
} = DataTable;

const defaultHeaders = [
  {
    header: 'Status',
    key: 'status',
  },
  {
    header: 'Action Name',
    key: 'actionName',
  },
  {
    header: 'Application Name',
    key: 'applicationName',
  },
  {
    header: 'Component',
    key: 'component',
  },
  {
    header: 'Age',
    key: 'age',
  },
  {
    header: 'Action',
    key: 'action',
  },
];

const initialRows = [
  {
    id: 'a',
    status: 'Completed',
    actionName: 'job-name',
    applicationName: 'default/stocktrader',
    component: 'default/loyalty-level',
    age: '27 days ago',
  },
  {
    id: 'b',
    status: 'Unknown',
    actionName: 'job-name',
    applicationName: 'default/stocktrader',
    component: 'default/loyalty-level',
    age: '27 days ago',
  },
  {
    id: 'c',
    status: 'In Progress',
    actionName: 'job-name',
    applicationName: 'default/stocktrader',
    component: 'default/loyalty-level',
    age: '27 days ago',
  },
  {
    id: 'd',
    status: 'Failed',
    actionName: 'job-name',
    applicationName: 'default/stocktrader',
    component: 'default/loyalty-level',
    age: '27 days ago',
  },
];

const ActionsHistory = () => (
  <DataTable
    headers={defaultHeaders}
    rows={initialRows}
    render={({
      rows,
      headers,
      getHeaderProps,
      getRowProps,
      getTableProps,
      onInputChange,
    }) => (
      <>
        <SecondaryHeader title={msgs.get('actions.history')} showBreadCrumb={false} rightButton={<HealthCheckButton />} />

        <TableContainer>

          <TableToolbar>
            <TableToolbarContent>
              <TableToolbarSearch onChange={onInputChange} />
            </TableToolbarContent>
          </TableToolbar>

          <Table {...getTableProps()}>

            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>
                    {msgs.get(`table.header.${header.key}`)}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>
                        {cell.value === 'Completed' && <CheckmarkOutline20 className="kv--normal-icon job" /> }
                        {cell.value === 'Failed' && <ErrorFilled20 className="kv--problem-icon" /> }
                        {cell.value === 'Unknown' && <Unknown20 className="kv--unknown-icon" /> }
                        {cell.value === 'In Progress' && <Fade20 className="kv--inprogress-icon" /> }
                        {cell.info.header === 'action' ? <ActionsButtons disableRemoveButton /> : <span>{cell.value}</span>}
                      </TableCell>
                    ))}
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>

          </Table>
        </TableContainer>
      </>
    )}
  />
);

export default ActionsHistory;