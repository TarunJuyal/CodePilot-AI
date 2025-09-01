import { InferenceClient } from "@huggingface/inference";

declare global {
  // Prevent multiple instances during hot reload in dev
  var hf: InferenceClient | undefined;
}

export const hf =
  global.hf || new InferenceClient(process.env.HUGGINGFACE_API_KEY!);

if (process.env.NODE_ENV !== "production") global.hf = hf;
