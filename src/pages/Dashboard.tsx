import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import type { RootState } from "../store";
import { api } from "../services/api";
import { Event, Client } from "../types/globalTypes";
import EventCard from "../components/EventCard";
import StyledButton from "../components/StyledButton";
import TextInput from "../components/TextInput";
import Modal from "../components/Modal";
import SelectInput from "../components/SelectInput";
import classNames from "classnames";

export const Dashboard: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [events, setEvents] = useState<Event[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNewEventModalOpen, setNewEventModalOpen] = useState(false);
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
            setNewEventModalOpen(true);
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
        <div className="">
            <div className="shadow-md py-6">
                <div className="container space-y-4">
                    <h1 className="text-3xl font-bold leading-none">Events</h1>

                    <div className="flex items-center justify-between">
                        <TextInput
                            type="text"
                            label="Search"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <StyledButton
                            as="button"
                            onClick={() => setNewEventModalOpen(true)}
                        >
                            Create Event
                        </StyledButton>
                    </div>
                </div>
            </div>

            {/* Event Cards */}
            <div className="container py-8">
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredEvents.map((event) => {
                        const totalImages = event.eventCollections
                            .flat()
                            .reduce(
                                (count, collection) =>
                                    count + collection.images.length,
                                0
                            );

                        return (
                            <EventCard
                                key={event._id}
                                event={event}
                                totalImages={totalImages}
                            />
                        );
                    })}
                </div>
            </div>

            {/* New Event Modal */}
            <Modal
                isOpen={isNewEventModalOpen}
                onClose={() => setNewEventModalOpen(false)}
            >
                <div className="">
                    <h2 className="text-xl font-bold">Create New Event</h2>
                    <div className="space-y-4">
                        <TextInput
                            type="text"
                            label="Name"
                            placeholder="Name"
                            value={newEvent.name}
                            onChange={(e) =>
                                setNewEvent({
                                    ...newEvent,
                                    name: e.target.value,
                                })
                            }
                        />
                        <div className="flex space-x-4">
                            <TextInput
                                className="w-1/2"
                                type="date"
                                label="Start Date"
                                value={newEvent.startDate}
                                onChange={(e) =>
                                    setNewEvent({
                                        ...newEvent,
                                        startDate: e.target.value,
                                    })
                                }
                            />
                            <TextInput
                                className="w-1/2"
                                type="date"
                                label="End Date"
                                value={newEvent.endDate}
                                onChange={(e) =>
                                    setNewEvent({
                                        ...newEvent,
                                        endDate: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="flex items-center space-x-4 w-full">
                            <SelectInput
                              className="grow"
                                value={newEvent.clientId}
                                options={clients.map((client) => ({
                                    label: client.clientName,
                                    value: client._id,
                                }))}
                                onChange={(e) =>
                                    setNewEvent({
                                        ...newEvent,
                                        clientId: e.target.value,
                                    })
                                }
                                placeholder="Select Client"
                                required
                            />
                            <StyledButton
                                as="button"
                                onClick={() => {
                                    setNewEventModalOpen(false); // Close Event Modal
                                    setIsClientModalOpen(true); // Open Client Modal
                                }}
                            >
                                New Client
                            </StyledButton>
                        </div>
                        <StyledButton
                            as="button"
                            onClick={handleCreateEvent}
                            className="w-full"
                        >
                            Create Event
                        </StyledButton>
                    </div>
                </div>
            </Modal>

            {/* New Client Modal */}
            <Modal
                isOpen={isClientModalOpen}
                onClose={() => setIsClientModalOpen(false)}
            >
                <h2 className="text-xl font-bold">Create New Client</h2>
                <div className="space-y-8">
                    {/* Client Name */}
                    <TextInput
                        type="text"
                        label="Client Name"
                        placeholder="Name"
                        value={newClient.name}
                        onChange={(e) =>
                            setNewClient({
                                ...newClient,
                                name: e.target.value,
                            })
                        }
                    />

                    {/* Logo Upload */}
                    <div className="flex flex-col items-center space-y-4 bg-gray-300 rounded-lg p-6">
                          {newClient.logo ? (
                              <img
                                  src={URL.createObjectURL(newClient.logo)}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                              />
                          ) : (
                              <span>No Logo</span>
                          )}
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
                                    setNewClient({
                                        ...newClient,
                                        logo: e.target.files[0],
                                    });
                                }
                            }}
                        />
                    </div>

                    {/* Create Client Button */}
                    <StyledButton
                        as="button"
                        onClick={handleCreateClient}
                        className={classNames(
                          "w-full",
                          isCreatingClient
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        )}
                        disabled={isCreatingClient}
                    >
                        {isCreatingClient
                            ? "Creating Client..."
                            : "Create Client"}
                    </StyledButton>
                </div>
            </Modal>
        </div>
    );
};
