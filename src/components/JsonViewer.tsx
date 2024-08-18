import { JsonResponse } from "../types";

export const JsonViewer: React.FC<JsonResponse> = ({ json }) => (
  <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
    {JSON.stringify(json, null, 2)}
  </pre>
);
