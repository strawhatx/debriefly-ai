
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface SubscriptionSectionProps {
  subscriptionTier: 'free' | 'premium';
}

export const SubscriptionSection = ({ subscriptionTier }: SubscriptionSectionProps) => {
  const { toast } = useToast();

  const handleUpgradeSubscription = async () => {
    toast({
      title: "Coming Soon",
      description: "Subscription upgrades will be available soon!",
    });
  };

  return (
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
  );
};
