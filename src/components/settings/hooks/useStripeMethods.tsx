import { supabase } from "@/integrations/supabase/client";

export const useStripeMethods = () => {
    const API_URL  = `${import.meta.env.VITE_SUPABASE_API}/payment-methods`;

    const fetchCustomerId = async (userId: string) => {
        const { data, error } = await supabase
            .from("profiles").select("stripe_customer_id").eq("id", userId).single();

        if (error || !data?.stripe_customer_id) {
            console.error("❌ Stripe Customer ID not found for user:", userId);
            return null;
        }

        return data.stripe_customer_id;
    };

    const fetchSetupIntent = async (customerId: string) => {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "createSetupIntent", customerId }),
        });

        const data = await response.json();
        return data.clientSecret;
    };

    const fetchPaymentMethods = async (userId: string) => {
        const { data, error } = await supabase.from("payment_methods")
            .select("id,brand,last_4,exp_month,exp_year,is_default").eq("user_id", userId);
        
        if (error) {
            console.error("❌ There was an issue retrievig the payment methods:", error);
            return null;
        }
            
        return data;
    };

    const createCustomer = async (email: string, userId: string) => {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "createCustomer",email, userId }),
        });
    };

    const setDefaultPaymentMethod = async (customerId: string, paymentMethodId: string) => {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "setDefaultPaymentMethod", customerId, paymentMethodId }),
        });
    };


    const savePaymentMethod = async (userId: string, customerId: string, paymentMethodId: string) => {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "savePaymentMethod", userId, customerId, paymentMethodId }),
        });

        const result = await response.json();
        
        return result;
    };

    const deletePaymentMethod = async (customerId: string, paymentMethodId: string) => {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "deletePaymentMethod", customerId, paymentMethodId }),
        });
    };

    return {
        fetchCustomerId,
        fetchSetupIntent,
        fetchPaymentMethods,
        setDefaultPaymentMethod,
        createCustomer,
        savePaymentMethod,
        deletePaymentMethod
    };
};
