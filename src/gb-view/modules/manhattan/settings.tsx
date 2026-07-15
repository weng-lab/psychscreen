import {
  SettingsSection,
  type TrackSettingsProps,
} from "@weng-lab/genomebrowser-v2";
import type { CSSProperties } from "react";
import type { ManhattanConfig, ManhattanYDomain } from "./types";

export function ManhattanSettings({
  config,
  updateConfig,
}: TrackSettingsProps<ManhattanConfig>) {
  const updateBound = (bound: keyof ManhattanYDomain, rawValue: string) => {
    const value = rawValue === "" ? undefined : Number(rawValue);
    if (value !== undefined && !Number.isFinite(value)) return;

    const yDomain = { ...config.yDomain, [bound]: value };
    updateConfig({
      yDomain:
        yDomain.min === undefined && yDomain.max === undefined
          ? undefined
          : yDomain,
    });
  };

  return (
    <SettingsSection title="Manhattan">
      <label style={fieldStyle}>
        URL
        <input
          type="text"
          value={config.url}
          onChange={(event) => updateConfig({ url: event.target.value })}
        />
      </label>
      <div style={fieldStyle}>
        Y domain
        <div style={{ display: "flex", gap: "6px" }}>
          <input
            aria-label="Minimum Y domain"
            type="number"
            step="any"
            placeholder="auto min"
            value={config.yDomain?.min ?? ""}
            onChange={(event) => updateBound("min", event.target.value)}
          />
          <input
            aria-label="Maximum Y domain"
            type="number"
            step="any"
            placeholder="auto max"
            value={config.yDomain?.max ?? ""}
            onChange={(event) => updateBound("max", event.target.value)}
          />
        </div>
      </div>
    </SettingsSection>
  );
}

const fieldStyle = {
  display: "grid",
  gap: "4px",
} satisfies CSSProperties;
