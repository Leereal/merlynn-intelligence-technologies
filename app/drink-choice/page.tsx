"use client";
import React, { useState, useEffect } from "react";

// Define types for the API response
interface Attribute {
  name: string;
  question: string;
  domain: any; // Replace `any` with a more specific type if possible
}

interface ModelData {
  name: string;
  metadata: {
    attributes: Attribute[];
  };
}

const DrinkChoice: React.FC = () => {
  const [modelData, setModelData] = useState<ModelData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.up2tom.com/v3/models/58d3bcf97c6b1644db73ad12",
          {
            headers: {
              Authorization: `Token ${process.env.NEXT_PUBLIC_TOM_API_KEY}`,
              "Content-Type": "application/vnd.api+json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: { data: { attributes: ModelData } } = await response.json();
        setModelData(data.data.attributes);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Drink Choice Metadata</h1>
      {modelData && (
        <div>
          <p>Model Name: {modelData.name}</p>
          <p>Input Variables:</p>
          <ul>
            {modelData.metadata.attributes.map((attribute, index) => (
              <li key={index}>{attribute.question}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DrinkChoice;
