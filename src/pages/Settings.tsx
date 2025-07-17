
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SettingsForm } from "@/components/settings/SettingsForm";

const SettingsPage = () => {
  return (
    <AppLayout>
      <div className="container px-4 py-8 mx-auto max-w-xl">
        <SettingsForm />
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
