create table "public"."profiles" (
    "user_id" uuid not null,
    "username" text not null,
    "avatar" text not null,
    "firstname" text not null,
    "lastname" text not null,
    "bio" text
);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (user_id);
CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."profiles" add constraint "profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

alter table "public"."profiles" enable row level security;

create policy "Profiles are visible to everyone"
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Profiles can only be updated by owner"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = user_id));



