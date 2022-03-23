import React from 'react';

const ModalComponent = ({ id }) => (
  <div className="modal fade" id={id} tabIndex="-1" aria-labelledby="dashboardModal" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">
          {(id === 'deleteModal') ? 'Delete Subscription' : 'Are you sure?'}
          </h5>
        </div>
        <div className="modal-body">
          {id === 'deleteModal'
            ? 'Are you sure you want to delete this subscription?'
            : 'If you leave, all unsaved changes will be discarded.'
          }
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" id="closeBtn" value="close" data-bs-dismiss="modal">
            {(id === 'deleteModal') ? 'Don\'t Delete' : 'Stay On Page'}
          </button>
          <button type="button" className="btn btn-primary" id="continueBtn" value="next">
            {(id === 'deleteModal') ? 'Delete Subscription': 'Discard Changes'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ModalComponent;