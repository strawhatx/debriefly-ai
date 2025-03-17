import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

// Improve type definitions with proper interfaces
interface TradingAccount {
  account_name: string;
}

interface ImportResponse {
  id: string;
  trading_account_id: string;
  import_type: string;
  status: string;
  error_message: string | null;
  created_at: string;
  trading_accounts?: TradingAccount;
  user_id: string;
}

interface Import {
  id: string;
  trading_account_id: string;
  import_type: string;
  status: string;
  error_message: string | null;
  created_at: string;
  account_name?: string;
}

export const useImportHistorySection = () => {
    const { toast } = useToast();
    const [imports, setImports] = useState<Import[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchImports = async () => {
        try {
            setError(null);
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            
            if (authError) throw authError;
            if (!user) throw new Error('No authenticated user found');

            const { data: importsData, error: importsError } = await supabase
                .from('imports')
                .select(`
                    *,
                    trading_accounts (
                        account_name
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(50); // Add reasonable limit to prevent performance issues

            if (importsError) throw importsError;

            const formattedImports = (importsData as ImportResponse[]).map(({ trading_accounts, ...imp }) => ({
                ...imp,
                account_name: trading_accounts?.account_name
            }));

            setImports(formattedImports);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            console.error('Error fetching imports:', error);
            setError(error as Error);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;

        const initFetch = async () => {
            await fetchImports();
        };

        if (mounted) {
            initFetch();
        }

        return () => {
            mounted = false;
        };
    }, []);

    return {
        imports,
        loading,
        error,
        refetch: fetchImports,
    };
};