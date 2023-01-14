set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.signup_preflight("usernameInput" text, "emailInput" text)
 RETURNS TABLE("usernameTaken" boolean, "emailTaken" boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin

	"usernameTaken" = (select exists(select 1 from profiles where lower(username) = lower("usernameInput")));
	"emailTaken" = (select exists(select 1 from auth.users where lower(email) = lower("emailInput")));
	return next;

end;
$function$
;


