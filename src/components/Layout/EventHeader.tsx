import React from 'react';

type EventHeaderProps = {
  event: {
    name: string;
    startDate: string;
    endDate: string;
    clientId: { clientName: string };
  };
  onEdit: () => void;
  onBack: () => void;
};

export const EventHeader: React.FC<EventHeaderProps> = ({ event, onEdit, onBack }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2">
        {/* Back Button */}
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
          &larr; Back
        </button>
        <div>
          <p className="text-sm text-gray-500">{event.clientId.clientName}</p>
          <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
          <p className="text-sm text-gray-500">
            {new Date(event.startDate).toLocaleDateString()} -{' '}
            {new Date(event.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md"
        onClick={onEdit}
      >
        Edit
      </button>
    </div>
  );
};
