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
