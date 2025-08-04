-- Update the status constraint to include 'dropped'
ALTER TABLE public.prospects 
DROP CONSTRAINT IF EXISTS prospects_status_check;

ALTER TABLE public.prospects 
ADD CONSTRAINT prospects_status_check 
CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'dropped', 'lost'));