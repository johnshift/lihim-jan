set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_session_info("emailInput" text)
 RETURNS TABLE(id uuid, avatar text, username text, firstname text, lastname text, bio text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$ 
begin

	return query
	select
		au.id,
		p.avatar,
		p.username,
		p.firstname,
		p.lastname,
		p.bio
	from
		auth.users au
		join profiles p
			on p.user_id = au.id
	where
		lower(au.email) = lower("emailInput");

end $function$
;


