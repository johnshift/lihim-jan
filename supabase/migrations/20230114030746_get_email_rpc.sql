set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_email(principal text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
	return (
		select
			au.email
		from
			auth.users au
		join profiles p
			on au.id = p.user_id
		where
			lower(p.username) = lower(principal)
	);
end $function$
;


