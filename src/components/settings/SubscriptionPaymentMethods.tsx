import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useStripeMethods } from "./hooks/useStripeMethods";
import { CreditCard, Trash } from "lucide-react";
import { SubscriptionAddPaymentMethod } from "./SubscriptionAddPaymentMethod";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CARD_ICONS = {
    visa: "/svg/visa.svg", // Replace with actual paths to your SVGs
    mastercard: "/svg/mastercard.svg",
    amex: "/svg/amex.svg",
    discover: "/svg/discover.svg",
    default: "/svg/credit-card.svg",
};

interface SubscriptionPaymentMethods {
    customerId: string;
    userId: string;
}

export const SubscriptionPaymentMethods = ({ customerId, userId }: SubscriptionPaymentMethods) => {
    const [clientSecret, setClientSecret] = useState("");
    const [methods, setMethods] = useState([]);
    const { fetchSetupIntent, fetchPaymentMethods, setDefaultPaymentMethod, deletePaymentMethod } = useStripeMethods();

    const refreshPaymentMethods = async () => {
        const results = await fetchPaymentMethods(userId);
        setMethods(results || []);
    }

    useEffect(() => {
        fetchSetupIntent(customerId)
            .then(result => {
                console.log("🔍 Received clientSecret:", result);  // ✅ Debugging
                setClientSecret(result);
            })
            .then(async () => await refreshPaymentMethods());
    }, []);

    return (
        <>
            {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <div className="space-y-4">
                        {methods.length === 0 && (
                            <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <p className="font-sm">No payment methods saved.</p>
                                </div>
                            </div>
                        )}

                        {methods.map((method) => (
                            <div key={method.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={CARD_ICONS[method.brand.toLowerCase()] || CARD_ICONS.default}
                                        alt={method.brand}
                                        className="w-8 h-8 text-gray-400"
                                    />
                                    <div>
                                        <p className="text-base">•••• •••• •••• {method.last_4}</p>
                                        <p className="text-sm text-gray-400">Expires {method.exp_month}/ {method.exp_year}</p>
                                    </div>
                                </div>

                                {method.is_default && (
                                    <Badge className="border border-primary text-primary text-xs">
                                        Default
                                    </Badge>
                                )}

                                {!method.is_default && (<div className="flex gap-2">
                                    <Button
                                        variant="link"
                                        className="text-xs p-0"
                                        onClick={() => setDefaultPaymentMethod(customerId, method.id)}
                                    >
                                        Set Default
                                    </Button>
                                    <Button variant="link" className="p-0 text-destructive" onClick={() => deletePaymentMethod(customerId, method.id)}>
                                        <Trash className="w-11 h-11" />
                                    </Button>
                                </div>)}
                            </div>
                        ))}

                        <SubscriptionAddPaymentMethod userId={userId} customerId={customerId} clientSecret={clientSecret} onPaymentMethodAdded={refreshPaymentMethods} />
                    </div>
                </Elements>
            )}

            {!clientSecret && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                        <div className="flex items-center gap-4">
                            <p className="font-medium">Loading ...</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
