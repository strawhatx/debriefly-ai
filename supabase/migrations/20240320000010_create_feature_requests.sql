-- Create feature requests table
CREATE TABLE IF NOT EXISTS public.feature_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'planned', 'in_progress', 'completed', 'declined')),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    votes_count INT NOT NULL DEFAULT 0
);

-- Create feature request votes table
CREATE TABLE IF NOT EXISTS public.feature_request_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    feature_request_id UUID NOT NULL REFERENCES public.feature_requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(feature_request_id, user_id)
);

-- Add RLS policies for feature requests
ALTER TABLE public.feature_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all feature requests"
ON public.feature_requests FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create feature requests"
ON public.feature_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feature requests"
ON public.feature_requests FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Add RLS policies for votes
ALTER TABLE public.feature_request_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all votes"
ON public.feature_request_votes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can vote once per feature"
ON public.feature_request_votes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their votes"
ON public.feature_request_votes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create function to update votes count
CREATE OR REPLACE FUNCTION public.update_feature_request_votes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.feature_requests
        SET votes_count = votes_count + 1
        WHERE id = NEW.feature_request_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.feature_requests
        SET votes_count = votes_count - 1
        WHERE id = OLD.feature_request_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for votes count
CREATE TRIGGER update_feature_request_votes_count
AFTER INSERT OR DELETE ON public.feature_request_votes
FOR EACH ROW
EXECUTE FUNCTION public.update_feature_request_votes_count(); 