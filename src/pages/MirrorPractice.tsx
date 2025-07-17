
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PronunciationMirror } from "@/components/pronunciation/PronunciationMirror";

export default function MirrorPractice() {
  return (
    <AppLayout>
      <div className="container mx-auto py-8 max-w-4xl">
        <PronunciationMirror />
      </div>
    </AppLayout>
  );
}
