import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  DataTable,
  ModalWrapper,
  Button,
} from 'carbon-components-react';

import {
  HealthCross20,
  Add20,
  CheckmarkOutline20,
  WarningAltInvertedFilled20,
  WarningSquareFilled20,
} from '@carbon/icons-react';

import {
  SecondaryHeader,
  ActionsButtons,
} from '..';

import msgs from '../../../nls/kappnav.properties';

require('./ResourceTable.scss');

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
    header: 'Name',
    key: 'name',
  },
  {
    header: 'Namespace',
    key: 'namespace',
  },
  {
    header: 'Action',
    key: 'action',
  },
];

const ResourceTable = (props) => {
  const { listOfResources, buttonText } = props;

  return (
    <DataTable
      headers={defaultHeaders}
      rows={listOfResources}
      render={({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getTableProps,
        onInputChange,
      }) => (
        <>
          {/* TODO: Move SecondaryHeader to somewhere else */}
          {/* <SecondaryHeader title={msgs.get('tabs.applications')} showBreadCrumb={false} /> */}

          <TableContainer>
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch placeHolderText="Search by name, namespace or component" onChange={onInputChange} />
                <Button
                  onClick={() => console.log('Clicking')}
                  size="small"
                  kind="primary"
                  renderIcon={Add20}
                  iconDescription={buttonText}
                >
                  {buttonText}
                </Button>
              </TableToolbarContent>
            </TableToolbar>

            <Table {...getTableProps()}>

              <TableHead>
                <TableRow>
                  <TableExpandHeader />
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header, isSortable: header.key !== 'action' })}>
                      {msgs.get(`table.header.${header.key}`)}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableExpandRow {...getRowProps({ row })}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>
                          {cell.value === 'Normal' && <CheckmarkOutline20 className="kv--normal-icon" /> }
                          {cell.value === 'Warning' && <WarningAltInvertedFilled20 className="kv--warning-icon" /> }
                          {cell.value === 'Problem' && <WarningSquareFilled20 className="kv--problem-icon" /> }
                          {cell.info.header === 'action' && <ActionsButtons /> }
                          {cell.info.header === 'name' ? <Link to={`applications/${cell.value}`}>{cell.value}</Link> : cell.value}
                        </TableCell>
                      ))}
                    </TableExpandRow>
                  </React.Fragment>
                ))}
              </TableBody>

            </Table>
          </TableContainer>
        </>
      )}
    />
  );
};

ResourceTable.propTypes = {
  listOfResources: PropTypes.arrayOf(PropTypes.object).isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default ResourceTable;
