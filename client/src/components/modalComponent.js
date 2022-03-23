import React from 'react';

const ModalComponent = ({ id, handleModalClick }) => (
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
          <button onClick={() => handleModalClick(false)} type="button" className="btn btn-primary" data-bs-dismiss="modal">
            {id === 'deleteModal' ? 'Do not Delete' : 'Stay On Page'}
          </button>
          <button onClick={() => handleModalClick(true)} type="button" className="btn btn-primary">
            {id === 'deleteModal' ? 'Delete' : 'Discard Changes'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ModalComponent;