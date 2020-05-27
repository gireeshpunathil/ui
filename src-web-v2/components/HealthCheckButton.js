import React from 'react';

import {
  ModalWrapper,
} from 'carbon-components-react';

import {
  HealthCross20,
} from '@carbon/icons-react';

import msgs from '../../nls/kappnav.properties';

require('./HealthCheckButton.scss');

// const buttonProps = {
//   kind: 'tertiary',
//   iconDescription: msgs.get('run.health.check'),
//   className: 'kv--btn',
// };

const submitHealthCheck = () => {
  // TODO: Fire off a notification!
  console.log("Health check submitted!");
  // TODO: Add REST API call!
  return true; // This is needed for the ModalWrapper's shouldCloseAfterSubmit to work
};

const modalWrapperProps = {
  buttonTriggerText: msgs.get('run.health.check'),
  renderTriggerButtonIcon: HealthCross20,
  primaryButtonText: 'Run', // i18n needed
  handleSubmit: submitHealthCheck,
  shouldCloseAfterSubmit: true,
  modalHeading: 'Health Check', // i18n needed
};

const HealthCheckButton = () => (
  <ModalWrapper {...modalWrapperProps}>
    <p className="bx--modal-content__text">
      The health check action will take inventory of all the assets managed my kAppNav.  A report 
      file will be generated containing the inventory report.
    </p>
  </ModalWrapper>
);

export default HealthCheckButton;
