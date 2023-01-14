create or replace 
function signup_preflight(
	"usernameInput" text,
	"emailInput" text
)
returns table (
	"usernameTaken" boolean,
	"emailTaken" boolean
)
language plpgsql 
security definer set search_path = public 
as $$
begin

	"usernameTaken" = (select exists(select 1 from profiles where lower(username) = lower("usernameInput")));
	"emailTaken" = (select exists(select 1 from auth.users where lower(email) = lower("emailInput")));
	return next;

end;
$$;