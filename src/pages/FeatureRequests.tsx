'use client';

import { useEffect } from 'react';
import { NewFeatureRequestDialog } from '@/features/feature-requests/components/NewFeatureRequestDialog';
import { FeatureRequestList } from '@/features/feature-requests/components/FeatureRequestList';
import { useFeatureRequests } from '@/features/feature-requests/hooks/use-feature-requests';

export const FeatureRequestsPage = () => {
  const { requests, isLoading, fetchRequests, createRequest, toggleVote } = useFeatureRequests();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div className="container max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feature Requests</h1>
          <p className="text-muted-foreground mt-1">
            Help shape the future of our platform by suggesting and voting on features.
          </p>
        </div>
        <NewFeatureRequestDialog onSubmit={createRequest} />
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading feature requests...</div>
      ) : (
        <FeatureRequestList requests={requests} onVote={toggleVote} />
      )}
    </div>
  );
}; 