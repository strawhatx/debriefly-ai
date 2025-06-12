import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import useTradingAccountStore from '@/store/trading-account';

interface AnalysisJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

export const useAnalysisStatus = () => {
  const [jobs, setJobs] = useState<AnalysisJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const selectedAccount = useTradingAccountStore((state) => state.selected);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('analysis_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (selectedAccount) {
        query = query.eq('trading_account_id', selectedAccount);
      }

      const { data } = await query;
      if (data) {
        setJobs(data as AnalysisJob[]);
      }
      setIsLoading(false);
    };

    // Initial fetch
    fetchJobs();

    // Subscribe to changes
    const channel = supabase
      .channel('analysis_jobs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'analysis_jobs',
          filter: selectedAccount 
            ? `user_id=eq.${supabase.auth.user()?.id}&trading_account_id=eq.${selectedAccount}`
            : `user_id=eq.${supabase.auth.user()?.id}`
        },
        () => {
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [selectedAccount]);

  const activeJobs = jobs.filter(job => job.status === 'pending' || job.status === 'processing');
  const hasActiveJobs = activeJobs.length > 0;
  const completedJobs = jobs.filter(job => job.status === 'completed');
  const failedJobs = jobs.filter(job => job.status === 'failed');

  return {
    jobs,
    activeJobs,
    hasActiveJobs,
    completedJobs,
    failedJobs,
    isLoading
  };
}; 