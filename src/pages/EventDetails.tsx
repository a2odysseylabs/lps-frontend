import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { api } from "../services/api";
import { EventHeader } from "../components/Layout/EventHeader";
import { LeftPanel } from "../components/Layout/LeftPanel";
import { RightGrid } from "../components/Layout/RightGrid";
import { EditView } from "../components/Layout/EditView";
import { Event, Collection } from "../types/globalTypes";

export const EventDetails: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false); // Tracks if the Edit mode is enabled
    const [selectedCollection, setSelectedCollection] =
        useState<Collection | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/events/${eventId}`);
                setEvent(response.data.event);
            } catch (error) {
                console.error("Failed to fetch event:", error);
            } finally {
                setLoading(false);
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

    if (editMode) {
        // Render the full-page edit view with details and branding
        return (
            <EditView
                event={event}
                onClose={() => setEditMode(false)} // Exit edit mode
            />
        );
    }

    const addNewCollection = async (
        collectionName: string,
        folderPath: string
    ) => {
        try {
            const response = await api.post(`/events/${eventId}/collections`, {
                collectionName,
                folderPath,
            });
            // Update the local state with the new collection
            if (response.status === 201) {
                setEvent((prevEvent) => {
                    if (!prevEvent) return null;
                    return {
                        ...prevEvent,
                        eventCollections: response.data.event.eventCollections,
                    };
                });
            }
        } catch (error) {
            console.error("Failed to add collection:", error);
        }
    };

    return (
        <>
            <div className="relative z-10">
              <img
                src="https://placehold.co/2500x500"
                alt="Event Banner Image"
                className="w-full max-h-80 object-cover"
              />
              <div className="shadow-md py-6">
                  <div className="container">
                      <EventHeader
                          event={event}
                          onEdit={() => setEditMode(true)}
                          onBack={() => navigate(-1)}
                      />
                  </div>
              </div>
            </div>
            <div className="flex">
                <LeftPanel
                    className="w-64 shadow-[6px_0_6px_-2px_rgba(0,0,0,0.1)] h-full"
                    event={event}
                    onAddCollection={addNewCollection}
                    onSelectCollection={setSelectedCollection}
                />
                <RightGrid
                    className="grow"
                    selectedCollection={selectedCollection}
                />
            </div>
        </>
    );
};
