"use server";

import { connect } from "@/lib/db";
import Decision from "@/models/decision.model";
import { revalidatePath } from "next/cache";

// Create a new decision
export async function createDecision(
  decisionData: any,
  revalidationPath: string
) {
  try {
    await connect();
    const newDecision = await Decision.create(decisionData);
    // Revalidate the cache for the specified path
    if (revalidationPath) {
      await revalidatePath(revalidationPath); // Implement cache revalidation logic
    }
    return JSON.parse(JSON.stringify(newDecision));
  } catch (error) {
    console.log("Error creating decision: ", error);
    throw error;
  }
}

export async function uploadBatchFile(modelId: string, file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`https://api.up2tom.com/v3/batch/${modelId}`, {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.NEXT_PUBLIC_TOM_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload batch file");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading batch file:", error);
    throw error;
  }
}
