
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { 
  User, 
  Shield, 
  CreditCard, 
  ChartBar,
  Upload,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'premium'>('free');
  const [tradingAccounts, setTradingAccounts] = useState<any[]>([]);
  const [newAccountName, setNewAccountName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/login");
          return;
        }

        // Fetch profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }

        // Fetch subscription data
        const { data: subscriptionData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (subscriptionData) {
          setSubscriptionTier(subscriptionData.tier);
        }

        // Fetch trading accounts
        const { data: tradingAccountsData } = await supabase
          .from('trading_accounts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (tradingAccountsData) {
          setTradingAccounts(tradingAccountsData);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploadingAvatar(true);

      // Upload the file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update the profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      // Update local state
      setProfile({ ...profile, avatar_url: publicUrl });

      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          username: profile.username,
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    }
  };

  const handleUpgradeSubscription = async () => {
    // This would typically integrate with a payment provider like Stripe
    toast({
      title: "Coming Soon",
      description: "Subscription upgrades will be available soon!",
    });
  };

  const handleAddTradingAccount = async () => {
    if (!newAccountName.trim()) {
      toast({
        title: "Error",
        description: "Please enter an account name",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('trading_accounts')
        .insert([{ 
          account_name: newAccountName,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      setTradingAccounts([data, ...tradingAccounts]);
      setNewAccountName("");
      
      toast({
        title: "Success",
        description: "Trading account added successfully",
      });
    } catch (error: any) {
      console.error('Error adding trading account:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add trading account",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTradingAccount = async (id: string) => {
    try {
      const { error } = await supabase
        .from('trading_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTradingAccounts(tradingAccounts.filter(account => account.id !== id));
      
      toast({
        title: "Success",
        description: "Trading account deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting trading account:', error);
      toast({
        title: "Error",
        description: "Failed to delete trading account",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

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
                  <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                  >
                    {uploadingAvatar ? "Uploading..." : "Change Avatar"}
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Full Name</Label>
                  <Input 
                    value={profile?.full_name || ""} 
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    placeholder="Enter your full name" 
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Username</Label>
                  <Input 
                    value={profile?.username || ""} 
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    placeholder="Enter your username" 
                  />
                </div>
                <Button onClick={handleProfileUpdate}>Save Changes</Button>
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
                  <Label className="text-sm font-medium mb-2 block">Current Password</Label>
                  <Input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password" 
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">New Password</Label>
                  <Input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password" 
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Confirm New Password</Label>
                  <Input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password" 
                  />
                </div>
                <Button onClick={handlePasswordUpdate}>Update Password</Button>
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
                  <p className="text-muted-foreground capitalize">{subscriptionTier} Plan</p>
                </div>
                {subscriptionTier === 'free' && (
                  <Button onClick={handleUpgradeSubscription}>Upgrade to Premium</Button>
                )}
              </div>
              <div className="border-t pt-6">
                <h4 className="text-base font-medium mb-4">Plan Features</h4>
                <ul className="space-y-2">
                  {subscriptionTier === 'free' ? (
                    <>
                      <li className="flex items-center gap-2">
                        <span className="text-muted-foreground">• Basic trading analytics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-muted-foreground">• 1 trading account</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-muted-foreground">• Standard support</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center gap-2">
                        <span className="text-muted-foreground">• Advanced trading analytics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-muted-foreground">• Up to 10 trading accounts</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-muted-foreground">• Priority support</span>
                      </li>
                    </>
                  )}
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
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="Enter account name"
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                    className="w-64"
                  />
                  <Button onClick={handleAddTradingAccount}>Add Account</Button>
                </div>
              </div>
              <div className="space-y-4">
                {tradingAccounts.map((account) => (
                  <div key={account.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{account.account_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Created on {new Date(account.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteTradingAccount(account.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {tradingAccounts.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No trading accounts yet. Add your first one!
                  </p>
                )}
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
                <p className="text-muted-foreground text-center py-4">
                  No import history available yet.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
