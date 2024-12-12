import React, { useState } from "react";

import { Event, Collection } from "../../types/globalTypes";
import classNames from "classnames";
import BaseButton from "../BaseButton";
import StyledButton from "../StyledButton";
import Modal from "../Modal";
import TextInput from "../TextInput";

interface LeftPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    event: Event;
    onAddCollection: (
        collectionName: string,
        folderPath: string
    ) => Promise<void>;
    onSelectCollection: (selectedCollection: Collection) => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
    event,
    onAddCollection,
    onSelectCollection,
    className,
}) => {
    const [showModal, setShowModal] = useState(false);
    const [collectionName, setCollectionName] = useState("");
    const [folderPath, setFolderPath] = useState("");
    const [folderPathError, setFolderPathError] = useState("");

    // Folder path validation
    const validateFolderPath = (path: string) => /^[a-z0-9\-]+$/.test(path); // Only lowercase letters, numbers, and dashes

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateFolderPath(folderPath)) {
            await onAddCollection(collectionName, folderPath); // Call the API to add a new collection
            setShowModal(false); // Close the modal
            setCollectionName(""); // Reset form
            setFolderPath("");
        } else {
            setFolderPathError(
                "Folder path must contain only lowercase letters, numbers, and dashes."
            );
        }
    };

    return (
        <div className={classNames(className, "left-panel")}>
            {/* Client Logo Section */}
            <div className="w-64 h-64 overflow-hidden flex items-center justify-center bg-gray-300">
                {event.clientId.clientLogo && (
                    <img
                        src={event.clientId.clientLogo}
                        alt="Client Logo"
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            <div className="space-y-4 pb-16">
                {/* Options Section */}
                <div>
                    <BaseButton
                        as="button"
                        className="menu-item"
                        onClick={() => console.log("hi")}
                    >
                        QR Code
                    </BaseButton>
                    <BaseButton
                        as="button"
                        className="menu-item"
                        onClick={() => console.log("hi")}
                    >
                        Attendee Data
                    </BaseButton>
                </div>

                {/* Collection Section */}
                <div>
                    <div className="menu-item flex justify-between items-center">
                        <h3 className="text-md font-bold">Collections</h3>
                        <BaseButton
                            as="button"
                            className="flex items-center text-sm"
                            onClick={() => setShowModal(true)}
                        >
                            <span className="mr-2 font-bold">+</span> Add new
                        </BaseButton>
                    </div>

                    <ul>
                        {event.eventCollections.map(
                            (innerArray, innerIndex) => (
                                <li key={innerIndex}>
                                    <ul className="ml-4 list-none space-y-1">
                                        {innerArray.map((col, colIndex) => (
                                            <li key={colIndex}>
                                                <BaseButton
                                                    as="button"
                                                    className="menu-item menu-item--light"
                                                    onClick={() =>
                                                        onSelectCollection(col)
                                                    }
                                                >
                                                    {col.collection_name} <span className="text-xs text-gray-500">(1,234)</span>
                                                </BaseButton>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            )
                        )}
                    </ul>
                </div>

                {/* Stats Section */}
                <div className="">
                    <div className="menu-item">
                        <h3 className="text-md font-bold">Stats</h3>
                    </div>
                    <div className="ml-4">
                        <div className="menu-item menu-item--light">
                            <p className="text-sm text-gray-500">
                                Photos uploaded
                            </p>
                            <p className="font-bold">2,123</p>
                        </div>
                        <div className="menu-item menu-item--light">
                            <p className="text-xs text-gray-500">
                                People spotted
                            </p>
                            <p className="font-bold">456</p>
                        </div>
                        <div className="menu-item menu-item--light">
                            <p className="text-xs text-gray-500">
                                Avg photos per person
                            </p>
                            <p className="font-bold">4</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Add New Collection */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h2 className="text-xl font-semibold mb-4">
                    Add New Collection
                </h2>
                <form onSubmit={handleSubmit}>
                    <TextInput
                        id="collectionName"
                        label="Collection Name"
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                        required
                        placeholder="Collection Name e.g. Wedding Photos"
                        type="text"
                        className="mb-4"
                    />
                    <TextInput
                        id="folderPath"
                        label="Folder Path (Lowercase, no special characters)"
                        placeholder="Folder Path (Lowercase, no special characters e.g. weddingphotos)"
                        value={folderPath}
                        onChange={(e) => {
                            setFolderPath(e.target.value);
                            setFolderPathError("");
                        }}
                        required
                        type="text"
                        className="mb-4"
                    />
                    {folderPathError && (
                        <p className="text-red-500 text-sm mb-4">
                            {folderPathError}
                        </p>
                    )}
                    <div className="flex justify-end space-x-4">
                        <StyledButton
                            as="button"
                            variant="link"
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </StyledButton>
                        <StyledButton as="button" type="submit">
                            Add Collection
                        </StyledButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
