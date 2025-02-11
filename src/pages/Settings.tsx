
import { Card } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Settings</h1>
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
          <p className="text-muted-foreground">
            Coming soon: Manage your account preferences and settings.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
