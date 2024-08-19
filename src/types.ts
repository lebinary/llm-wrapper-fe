export type TextResponse = { text: string };
export type DataResponse = { data: Record<string, unknown>[] };
export type JsonResponse = { json: object };

type PromptResponse = TextResponse | DataResponse | JsonResponse;

export type UploadedFile = {
  id: number;
  filename?: string;
  path: string;
  active: boolean;
  top_row?: null;
  created_at: string;
}

export type Conversation = {
  id: number;
  title: string;
  prompts: Prompt[];
  files: UploadedFile[];
  created_at: string;
}

export type Prompt = {
  id: number;
  content: string;
  response: PromptResponse;
  rating: number | null;
  created_at: string;
}

export const isTextResponse = (promptResponse: PromptResponse): promptResponse is TextResponse => {
  return 'text' in promptResponse && typeof promptResponse.text === 'string';
};

export const isDataResponse = (promptResponse: PromptResponse): promptResponse is DataResponse => {
  return 'data' in promptResponse && Array.isArray(promptResponse.data);
};

export const isJsonResponse = (promptResponse: PromptResponse): promptResponse is JsonResponse => {
  return 'json' in promptResponse && typeof promptResponse.json === 'object' && promptResponse.json !== null;
};
