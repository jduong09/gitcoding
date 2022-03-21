import React  from 'react';

const DashboardModal = ({ handleDashboardChange }) => (
  <div className="modal fade" id="myModal" tabIndex="-1" aria-labelledby="myModal" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">Are you sure?</h5>
        </div>
        <div className="modal-body">
          If you leave, all unsaved changes will be discarded.
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" id="closeBtn" value="close" data-bs-dismiss="modal">Stay On Page</button>
          <button type="button" className="btn btn-primary" id="continueBtn" onClick={() => handleDashboardChange('next')}>Discard Changes</button>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardModal;