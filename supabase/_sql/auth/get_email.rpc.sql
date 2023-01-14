-- principal is assumed to be a username (which is profile.id)
create or replace function public.get_email(principal text) 
returns text language plpgsql 
security definer set search_path = public 
as $$
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
end $$;