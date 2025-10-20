INSERT INTO public.categories (id, name, description) 
VALUES ('remeras', 'Remeras', 'Remeras y camisetas premium')
ON CONFLICT (id) DO NOTHING;

