-- ======================================================================
-- ============================== UTILS =================================
-- ======================================================================

create or replace function rnum(low int, high int)
returns int language plpgsql as $$
begin
	return (
		floor(random() * (high - low + 1) + low)
	);
end; $$;

create or replace function lorem( quantity_ integer ) 
returns character varying
    language plpgsql
    as $$
  declare
    words_       text[];
    returnValue_ text := '';
    random_      integer;
    ind_         integer;
  begin
  words_ := array['lorem', 'ipsum', 'dolor', 'amet', 'consectetur', 'adipiscing', 'elit', 'accumsan', 'aenean', 'aliquam', 'aliquet', 'ante', 'aptent', 'arcu', 'auctor', 'augue', 'bibendum', 'blandit', 'class', 'commodo', 'condimentum', 'congue', 'consequat', 'conubia', 'convallis', 'cras', 'cubilia', 'curabitur', 'curae', 'cursus', 'dapibus', 'diam', 'dictum', 'dictumst', 'dignissim', 'donec', 'duis', 'egestas', 'eget', 'eleifend', 'elementum', 'enim', 'erat', 'eros', 'etiam', 'euismod', 'facilisi', 'facilisis', 'fames', 'faucibus', 'felis', 'fermentum', 'feugiat', 'fringilla', 'fusce', 'gravida', 'habitant', 'habitasse', 'hendrerit', 'himenaeos', 'iaculis', 'imperdiet', 'inceptos', 'integer', 'interdum', 'justo', 'lacinia', 'lacus', 'laoreet', 'lectus', 'libero', 'ligula', 'litora', 'lobortis', 'luctus', 'maecenas', 'magna', 'magnis', 'malesuada', 'massa', 'mattis', 'mauris', 'metus', 'molestie', 'mollis', 'montes', 'morbi', 'nascetur', 'natoque', 'neque', 'netus', 'nibh', 'nisi', 'nisl', 'nostra', 'nulla', 'nullam', 'nunc', 'odio', 'orci', 'ornare', 'parturient', 'pellentesque', 'penatibus', 'pharetra', 'phasellus', 'placerat', 'platea', 'porta', 'porttitor', 'posuere', 'potenti', 'praesent', 'pretium', 'primis', 'proin', 'pulvinar', 'purus', 'quam', 'quis', 'quisque', 'rhoncus', 'ridiculus', 'risus', 'rutrum', 'sagittis', 'sapien', 'scelerisque', 'semper', 'senectus', 'sociis', 'sociosqu', 'sodales', 'sollicitudin', 'suscipit', 'suspendisse', 'taciti', 'tellus', 'tempor', 'tempus', 'tincidunt', 'torquent', 'tortor', 'tristique', 'turpis', 'ullamcorper', 'ultrices', 'ultricies', 'urna', 'varius', 'vehicula', 'velit', 'venenatis', 'vestibulum', 'vitae', 'vivamus', 'viverra', 'volutpat', 'vulputate'];
    for ind_ in 1 .. quantity_ loop
      ind_ := ( random() * ( array_upper( words_, 1 ) - 1 ) )::integer + 1;
      returnValue_ := returnValue_ || ' ' || words_[ind_];
    end loop;
    return returnValue_;
  end;
$$;

-- ======================================================================
-- ============================== USERS =================================
-- ======================================================================

do $$
declare
	i int;
	num_users int = 100;
	current_id uuid;
	current_email text;
	current_username text;
	current_bio text;
	current_avatar text;
	current_firstname text;
	current_lastname text;
	_now timestamp;
begin
	for i in 1..num_users loop
		current_id := (select gen_random_uuid());
		current_email := (CONCAT('demo', i::text, '@example.com'));
		current_username := (CONCAT('demo', i::text));
		current_avatar :=(CONCAT('https://avatars.dicebear.com/api/identicon/', current_id, '.svg'));
		current_firstname := (select lorem(1));
		current_lastname := (select lorem(1));
		_now := current_timestamp;

		-- insert demo_user to auth.users
		insert into auth.users (
			instance_id,
			id,
			aud,"role",email,
			encrypted_password,
			email_confirmed_at, last_sign_in_at,
			raw_app_meta_data, 
			raw_user_meta_data,
			is_super_admin,
			created_at, updated_at,
			phone, phone_confirmed_at, 
			confirmation_token, email_change, email_change_token_new, recovery_token
		) 
		values (
			'00000000-0000-0000-0000-000000000000'::uuid,
			current_id,
			'authenticated','authenticated', current_email,    
			crypt(CONCAT('password', i::text), gen_salt('bf')),
			current_timestamp, current_timestamp,
			'{"provider":"email","providers":["email"]}',
			format (
				'{"username":"%s","firstname":"%s","lastname":"%s","avatar":"%s"}',
				current_username, current_firstname, current_lastname, current_avatar
			)::jsonb,
			false,
			_now, _now,
			null,null,
			'','','',''
		)
		on conflict (id) do nothing;

		insert into auth.identities (id,user_id,identity_data,provider,last_sign_in_at,created_at,updated_at) 
		values
			(
				current_id,
				current_id,
				format('{"sub":"%s"}', current_id)::jsonb,
				'email',current_timestamp,current_timestamp,current_timestamp)
		ON CONFLICT (id, provider) DO NOTHING;

	end loop;
end $$;

-- ======================================================================
-- ============================= CLEANUP ================================
-- ======================================================================

drop function rnum;
drop function lorem;