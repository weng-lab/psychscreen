"use client";

import dynamic from "next/dynamic";

const VitessceTestClient = dynamic(() => import("./VitessceTestClient"), {
  ssr: false,
  loading: () => <main>Loading Vitessce smoke test...</main>,
});

export default function VitessceTestLoader() {
  return <VitessceTestClient />;
}
