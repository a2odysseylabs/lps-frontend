import classNames from "classnames";
import React from "react";
import Icon from "../Icon";

interface RightGridProps extends React.HTMLAttributes<HTMLDivElement> {
    selectedCollection: {
        collection_name: string;
        collection_folder: string;
        images: { src_key: string }[];
    } | null;
}

export const RightGrid: React.FC<RightGridProps> = ({
    selectedCollection,
    className,
}) => {
    return (
        <div className={classNames(className, "photo-grid")}>
            <div className="shadow-md flex items-center justify-between">
                <h2 className="text-lg font-semibold pl-8">
                    {selectedCollection?.collection_name}
                </h2>
                <div className="flex flex-row">
                    <div className="border-solid border-r-[1px] border-white p-4">
                        <p className="text-sm text-gray-500">Photos uploaded</p>
                        <p className="font-bold">
                            {selectedCollection?.images.length || 0}
                        </p>
                    </div>
                    <div className="border-solid border-r-[1px] border-white p-4">
                        <p className="text-sm text-gray-500">People spotted</p>
                        <p className="font-bold">N/A</p>
                    </div>
                    <div className="border-solid border-r-[1px] border-white p-4">
                        <p className="text-sm text-gray-500">
                            Avg photos per person
                        </p>
                        <p className="font-bold">N/A</p>
                    </div>
                </div>
            </div>
            <div className="p-8">
                {!selectedCollection ? (
                    <div className="raised-small h-32 flex items-center justify-center rounded-lg">
                        No images to display
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-3 gap-4">
                            {selectedCollection.images.length === 0 ? (
                                <div className="border-dashed border-2 border-gray-300 h-32 flex items-center justify-center text-gray-400">
                                    No images to display
                                </div>
                            ) : (
                                selectedCollection.images.map(
                                    (image, index) => (
                                        <div
                                            key={index}
                                            className="text-xs"
                                        >
                                            <img
                                                src={`https://lumetryphotoshare.s3.us-east-2.amazonaws.com/${image.src_key}`}
                                                alt={`Collection Image ${
                                                    index + 1
                                                }`}
                                                className="w-full h-auto"
                                            />
                                            <div>{image.src_key.split('/').pop()}</div>
                                            <div>
                                                <Icon name="Star" />
                                                <Icon name="Trash" />
                                            </div>
                                        </div>
                                    )
                                )
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
