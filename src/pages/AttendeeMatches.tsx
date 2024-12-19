import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

type Collection = {
  collectionName: string;
  images: string[];
};

type MatchedEvent = {
  eventName: string;
  collections: Collection[];
};

export const AttendeeMatches: React.FC = () => {
  const { attendeeId } = useParams<{ attendeeId: string }>();
  const [matchedEvents, setMatchedEvents] = useState<MatchedEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `http://localhost:8000/api/v1/attendees/${attendeeId}/matches`
        );

        setMatchedEvents(response.data.matchedEvents);
      } catch (err) {
        console.error("Failed to fetch matches:", err);
        setError("Failed to load matches. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [attendeeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (matchedEvents.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No matches found for this attendee.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {matchedEvents.map((event, eventIndex) => (
        <div key={eventIndex} className="mb-10">
          {/* Event Name */}
          <h2 className="text-2xl font-bold mb-4">{event.eventName}</h2>

          {/* Collections and Images */}
          {event.collections.map((collection, collectionIndex) => (
            <div key={collectionIndex} className="mb-6">
              {/* Collection Name */}
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {collection.collectionName}
              </h3>

              {/* Images */}
              <div className="grid grid-cols-3 gap-4">
                {collection.images.map((srcKey, imageIndex) => (
                  <img
                    key={imageIndex}
                    src={`https://lumetryphotoshare.s3.us-east-2.amazonaws.com/${srcKey}`}
                    alt={`Collection Image ${imageIndex + 1}`}
                    className="w-full h-auto object-cover rounded shadow"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
