"use client";

import React, { useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createDecision } from "@/actions/decision.actions";

const ChoiceForm: React.FC<{ modelData: ModelData; id: string }> = ({
  modelData,
  id,
}) => {
  const [decisionResult, setDecisionResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);

  const form = useForm({
    mode: "onSubmit",
    defaultValues: modelData.metadata.attributes.reduce((acc, attribute) => {
      acc[attribute.name] = ""; // Initialize default values
      return acc;
    }, {} as Record<string, any>),
  });

  const { handleSubmit, control, setValue } = form;

  const onSubmit = async (data: Record<string, any>) => {
    // Apply the rule: If INPUTVAR2 is "Male", set INPUTVAR6 to "NA"
    if (data.INPUTVAR2 === "Male" && id === "58d3bcf97c6b1644db73ad12") {
      data.INPUTVAR6 = "NA";
    }

    // Transform the data to match the expected structure
    const transformedData = modelData.metadata.attributes.reduce(
      (acc: Record<string, number | string>, attribute) => {
        const fieldName = attribute.name;
        if (attribute.domain.type === "DomainR") {
          acc[fieldName] = parseFloat(data[fieldName]);
        } else if (attribute.domain.type === "DomainC") {
          acc[fieldName] = data[fieldName];
        }
        return acc;
      },
      {}
    );

    try {
      const response = await fetch(`https://api.up2tom.com/v3/decision/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.NEXT_PUBLIC_TOM_API_KEY}`,
          "Content-Type": "application/vnd.api+json",
        },
        body: JSON.stringify({
          data: { type: "scenario", attributes: { input: transformedData } },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get a decision from the model.");
      }

      const result = await response.json();
      const decisionData = {
        decision: result.data.attributes.decision,
        confidence: result.data.attributes.confidence,
        model: result.data.attributes.model,
        input: transformedData,
      };

      // Save the decision data
      await createDecision(decisionData, "/models"); // Adjust revalidation path as needed

      setDecisionResult(decisionData);
      setError(null); // Clear any previous errors
      setShowForm(false); // Hide the form and show the result
    } catch (error: any) {
      setError(error.message);
      setDecisionResult(null); // Clear previous results
    }
  };

  return (
    <div>
      {showForm ? (
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {modelData.metadata.attributes.map((attribute) => {
              const fieldName = attribute.name;
              const isContinuous = attribute.domain.type === "DomainR";
              const isNominal = attribute.domain.type === "DomainC";

              return (
                <FormField
                  key={fieldName}
                  control={control}
                  name={fieldName}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{attribute.question}</FormLabel>
                      <FormControl>
                        {isContinuous ? (
                          <Input
                            {...field}
                            type="number"
                            step={attribute.domain.interval || "1"}
                            min={attribute.domain.lower}
                            max={attribute.domain.upper}
                          />
                        ) : isNominal ? (
                          <Controller
                            name={fieldName}
                            control={control}
                            render={({ field }) => (
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  // Handle rule-based logic
                                  if (
                                    fieldName === "INPUTVAR2" &&
                                    value === "Male" &&
                                    id === "58d3bcf97c6b1644db73ad12"
                                  ) {
                                    setValue("INPUTVAR6", "NA");
                                  }
                                }}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent>
                                  {attribute.domain.values.map(
                                    (option: string) => (
                                      <SelectItem key={option} value={option}>
                                        {option}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        ) : (
                          <Input {...field} type="text" />
                        )}
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors[fieldName]?.message?.toString()}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              );
            })}
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
              Submit
            </button>
          </form>
        </FormProvider>
      ) : (
        <div className="decision-result">
          {decisionResult ? (
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
                Decision Result
              </h2>
              <div className="text-lg text-gray-700">
                <p className="mb-2">
                  <strong className="font-semibold text-gray-900">
                    Decision:
                  </strong>{" "}
                  {decisionResult.decision}
                </p>
                <p>
                  <strong className="font-semibold text-gray-900">
                    Confidence:
                  </strong>{" "}
                  {decisionResult.confidence}%
                </p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-5 rounded-lg transition-colors"
              >
                Back to Form
              </button>
            </div>
          ) : (
            <p>No decision result available.</p>
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default ChoiceForm;
