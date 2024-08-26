"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getDefaultsForSchema } from "zod-defaults";

const DrinkChoiceSchema = z.object({
  temperature: z.string().optional(),
  gender: z.string().optional(),
  age: z.number().optional(),
  sensitive_to_caffeine: z.string().optional(),
  time_of_day: z.string().optional(),
  pregnant: z.string().optional(),
  health_conscious: z.string().optional(),
  number_of_drinks_per_day: z.number().optional(),
  number_of_drinks_consumed_today: z.number().optional(),
});

type DrinkChoiceType = z.infer<typeof DrinkChoiceSchema>;

export const drinkChoiceDefaultValues = getDefaultsForSchema(DrinkChoiceSchema);

const DrinkChoiceForm: React.FC<{ modelData: ModelData }> = ({ modelData }) => {
  const formMethods = useForm<DrinkChoiceType>({
    resolver: zodResolver(DrinkChoiceSchema),
    defaultValues: drinkChoiceDefaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = formMethods;

  const onSubmit = async (data: DrinkChoiceType) => {
    console.log("Form Data Submitted:", data);

    try {
      const response = await fetch(
        `https://api.up2tom.com/v3/decision/58d3bcf97c6b1644db73ad12`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${process.env.NEXT_PUBLIC_TOM_API_KEY}`,
            "Content-Type": "application/vnd.api+json",
          },
          body: JSON.stringify({
            data: { type: "scenario", attributes: { input: data } },
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to get a decision from the model.");
      }
      const decision = await response.json();
      console.log("Decision: ", decision);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {modelData.metadata.attributes.map((attribute) => (
          <div key={attribute.name}>
            <label className="block text-sm font-medium">
              {attribute.question}
            </label>
            <input
              {...register(attribute.name as keyof DrinkChoiceType)}
              type="text"
              className="block w-full mt-1 p-2 border rounded-md"
            />
            {errors[attribute.name as keyof DrinkChoiceType] && (
              <p className="text-red-600 text-sm mt-1">
                {errors[attribute.name as keyof DrinkChoiceType]?.message}
              </p>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </FormProvider>
  );
};

export default DrinkChoiceForm;
