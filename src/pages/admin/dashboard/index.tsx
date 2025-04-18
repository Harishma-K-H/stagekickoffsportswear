import React from 'react';
import { Helmet } from 'react-helmet';

const Dashboard: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>KICKOFF SPORTS WEAR - Dashboard </title>
      </Helmet>
      <div className="flex flex-col gap-4">Admin Dashboard</div>
    </>
  );
};

export default Dashboard;
