import { Card } from "@/components/ui/card";
import { Check} from "lucide-react";
import { SubscriptionPaymentMethods } from "./SubscriptionPaymentMethods";
import { SubscriptionPlan } from "./SubscriptionPlan";

interface SubscriptionSectionProps {
  customerId: string;
  userId: string;
}

export const SubscriptionSection = ({ customerId, userId }: SubscriptionSectionProps) => {

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4">
      <Card className="h-full p-6 col-span-1 row-span-1">
        <h2 className="text-xl font-semibold mb-2">Current Plan</h2>
        <div className="space-y-4">
          <SubscriptionPlan customerId={customerId} />
        </div>
      </Card>

      <Card className="h-full p-6 col-span-1 row-span-1">
        <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
        <div className="space-y-4">
          <SubscriptionPaymentMethods customerId={customerId} userId={userId} />
        </div>
      </Card>

      {/* Billing History */}
      <Card className="bg-gray-800 rounded-xl p-6 border border-gray-700 col-span-2 row-span-1">
        <h2 className="text-xl font-semibold mb-6">Billing History</h2>
        <div className="space-y-4">
          {[
            { date: 'Mar 15, 2024', amount: '$29.00', status: 'Paid' },
            { date: 'Feb 15, 2024', amount: '$29.00', status: 'Paid' },
            { date: 'Jan 15, 2024', amount: '$29.00', status: 'Paid' }
          ].map((invoice, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
              <div>
                <p className="font-medium">{invoice.date}</p>
                <p className="text-sm text-gray-400">{invoice.amount}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Check className="w-4 h-4" />
                  {invoice.status}
                </span>
                <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
