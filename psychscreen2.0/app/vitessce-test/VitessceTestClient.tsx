"use client";

import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Vitessce = React.lazy(() =>
  import("vitessce").then((module) => ({ default: module.Vitessce }))
);

const config = {
  version: "1.0.16",
  name: "Vitessce smoke test",
  description: "",
  datasets: [],
  initStrategy: "auto",
  coordinationSpace: {},
  layout: [
    {
      component: "description",
      props: {
        description: "Vitessce loaded successfully.",
      },
      x: 0,
      y: 0,
      w: 6,
      h: 4,
    },
  ],
};

export default function VitessceTestClient() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <ErrorBoundary
        fallback={
          <div style={{ padding: 16 }}>
            Vitessce failed to load in this runtime.
          </div>
        }
      >
        <Suspense fallback={<div style={{ padding: 16 }}>Loading Vitessce...</div>}>
          <Vitessce config={config} theme="light" />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
