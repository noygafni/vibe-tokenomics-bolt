-- Create profiles table to extend auth.users
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique,
  full_name text,
  avatar_url text,
  bio text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create ventures table
create table ventures (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  banner_url text,
  venture_image text,
  category text,
  period_in_months integer default 12,
  total_tokens bigint default 1000000,
  v_token_treasury integer default 20,
  a_token_treasury integer default 15,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users not null
);

-- Create venture_members table (junction table for ventures and users)
create table venture_members (
  venture_id uuid references ventures on delete cascade,
  user_id uuid references auth.users on delete cascade,
  role text not null check (role in ('Founder', 'Co-Creator')),
  v_tokens bigint default 0,
  a_tokens bigint default 0,
  initial_tokens bigint default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (venture_id, user_id)
);

-- Create smart_contracts table
create table smart_contracts (
  id uuid default uuid_generate_v4() primary key,
  venture_id uuid references ventures on delete cascade not null,
  name text not null,
  description text,
  v_tokens bigint not null,
  end_date timestamp with time zone not null,
  exchange_date timestamp with time zone not null,
  owner_id uuid references auth.users not null,
  signed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create contract_funders table
create table contract_funders (
  contract_id uuid references smart_contracts on delete cascade,
  user_id uuid references auth.users on delete cascade,
  tokens bigint not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (contract_id, user_id)
);

-- RLS Policies

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Ventures policies
create policy "Ventures are viewable by everyone"
  on ventures for select
  using ( true );

create policy "Authenticated users can create ventures"
  on ventures for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update own ventures"
  on ventures for update
  using ( auth.uid() = created_by );

create policy "Users can delete own ventures"
  on ventures for delete
  using ( auth.uid() = created_by );

-- Venture members policies
create policy "Venture members are viewable by everyone"
  on venture_members for select
  using ( true );

create policy "Venture owners can manage members"
  on venture_members for all
  using (
    exists (
      select 1 from ventures v
      where v.id = venture_id
      and v.created_by = auth.uid()
    )
  );

-- Smart Contracts policies
create policy "Smart contracts are viewable by everyone"
  on smart_contracts for select
  using ( true );

create policy "Authenticated users can create smart contracts"
  on smart_contracts for insert
  with check ( auth.role() = 'authenticated' );

create policy "Contract owners can update their contracts"
  on smart_contracts for update
  using (
    exists (
      select 1 from ventures v
      where v.id = venture_id
      and v.created_by = auth.uid()
    )
  );

-- Functions and Triggers
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Add updated_at triggers to all relevant tables
create trigger update_ventures_updated_at
  before update on ventures
  for each row execute procedure update_updated_at_column();

create trigger update_profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at_column();

create trigger update_smart_contracts_updated_at
  before update on smart_contracts
  for each row execute procedure update_updated_at_column();