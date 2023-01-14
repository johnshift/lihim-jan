set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.after_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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

end $function$
;

CREATE TRIGGER after_signup_trigger AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION after_signup();