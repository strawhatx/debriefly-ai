
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Shield, 
  CreditCard, 
  ChartBar,
  Upload,
} from "lucide-react";

const Settings = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Settings</h1>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Subscription
          </TabsTrigger>
          <TabsTrigger value="trading-accounts" className="flex items-center gap-2">
            <ChartBar className="h-4 w-4" />
            Trading Accounts
          </TabsTrigger>
          <TabsTrigger value="import-history" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import History
          </TabsTrigger>
        </TabsList>

        {/* Profile Section */}
        <TabsContent value="profile">
          <Card className="p-6">
            <div className="space-y-8">
              <div className="flex items-center gap-8">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <Button>Change Avatar</Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name</label>
                  <Input placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input type="email" placeholder="Enter your email" />
                </div>
                <Button>Save Changes</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Security Section */}
        <TabsContent value="security">
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Current Password</label>
                  <Input type="password" placeholder="Enter current password" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">New Password</label>
                  <Input type="password" placeholder="Enter new password" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Confirm New Password</label>
                  <Input type="password" placeholder="Confirm new password" />
                </div>
                <Button>Update Password</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Subscription Section */}
        <TabsContent value="subscription">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Current Plan</h3>
                  <p className="text-muted-foreground">Free Plan</p>
                </div>
                <Button>Upgrade to Premium</Button>
              </div>
              <div className="border-t pt-6">
                <h4 className="text-base font-medium mb-4">Plan Features</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-muted-foreground">• Basic trading analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-muted-foreground">• 1 trading account</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-muted-foreground">• Standard support</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Trading Accounts Section */}
        <TabsContent value="trading-accounts">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Trading Accounts</h3>
                <Button>Add Account</Button>
              </div>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Main Trading Account</h4>
                      <p className="text-sm text-muted-foreground">Created on Jan 1, 2024</p>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Import History Section */}
        <TabsContent value="import-history">
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Import History</h3>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">January Trades Import</h4>
                      <p className="text-sm text-muted-foreground">Imported on Jan 31, 2024</p>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
