import React  from 'react';

const DashboardModal = () => (
  /* Modal */
  <div className="modal fade" id="myModal" tabIndex="-1" aria-labelledby="myModal" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">Navigating</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
        </div>
        <div className="modal-body">
          Are you sure you want to navigate away from your current page? 
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" className="btn btn-primary" id="continueBtn" value="next">Discard Changes</button>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardModal;