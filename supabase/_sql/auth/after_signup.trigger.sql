create or replace function public.after_signup()
	returns trigger
	language plpgsql
	security definer set search_path = public
as $$
begin

	-- user profile
	insert into profiles (user_id, username, avatar, firstname, lastname)
	values (
		new.id,
		new.raw_user_meta_data ->> 'username',
		new.raw_user_meta_data ->> 'avatar',
		new.raw_user_meta_data ->> 'firstname',
		new.raw_user_meta_data ->> 'lastname'
	);

	-- clear user metadata on auth.users
	update auth.users set raw_user_meta_data = '{}' where email = new.email;

	return new;

end $$;

create trigger after_signup_trigger
after insert on auth.users
	for each row execute procedure public.after_signup();