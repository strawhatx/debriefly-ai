import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useStripeMethods } from "./hooks/useStripeMethods";

interface SubscriptionAddPaymentMethodProps {
  customerId: string;
  userId: string;
  clientSecret: string;
  onPaymentMethodAdded: () => void;  // ✅ Callback to refresh payment methods after adding one
}

export const SubscriptionAddPaymentMethod = ({ userId, customerId, clientSecret, onPaymentMethodAdded }: SubscriptionAddPaymentMethodProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { savePaymentMethod } = useStripeMethods();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    // ✅ Step 1: Submit elements before confirming
    const submitResult = await elements.submit();
    if (submitResult.error) {
      console.error("❌ Error submitting form:", submitResult.error.message);
      setLoading(false);
      return;
    }

    // ✅ Step 2: Confirm SetupIntent
    const result = await stripe.confirmSetup({
      elements,
      clientSecret,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });

    // ✅ Step 3: Handle errors before proceeding
    if (result.error) {
      console.error("❌ Error adding payment method:", result.error.message);
      setLoading(false);
      return;
    }

    // ✅ Step 4: Ensure `setupIntent` exists before accessing `payment_method`
    const setupIntent = result.setupIntent;
    if (!setupIntent || setupIntent.status !== "succeeded") {
      console.error("❌ setupIntent is missing or failed. Something went wrong.");
      setLoading(false);
      return;
    }

    const paymentMethodId = setupIntent.payment_method;
    console.log("✅ Payment method added:", paymentMethodId);

    // ✅ Step 5: Send to Supabase to save the payment method
    const data = await savePaymentMethod(userId, customerId, paymentMethodId.toString());

    if (data.error) {
      console.error("❌ Error saving payment method:", data.error);
    } 
    else {
      console.log("✅ Payment method saved successfully in Supabase!");
      onPaymentMethodAdded();
      setOpen(false); // Close modal after success
    }

    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-primary hover:text-emerald-300 text-sm font-medium">
          <PlusCircle /> Add Payment Method
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>+ Add Payment Method</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <PaymentElement />

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="destructive" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={!stripe}>{loading ? "Saving..." : "Save Payment Method"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

  );
}

