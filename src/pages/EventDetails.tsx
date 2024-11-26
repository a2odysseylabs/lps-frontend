import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

type Event = {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  clientId: {
    _id: string;
    clientName: string;
    clientLogo: string;
  };
};

export const EventDetails: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'branding'>('details');
  const [loading, setLoading] = useState(true); // New loading state
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true); // Start loading
        const response = await api.get(`/events/${eventId}`);
        setEvent(response.data.event);
      } catch (error) {
        console.error('Failed to fetch event:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  if (!event) {
    return <div className="text-center py-10">Event not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)} // Go back to the previous page
            className="text-gray-500 hover:text-gray-700"
          >
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
          onClick={() => setActiveTab('details')}
        >
          Edit
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
