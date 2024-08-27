"use client";

import { FormProvider, useForm, Controller } from "react-hook-form";
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

const DrinkChoiceForm: React.FC<{ modelData: ModelData }> = ({ modelData }) => {
  const form = useForm({
    mode: "onSubmit",
    defaultValues: modelData.metadata.attributes.reduce((acc, attribute) => {
      acc[attribute.name] = ""; // Initialize default values
      return acc;
    }, {} as Record<string, any>),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    getValues,
    setValue,
  } = form;

  const onSubmit = async (data: Record<string, any>) => {
    // Apply the rule: If INPUTVAR2 is "Male", set INPUTVAR6 to "NA"
    if (data.INPUTVAR2 === "Male") {
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
      const response = await fetch(
        `https://api.up2tom.com/v3/decision/58d3bcf97c6b1644db73ad12`,
        {
          method: "POST",
          headers: {
            Authorization: `Token ${process.env.NEXT_PUBLIC_TOM_API_KEY}`,
            "Content-Type": "application/vnd.api+json",
          },
          body: JSON.stringify({
            data: { type: "scenario", attributes: { input: transformedData } },
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to get a decision from the model.");
      }
      const decision = await response.json();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
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
                                value === "Male"
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
                              {attribute.domain.values.map((option: string) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    ) : (
                      <Input {...field} type="text" />
                    )}
                  </FormControl>
                  <FormMessage>
                    {errors[fieldName]?.message?.toString()}
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
  );
};

export default DrinkChoiceForm;
