import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'planned' | 'in_progress' | 'completed' | 'declined';
  user_id: string;
  created_at: string;
  votes_count: number;
  has_voted?: boolean;
}

export const useFeatureRequests = () => {
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No user found');
        return;
      }

      console.log('Fetching feature requests...');
      // First fetch all feature requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('feature_requests')
        .select('*')
        .order('votes_count', { ascending: false });

      if (requestsError) {
        console.error('Error fetching requests:', requestsError);
        throw requestsError;
      }

      console.log('Feature requests:', requestsData);

      // Then fetch the user's votes
      const { data: votesData, error: votesError } = await supabase
        .from('feature_request_votes')
        .select('feature_request_id')
        .eq('user_id', user.id);

      if (votesError) {
        console.error('Error fetching votes:', votesError);
        throw votesError;
      }

      console.log('User votes:', votesData);

      // Create a Set of feature request IDs that the user has voted on
      const userVotedRequests = new Set(votesData?.map(vote => vote.feature_request_id) || []);

      // Process the data to add has_voted flag
      const processedData = requestsData.map(request => ({
        ...request,
        has_voted: userVotedRequests.has(request.id)
      }));

      console.log('Processed data:', processedData);
      setRequests(processedData);
    } catch (error) {
      console.error('Error fetching feature requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load feature requests',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRequest = useCallback(async (title: string, description: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('feature_requests')
        .insert({
          title,
          description,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Feature request created successfully',
      });

      await fetchRequests();
    } catch (error) {
      console.error('Error creating feature request:', error);
      toast({
        title: 'Error',
        description: 'Failed to create feature request',
        variant: 'destructive',
      });
    }
  }, [fetchRequests]);

  const toggleVote = useCallback(async (requestId: string, hasVoted: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      if (hasVoted) {
        // Remove vote
        const { error } = await supabase
          .from('feature_request_votes')
          .delete()
          .match({ feature_request_id: requestId, user_id: user.id });

        if (error) throw error;
      } else {
        // Add vote
        const { error } = await supabase
          .from('feature_request_votes')
          .insert({
            feature_request_id: requestId,
            user_id: user.id,
          });

        if (error) throw error;
      }

      await fetchRequests();
    } catch (error) {
      console.error('Error toggling vote:', error);
      toast({
        title: 'Error',
        description: 'Failed to update vote',
        variant: 'destructive',
      });
    }
  }, [fetchRequests]);

  return {
    requests,
    isLoading,
    fetchRequests,
    createRequest,
    toggleVote,
  };
}; 