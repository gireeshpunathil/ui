import React from 'react';

import {
  Tabs,
  Tab,
} from 'carbon-components-react';

import {
  ApplicationResourceTable,
  ActionHistoryResourceTable,
} from '../components';

import msgs from '../../nls/kappnav.properties';

require('./LandingPage.scss');

// This is used to avoid rendering tab content unless the tab is selected
const TabContentRenderedOnlyWhenSelected = ({
  selected,
  children,
  className,
  ...other
}) => (!selected ? (
  <div {...other} className="bx--visually-hidden" />
) : (
  <div
    {...other}
    className="bx--tab-content"
    selected={selected}
  >
    {children}
  </div>
));

const LandingPage = () => (
  <>
    <Tabs className="kv--tabs">
      {/* FIXME: These tabs need to be dymanic based on Redux or something */}
      <Tab label={msgs.get('page.applicationView.title')} renderContent={TabContentRenderedOnlyWhenSelected}>
        <ApplicationResourceTable />
      </Tab>
      <Tab label={msgs.get('actions.history')} renderContent={TabContentRenderedOnlyWhenSelected}>
        <ActionHistoryResourceTable />
      </Tab>
    </Tabs>
  </>
);

export default LandingPage;
