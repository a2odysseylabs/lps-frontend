import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { api } from "../services/api";
import { Link } from 'react-router-dom';

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

type Client = {
  _id: string;
  clientName: string;
};

export const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [events, setEvents] = useState<Event[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({
    name: "",
    startDate: "",
    endDate: "",
    clientId: "",
  });
  const [newClient, setNewClient] = useState({
    name: "",
    logo: null as File | null,
  });
  const [isCreatingClient, setIsCreatingClient] = useState(false);

  // Fetch events and clients
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const [eventsResponse, clientsResponse] = await Promise.all([
          api.get("/events"),
          api.get("/clients"),
        ]);

        setEvents(eventsResponse.data.events);
        setClients(clientsResponse.data.clients);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  // Filter events based on search query
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle create event
  const handleCreateEvent = async () => {
    if (
      !newEvent.name.trim() ||
      !newEvent.startDate.trim() ||
      !newEvent.endDate.trim() ||
      !newEvent.clientId.trim()
    ) {
      alert("All fields are required. Please fill them out.");
      return;
    }

    try {
      await api.post("/events", newEvent);
      setIsModalOpen(false); // Close the modal on success
      setNewEvent({ name: "", startDate: "", endDate: "", clientId: "" }); // Reset the form
      const response = await api.get("/events"); // Refresh events list
      setEvents(response.data.events);
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event. Please try again.");
    }
  };

  // Handle create client
  const handleCreateClient = async () => {
    if (!newClient.name.trim() || !newClient.logo) {
      alert("Both client name and logo are required.");
      return;
    }

    setIsCreatingClient(true);

    try {
      // Upload logo to AWS S3
      const formData = new FormData();
      formData.append("image", newClient.logo!);

      const uploadResponse = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const logoUrl = uploadResponse.data.url;

      // Create client
      await api.post("/clients", {
        clientName: newClient.name,
        clientLogo: logoUrl,
      });

      alert("Client created successfully.");
      setIsClientModalOpen(false);
      setNewClient({ name: "", logo: null });

      // Refresh clients list
      const response = await api.get("/clients");
      setClients(response.data.clients);
    } catch (error) {
      console.error("Error creating client:", error);
      alert("Failed to create client. Please try again.");
    } finally {
      setIsCreatingClient(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Welcome back, {user?.username}!
          </h1>

          {/* Search and Create Event */}
          <div className="flex items-center justify-between mb-6">
            <input
              type="text"
              placeholder="Search"
              className="border rounded-md p-2 w-1/3 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md"
              onClick={() => setIsModalOpen(true)}
            >
              Create Event
            </button>
          </div>

          {/* Event Cards */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <div
              key={event._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Link to={`/dashboard/${event._id}`}>
                <img
                  className="w-full h-48 object-cover"
                  src={event.clientId.clientLogo}
                  alt={event.clientId.clientName}
                />
                <div className="p-4">
                  <div className="text-sm text-gray-500">
                    {event.clientId.clientName} •{' '}
                    {new Date(event.startDate).toLocaleDateString()}
                  </div>
                  <h2 className="mt-2 text-lg font-bold text-gray-900">
                    {event.name}
                  </h2>
                </div>
              </Link>
            </div>
            ))}
          </div>
        </div>
      </main>

      {/* New Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Event</h2>
              <button onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="border rounded-md p-2 w-full shadow-sm"
                value={newEvent.name}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, name: e.target.value })
                }
              />
              <div className="flex space-x-4">
                <input
                  type="date"
                  className="border rounded-md p-2 w-full shadow-sm"
                  value={newEvent.startDate}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, startDate: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="border rounded-md p-2 w-full shadow-sm"
                  value={newEvent.endDate}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, endDate: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center space-x-4">
                <select
                  className="border rounded-md p-2 w-full shadow-sm"
                  value={newEvent.clientId}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, clientId: e.target.value })
                  }
                >
                  <option value="">Select Client</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.clientName}
                    </option>
                  ))}
                </select>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    setIsModalOpen(false); // Close Event Modal
                    setIsClientModalOpen(true); // Open Client Modal
                  }}
                >
                  New Client
                </button>
              </div>
              <button
                onClick={handleCreateEvent}
                className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Client Modal */}
      {isClientModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Client</h2>
              <button onClick={() => setIsClientModalOpen(false)}>&times;</button>
            </div>
            <div className="space-y-4">
              {/* Client Name */}
              <input
                type="text"
                placeholder="Name"
                className="border rounded-md p-2 w-full shadow-sm"
                value={newClient.name}
                onChange={(e) =>
                  setNewClient({ ...newClient, name: e.target.value })
                }
              />

              {/* Logo Upload */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 border rounded-md flex items-center justify-center">
                  {newClient.logo ? (
                    <img
                      src={URL.createObjectURL(newClient.logo)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">No Logo</span>
                  )}
                </div>
                <label
                  htmlFor="logoUpload"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
                >
                  Select Logo
                </label>
                <input
                  id="logoUpload"
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewClient({ ...newClient, logo: e.target.files[0] });
                    }
                  }}
                />
              </div>

              {/* Create Client Button */}
              <button
                onClick={handleCreateClient}
                className={`bg-blue-500 text-white px-4 py-2 rounded-md w-full ${
                  isCreatingClient ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isCreatingClient}
              >
                {isCreatingClient ? "Creating Client..." : "Create Client"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
