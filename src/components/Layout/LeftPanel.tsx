import React, { useState } from 'react';

type Collection = {
  collection_name: string;
  collection_folder: string;
  images: { src_key: string }[];
};

type LeftPanelProps = {
  event: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
    eventCollections: Collection[][];
    clientId: {
      _id: string;
      clientName: string;
      clientLogo: string;
    };
  };
  onAddCollection: (collectionName: string, folderPath: string) => Promise<void>;
  onSelectCollection: (selectedCollection: Collection) => void;
};

export const LeftPanel: React.FC<LeftPanelProps> = ({ event, onAddCollection, onSelectCollection }) => {
  const [showModal, setShowModal] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [folderPath, setFolderPath] = useState('');
  const [folderPathError, setFolderPathError] = useState('');

  // Folder path validation
  const validateFolderPath = (path: string) => /^[a-z0-9\-]+$/.test(path); // Only lowercase letters, numbers, and dashes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateFolderPath(folderPath)) {
      await onAddCollection(collectionName, folderPath); // Call the API to add a new collection
      setShowModal(false); // Close the modal
      setCollectionName(''); // Reset form
      setFolderPath('');
    } else {
      setFolderPathError('Folder path must contain only lowercase letters, numbers, and dashes.');
    }
  };

  return (
    <div className="col-span-1 border-r border-gray-200 pr-6">
      {/* Client Logo Section */}
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 border rounded-md overflow-hidden flex items-center justify-center">
          {event.clientId.clientLogo ? (
            <img
              src={event.clientId.clientLogo}
              alt={`${event.clientId.clientName} Logo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400">No Logo</span>
          )}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-bold">{event.clientId.clientName}</h3>
        </div>
      </div>

      {/* Options Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Options</h2>
        <button className="block w-full bg-gray-200 text-gray-700 rounded-md py-2 px-4 mb-4">
          QR Code
        </button>
        <button className="block w-full bg-gray-200 text-gray-700 rounded-md py-2 px-4">
          Attendee Data
        </button>
      </div>

      {/* Collection Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center">
          <h3 className="text-md font-semibold">Collection</h3>
          <button
            className="flex items-center text-gray-500 hover:text-gray-700"
            onClick={() => setShowModal(true)}
          >
            <span className="mr-2 text-lg font-bold">+</span> Add new
          </button>
        </div>
        <ul className="mt-4 space-y-2">
          {event.eventCollections.map((innerArray, innerIndex) => (
            <li key={innerIndex}>
              <ul className="ml-4 list-disc space-y-1">
                {innerArray.map((col, colIndex) => (
                  <li key={colIndex} className="text-gray-700">
                    <button
                      onClick={() => onSelectCollection(col)}
                      className="text-blue-600 hover:underline"
                    >
                      {col.collection_name}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal for Add New Collection */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Add New Collection</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="collectionName" className="block text-sm font-medium text-gray-700">
                  Collection Name
                </label>
                <input
                  type="text"
                  id="collectionName"
                  className="border border-gray-300 rounded-md p-2 w-full mt-1"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="folderPath" className="block text-sm font-medium text-gray-700">
                  Folder Path (Lowercase, no special characters)
                </label>
                <input
                  type="text"
                  id="folderPath"
                  className="border border-gray-300 rounded-md p-2 w-full mt-1"
                  value={folderPath}
                  onChange={(e) => {
                    setFolderPath(e.target.value);
                    setFolderPathError('');
                  }}
                  required
                />
                {folderPathError && <p className="text-red-500 text-sm mt-1">{folderPathError}</p>}
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  Add Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
