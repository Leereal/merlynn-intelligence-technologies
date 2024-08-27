import DrinkChoiceForm from "./_components/DrinkChoiceForm";

const Page = async () => {
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
    throw new Error("Failed to fetch model data.");
  }
  const data = await response.json();
  const modelData = data.data.attributes;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6">Drink Choice Decision Form</h1>
      <DrinkChoiceForm modelData={modelData} />
    </div>
  );
};

export default Page;
