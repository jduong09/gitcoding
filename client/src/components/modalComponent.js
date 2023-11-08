import React from 'react';

const ModalComponent = ({ handleModalClick, isDeleting }) => (
  <div className="modal fade" id="dashboardModal" tabIndex="-1" aria-labelledby="dashboardModal" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">
            {isDeleting ? 'Delete Subscription' : 'Are you sure?'}
          </h5>
        </div>
        <div className="modal-body">
          {isDeleting
            ? 'Are you sure you want to delete this subscription?'
            : 'If you leave, all unsaved changes will be discarded.'
          }
        </div>
        <div className="modal-footer">
          <button onClick={() => handleModalClick(false)} type="button" className="btn btn-primary" data-bs-dismiss="modal">
            {isDeleting ? 'Cancel' : 'Stay On Page'}
          </button>
          <button onClick={() => handleModalClick(true)} id="btn-modal-subscription-delete" type="button" className="btn btn-primary">
            {isDeleting ? 'Delete' : 'Discard Changes'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ModalComponent;