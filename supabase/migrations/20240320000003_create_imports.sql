-- Create imports table
CREATE TABLE public.imports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    trading_account_id UUID NOT NULL REFERENCES public.trading_accounts(id) ON DELETE CASCADE,
    import_type TEXT NOT NULL,
    status public.import_status NOT NULL DEFAULT 'PENDING',
    file_path TEXT,
    file_type TEXT,
    file_size NUMERIC,
    original_filename TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


create index IF not exists idx_imports_trading_account_id on public.imports using btree (trading_account_id) TABLESPACE pg_default;

create index IF not exists idx_imports_user_id on public.imports using btree (user_id) TABLESPACE pg_default;

-- Enable Row Level Security
ALTER TABLE public.imports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own imports"
    ON public.imports FOR SELECT
    USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own imports"
    ON public.imports FOR INSERT
    WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own imports"
    ON public.imports FOR UPDATE
    USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own imports"
    ON public.imports FOR DELETE
    USING ((select auth.uid()) = user_id);

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.imports
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for import files
INSERT INTO storage.buckets (id, name, public)
VALUES ('import_files', 'import_files', false);

-- Create storage policies for import files
CREATE POLICY "Users can upload their own import files"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'import_files' AND
        auth.uid() = (storage.foldername(name))[1]::uuid
    );

CREATE POLICY "Users can view their own import files"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'import_files' AND
        auth.uid() = (storage.foldername(name))[1]::uuid
    );

CREATE POLICY "Users can update their own import files"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'import_files' AND
        auth.uid() = (storage.foldername(name))[1]::uuid
    );

CREATE POLICY "Users can delete their own import files"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'import_files' AND
        auth.uid() = (storage.foldername(name))[1]::uuid
    ); 