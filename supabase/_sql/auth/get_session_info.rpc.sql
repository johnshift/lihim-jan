create or replace function public.get_session_info("emailInput" text) 
returns table (
	id uuid,
	avatar text,
	username text,
	firstname text,
	lastname text,
	bio text
) 
language plpgsql 
security definer
set search_path = public
as $$ 
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

end $$;