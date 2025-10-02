import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

const CommunityDetails = () => {
    const { id } = useParams();
    const [community, setCommunity] = useState<any>(null);

    useEffect(() => {
        API.get(`/communities/${id}`).then((res) => setCommunity(res.data));
    }, [id]);

    if (!community) return <p>Loading...</p>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold">{community.name}</h2>
            <p>{community.description}</p>
            <p className="text-sm text-gray-500">Created by: {community.createdBy?.name}</p>
        </div>
    );
};

export default CommunityDetails;
