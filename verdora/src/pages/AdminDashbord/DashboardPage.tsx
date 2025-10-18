import React from "react";

const DashboardPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-center mb-4 fw-bold">Admin Dashboard</h1>
      <p className="text-center text-muted mb-5">
        Welcome to the admin dashboard — manage everything here.
      </p>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm p-3 rounded-3">
            <h5 className="text-center mb-3">Sales Overview</h5>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm p-3 rounded-3">
            <h5 className="text-center mb-3">User Growth</h5>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm p-3 rounded-3">
            <h5 className="text-center mb-3">Orders Summary</h5>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm p-3 rounded-3">
            <h5 className="text-center mb-3">Revenue Trends</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
