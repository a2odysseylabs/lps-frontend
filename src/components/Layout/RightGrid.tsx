import React from 'react';

type RightGridProps = {
  selectedCollection: {
    collection_name: string;
    collection_folder: string;
    images: { src_key: string }[];
  } | null;
};

export const RightGrid: React.FC<RightGridProps> = ({ selectedCollection }) => {
  if (!selectedCollection) {
    return (
      <div className="col-span-2">
        <h2 className="text-lg font-semibold mb-4">Image Collection</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="border-dashed border-2 border-gray-300 h-32 flex items-center justify-center text-gray-400">
            No images to display
          </div>
          <div className="border-dashed border-2 border-gray-300 h-32 flex items-center justify-center text-gray-400">
            No images to display
          </div>
          <div className="border-dashed border-2 border-gray-300 h-32 flex items-center justify-center text-gray-400">
            No images to display
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-2">
      <h2 className="text-lg font-semibold mb-4">Image Collection: {selectedCollection.collection_name}</h2>
      <div className="grid grid-cols-3 gap-4">
        {selectedCollection.images.length === 0 ? (
          <div className="border-dashed border-2 border-gray-300 h-32 flex items-center justify-center text-gray-400">
            No images to display
          </div>
        ) : (
          selectedCollection.images.map((image, index) => (
            <div key={index} className="border-2 border-gray-300 p-2">
              <img
                src={`https://lumetryphotoshare.s3.us-east-2.amazonaws.com/${image.src_key}`}
                alt={`Collection Image ${index + 1}`}
                className="w-full h-auto"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
