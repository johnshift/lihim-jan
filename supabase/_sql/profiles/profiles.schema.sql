create table profiles (
	user_id uuid references auth.users (id) on delete cascade,
	username text unique not null,
	avatar text not null,
	firstname text not null,
	lastname text not null,
	bio text,
	primary key (user_id)
);

alter table profiles enable row level security;

create policy "Profiles are visible to everyone"
	on profiles for select
	using ( true );

create policy "Profiles can only be updated by owner"
	on profiles for update
	using ( 
		auth.uid() = user_id
	);