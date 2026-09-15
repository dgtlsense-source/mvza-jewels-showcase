CREATE TABLE public.opening_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(trim(name)) BETWEEN 2 AND 100),
  phone TEXT NOT NULL CHECK (char_length(trim(phone)) BETWEEN 8 AND 20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.opening_invitations TO anon, authenticated;
GRANT ALL ON public.opening_invitations TO service_role;

ALTER TABLE public.opening_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guests can request an opening invitation"
ON public.opening_invitations
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(trim(name)) BETWEEN 2 AND 100
  AND char_length(trim(phone)) BETWEEN 8 AND 20
);