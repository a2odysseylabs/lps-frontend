import React from "react";

import { Event } from "../types/globalTypes";
import BaseButton from "./BaseButton";
import classNames from "classnames";

interface EventCardProps extends React.HTMLAttributes<HTMLDivElement> {
    event: Event;
    totalImages: number;
}

const EventCard: React.FC<EventCardProps> = ({ 
    className, 
    totalImages, 
    event, 
    ...props 
}) => {
    return (
        <div
            className="rounded-lg raised-small overflow-hidden"
            {...props}
        >
            <BaseButton 
                as="link" 
                className={classNames(className, "")} 
                to={`/dashboard/${event._id}`}
            >
                <img
                    className="w-full h-48 object-cover"
                    src={event.clientId.clientLogo}
                    alt={event.clientId.clientName}
                />
                <div className="p-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-500 ">
                        <p>{event.clientId.clientName}</p>
                        <p>{new Date(event.startDate).toLocaleDateString()}</p>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">
                        {event.name}
                    </h2>
                    <div className="text-sm text-gray-500">
                        {totalImages > 0
                            ? `${totalImages} image${
                                  totalImages === 1 ? "" : "s"
                              } | ${event.eventCollections.length} folder${
                                  event.eventCollections.length === 1 ? "" : "s"
                              }`
                            : "No images available"}
                    </div>
                </div>
            </BaseButton>
        </div>
    );
};

export default EventCard;
