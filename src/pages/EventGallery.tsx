import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

type Collection = {
  collectionName: string;
  srcKeys: string[];
};

type EventDetails = {
  eventName: string;
  clientName: string;
  collections: Collection[][];
};

export const EventGallery: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [filteredImages, setFilteredImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/v1/events/${eventId}/details`);
        console.log("API Response:", response.data);

        const collections = response.data.collections;

        if (collections?.length > 0) {
          setEventDetails(response.data);

          // Default to the first collection
          const firstCollection = collections[0][0]; // Accessing the first item of the first inner array
          if (firstCollection) {
            setSelectedCollection(firstCollection);
            setFilteredImages(firstCollection.srcKeys || []);
          }
        } else {
          console.warn("No collections found in the event data.");
          setEventDetails(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleCollectionChange = (collection: Collection) => {
    setSelectedCollection(collection);
    setFilteredImages(collection.srcKeys || []);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!eventDetails) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Event not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Event Name and Client Name */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold">{eventDetails.eventName}</h1>
        <p className="text-gray-500">{eventDetails.clientName}</p>
      </header>

      {/* Collection Selector */}
      <div className="flex space-x-4 mb-8">
        {eventDetails.collections.map((collectionGroup, groupIndex) =>
          collectionGroup.map((collection, index) => (
            <button
              key={`${groupIndex}-${index}`}
              className={`px-4 py-2 rounded ${
                selectedCollection?.collectionName === collection.collectionName
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => handleCollectionChange(collection)}
            >
              {collection.collectionName}
            </button>
          ))
        )}
      </div>

      {/* Image Grid */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {filteredImages.map((srcKey, index) => (
            <div key={index} className="relative">
              <img
                src={`https://lumetryphotoshare.s3.us-east-2.amazonaws.com/${srcKey}`}
                alt="Event"
                className="w-full h-48 object-cover rounded shadow"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center mt-8">No images available for this collection.</div>
      )}
    </div>
  );
};
