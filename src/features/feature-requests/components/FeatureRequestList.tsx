import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Clock, CheckCircle2, XCircle, PlayCircle } from 'lucide-react';
import type { FeatureRequest } from '../hooks/use-feature-requests';
import { cn } from '@/utils/utils';

interface FeatureRequestListProps {
  requests: FeatureRequest[];
  onVote: (requestId: string, hasVoted: boolean) => Promise<void>;
}

const statusConfig = {
  pending: {
    color: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
    icon: Clock,
    label: 'Pending Review'
  },
  planned: {
    color: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
    icon: CheckCircle2,
    label: 'Planned'
  },
  in_progress: {
    color: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
    icon: PlayCircle,
    label: 'In Progress'
  },
  completed: {
    color: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
    icon: CheckCircle2,
    label: 'Completed'
  },
  declined: {
    color: 'bg-red-500/10 text-red-500 hover:bg-red-500/20',
    icon: XCircle,
    label: 'Declined'
  }
} as const;

export const FeatureRequestList = ({ requests, onVote }: FeatureRequestListProps) => {
  if (!requests || requests.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="text-center py-8 text-muted-foreground">
          No feature requests yet. Be the first to suggest one!
        </CardContent>
      </Card>
    );
  }

  // Group requests by status
  const groupedRequests = requests.reduce((acc, request) => {
    if (!acc[request.status]) {
      acc[request.status] = [];
    }
    acc[request.status].push(request);
    return acc;
  }, {} as Record<string, FeatureRequest[]>);

  // Order of status display
  const statusOrder = ['in_progress', 'planned', 'pending', 'completed', 'declined'];

  return (
    <div className="space-y-8">
      {statusOrder.map(status => {
        const statusRequests = groupedRequests[status];
        if (!statusRequests?.length) return null;

        const StatusIcon = statusConfig[status as keyof typeof statusConfig].icon;

        return (
          <div key={status} className="space-y-4">
            <div className="flex items-center gap-2">
              <StatusIcon className={cn("h-5 w-5", statusConfig[status as keyof typeof statusConfig].color)} />
              <h2 className="text-lg font-semibold">
                {statusConfig[status as keyof typeof statusConfig].label}
              </h2>
              <Badge variant="outline" className="ml-2">
                {statusRequests.length}
              </Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {statusRequests.map((request) => (
                <Card key={request.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-lg leading-tight">{request.title}</CardTitle>
                      <Badge 
                        variant="secondary"
                        className={cn(
                          "shrink-0",
                          statusConfig[request.status].color
                        )}
                      >
                        {request.votes_count} votes
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground text-sm">
                      {request.description}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center border-t pt-4">
                    <Button
                      variant={request.has_voted ? "default" : "outline"}
                      size="sm"
                      onClick={() => onVote(request.id, request.has_voted || false)}
                      className="gap-2"
                    >
                      <ThumbsUp className={cn("h-4 w-4", request.has_voted && "fill-current")} />
                      <span>{request.has_voted ? 'Voted' : 'Vote'}</span>
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}; 