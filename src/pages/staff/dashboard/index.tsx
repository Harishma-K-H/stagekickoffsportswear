import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = (type: 'today' | 'tomorrow') => {
   navigate(`/branch/orders?date=${type}`);
  };

  return (
    <>
      <Helmet>
        <title>KICKOFF SPORTS WEAR - Dashboard</title>
      </Helmet>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div
          className="bg-blue-100 hover:bg-blue-200 cursor-pointer rounded-2xl shadow-md p-6"
          onClick={() => handleCardClick('today')}
        >
          <h2 className="text-xl font-bold text-blue-900">Today's Deliveries</h2>
          <p className="text-gray-700">View all orders scheduled for delivery today.</p>
        </div>

        <div
          className="bg-green-100 hover:bg-green-200 cursor-pointer rounded-2xl shadow-md p-6"
          onClick={() => handleCardClick('tomorrow')}
        >
          <h2 className="text-xl font-bold text-green-900">Tomorrow's Deliveries</h2>
          <p className="text-gray-700">View all orders scheduled for delivery tomorrow.</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
