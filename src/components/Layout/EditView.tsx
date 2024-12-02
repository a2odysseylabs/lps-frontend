import React, { useState } from 'react';

type EditViewProps = {
  event: {
    name: string;
    startDate: string;
    endDate: string;
    clientId: {
      clientName: string;
      clientLogo: string;
    };
  };
  onClose: () => void; // Function to exit the edit view
};

export const EditView: React.FC<EditViewProps> = ({ event, onClose }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'branding'>('details');

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Event</h1>
        <button
          onClick={onClose}
          className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Close
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-4">
          <button
            onClick={() => setActiveTab('details')}
            className={`${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('branding')}
            className={`${
              activeTab === 'branding'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
          >
            Branding
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <div>
          <h2 className="text-lg font-bold mb-4">Details</h2>
          <div className="space-y-4">
            <input
              type="text"
              className="border rounded-md p-2 w-full shadow-sm"
              value={event.name}
              readOnly
            />
            <div className="flex space-x-4">
              <input
                type="date"
                className="border rounded-md p-2 w-full shadow-sm"
                value={new Date(event.startDate).toISOString().split('T')[0]}
                readOnly
              />
              <input
                type="date"
                className="border rounded-md p-2 w-full shadow-sm"
                value={new Date(event.endDate).toISOString().split('T')[0]}
                readOnly
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'branding' && (
        <div>
          <h2 className="text-lg font-bold mb-4">Branding</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-sm font-medium">Client Name</p>
              <p className="text-gray-900 font-semibold">{event.clientId.clientName}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 border rounded-md flex items-center justify-center">
                {event.clientId.clientLogo ? (
                  <img
                    src={event.clientId.clientLogo}
                    alt="Client Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">No Logo</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
