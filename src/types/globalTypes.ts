export type Collection = {
    collection_name: string;
    collection_folder: string;
    images: { src_key: string }[];
};

export type Event = {
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

export type Client = {
    _id: string;
    clientName: string;
};
