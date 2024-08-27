import { Schema, model, models } from "mongoose";

// Define the schema for the decision
const DecisionSchema = new Schema({
  decision: {
    type: String,
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  input: {
    type: Map,
    of: Schema.Types.Mixed,
    required: true,
  },
});

const Decision = models?.Decision || model("Decision", DecisionSchema);

export default Decision;
