// Import necessary hooks and components
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ChoiceForm from "../_components/ChoiceForm";

const Page = () => {
  const { id } = useParams(); // Extract model ID from URL
  const [modelData, setModelData] = useState<ModelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch model data
  const fetchModelData = async () => {
    if (!id) {
      setError("Model ID is missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://api.up2tom.com/v3/models/${id}`, {
        headers: {
          Authorization: `Token ${process.env.NEXT_PUBLIC_TOM_API_KEY}`,
          "Content-Type": "application/vnd.api+json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch model data.");
      }

      const data = await response.json();
      setModelData(data.data.attributes);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModelData();
  }, [id]);

  if (loading)
    return (
      <p className="flex justify-center items-center h-screen">Loading...</p>
    );
  if (error) return <p>Error: {error}</p>;
  if (!modelData) return <p>No model data found.</p>;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6">Drink Choice Decision Form</h1>
      <ChoiceForm modelData={modelData} />
    </div>
  );
};

export default Page;
