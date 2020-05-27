import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Loading,
} from 'carbon-components-react';
import _ from 'lodash';
import ResourceTable from './ResourceTable';
import { useInterval } from '../../hooks';
import fetchCommands from '../../redux/fetchCommands';

import msgs from '../../../nls/kappnav.properties';

const ActionHistoryResourceTable = () => {
  const dispatch = useDispatch(); // Hook gets redux dispatch method

  // useSelector: Hook gets redux store state
  const loading = useSelector((state) => state.commands.pending);
  const commands = useSelector((state) => state.commands.data);
  const error = useSelector((state) => state.commands.error);

  useInterval(() => {
    dispatch(fetchCommands());
  }, 3000);

  if (loading && _.isEmpty(commands)) {
    // Only show loading when there is no applications and
    // the API is fetching data
    return <Loading withOverlay />;
  }

  return (
    <ResourceTable
      listOfResources={commands}
      buttonText={msgs.get('run.health.check')}
    />
  );
};

export default ActionHistoryResourceTable;
