import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { validateCustomHeader } from "@/utils/customHeaders";

interface CustomHeadersEditorProps {
  headers: Record<string, string>;
  onChange: (headers: Record<string, string>) => void;
}

export function CustomHeadersEditor({ headers, onChange }: CustomHeadersEditorProps) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const addHeader = () => {
    const validationError = validateCustomHeader(name, value, headers);
    if (validationError) {
      setError(validationError);
      return;
    }
    onChange({ ...headers, [name.trim()]: value.trim() });
    setName("");
    setValue("");
    setError("");
  };

  return (
    <section>
      <h3 className="font-medium text-foreground mb-1">Additional Request Headers</h3>
      <p className="text-sm text-muted-foreground mb-4">Add any headers required by this university's API. They are sent with every lead request.</p>
      <div className="space-y-3">
        {Object.entries(headers).map(([key, currentValue]) => (
          <div key={key} className="flex flex-wrap items-center gap-2">
            <code className="min-w-32 break-all text-sm text-foreground">{key}</code>
            <input
              type="password"
              aria-label={`Value for ${key}`}
              value={currentValue}
              onChange={(event) => onChange({ ...headers, [key]: event.target.value })}
              className="input-field min-w-0 flex-1"
            />
            <button
              type="button"
              aria-label={`Remove ${key}`}
              onClick={() => onChange(Object.fromEntries(Object.entries(headers).filter(([name]) => name !== key)))}
              className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            aria-label="New header name"
            placeholder="Header name, e.g. X-API-Key"
            value={name}
            onChange={(event) => { setName(event.target.value); setError(""); }}
            className="input-field min-w-40 flex-1"
          />
          <input
            type="password"
            aria-label="New header value"
            placeholder="Header value"
            value={value}
            onChange={(event) => { setValue(event.target.value); setError(""); }}
            className="input-field min-w-40 flex-1"
          />
          <button type="button" onClick={addHeader} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Header
          </button>
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </div>
    </section>
  );
}
