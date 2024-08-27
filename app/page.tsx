import Link from "next/link";
import React from "react";

const Page = async () => {
  const response = await fetch("https://api.up2tom.com/v3/models", {
    headers: {
      Authorization: `Token ${process.env.NEXT_PUBLIC_TOM_API_KEY}`,
      "Content-Type": "application/vnd.api+json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch models.");
  }
  const data = await response.json();

  // Extract relevant data from the response
  const models = data.data.map((model: any) => ({
    id: model.id,
    attributes: model.attributes,
  }));

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="flex justify-center text-3xl font-bold mb-3">
        All Models
      </h1>
      <p className="flex text-sm justify-center mb-3">Click To Select Model</p>
      <ul className="space-y-4">
        {models.map((model: any) => (
          <Link href={`/models/${model.id}`} key={model.id}>
            <li
              key={model.id}
              className="border p-4 rounded cursor-pointer mb-4"
            >
              <h2 className="text-xl font-semibold text-center">
                {model.attributes.name}
              </h2>
              <p className="text-center">{model.attributes.description}</p>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Page;
