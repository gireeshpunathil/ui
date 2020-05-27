import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import {
  Loading,
} from 'carbon-components-react';
import ResourceTable from './ResourceTable';
import { useInterval } from '../../hooks';
import fetchApplications from '../../redux/fetchApplications';

import msgs from '../../../nls/kappnav.properties';

const ApplicationResourceTable = () => {
  const dispatch = useDispatch(); // Hook gets redux dispatch method

  // useSelector: Hook gets redux store state
  const loading = useSelector((state) => state.applications.pending);
  const applications = useSelector((state) => state.applications.data);
  const error = useSelector((state) => state.applications.error);

  useInterval(() => {
    dispatch(fetchApplications());
  }, 3000);

  if (loading && _.isEmpty(applications)) {
    // Only show loading when there is no applications and
    // the API is fetching data
    return <Loading withOverlay />;
  }

  return (
    <ResourceTable
      listOfResources={applications}
      buttonText={msgs.get('button.application.create')}
    />
  );
};

export default ApplicationResourceTable;
