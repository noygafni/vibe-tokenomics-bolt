-- Drop existing view if it exists
drop view if exists venture_members_with_profiles;

-- Create improved views for better data access
create or replace view venture_details as
select 
  v.*,
  json_agg(distinct jsonb_build_object(
    'user_id', vm.user_id,
    'role', vm.role,
    'v_tokens', vm.v_tokens,
    'a_tokens', vm.a_tokens,
    'initial_tokens', vm.initial_tokens,
    'full_name', p.full_name,
    'avatar_url', p.avatar_url
  )) filter (where vm.user_id is not null) as members,
  json_agg(distinct jsonb_build_object(
    'id', sc.id,
    'name', sc.name,
    'description', sc.description,
    'v_tokens', sc.v_tokens,
    'end_date', sc.end_date,
    'exchange_date', sc.exchange_date,
    'owner_id', sc.owner_id,
    'signed_at', sc.signed_at,
    'created_at', sc.created_at,
    'updated_at', sc.updated_at,
    'funders', (
      select json_agg(jsonb_build_object(
        'user_id', cf.user_id,
        'tokens', cf.tokens
      ))
      from contract_funders cf
      where cf.contract_id = sc.id
    )
  )) filter (where sc.id is not null) as smart_contracts
from ventures v
left join venture_members vm on vm.venture_id = v.id
left join profiles p on p.id = vm.user_id
left join smart_contracts sc on sc.venture_id = v.id
group by v.id;

-- Create view for venture members with their profiles
create or replace view venture_members_with_profiles as
select 
  vm.*,
  p.full_name,
  p.avatar_url,
  p.email,
  p.bio
from venture_members vm
join profiles p on p.id = vm.user_id;

-- Add indexes to improve query performance
create index if not exists idx_venture_members_venture_id on venture_members(venture_id);
create index if not exists idx_venture_members_user_id on venture_members(user_id);
create index if not exists idx_smart_contracts_venture_id on smart_contracts(venture_id);
create index if not exists idx_smart_contracts_owner_id on smart_contracts(owner_id);
create index if not exists idx_contract_funders_contract_id on contract_funders(contract_id);
create index if not exists idx_contract_funders_user_id on contract_funders(user_id);

-- Add foreign key constraints if missing
alter table venture_members
  drop constraint if exists venture_members_venture_id_fkey,
  add constraint venture_members_venture_id_fkey 
    foreign key (venture_id) 
    references ventures(id) 
    on delete cascade;

alter table venture_members
  drop constraint if exists venture_members_user_id_fkey,
  add constraint venture_members_user_id_fkey 
    foreign key (user_id) 
    references profiles(id) 
    on delete cascade;

alter table smart_contracts
  drop constraint if exists smart_contracts_venture_id_fkey,
  add constraint smart_contracts_venture_id_fkey 
    foreign key (venture_id) 
    references ventures(id) 
    on delete cascade;

alter table smart_contracts
  drop constraint if exists smart_contracts_owner_id_fkey,
  add constraint smart_contracts_owner_id_fkey 
    foreign key (owner_id) 
    references profiles(id) 
    on delete cascade;

alter table contract_funders
  drop constraint if exists contract_funders_contract_id_fkey,
  add constraint contract_funders_contract_id_fkey 
    foreign key (contract_id) 
    references smart_contracts(id) 
    on delete cascade;

alter table contract_funders
  drop constraint if exists contract_funders_user_id_fkey,
  add constraint contract_funders_user_id_fkey 
    foreign key (user_id) 
    references profiles(id) 
    on delete cascade;

-- Update RLS policies
drop policy if exists "Ventures are viewable by everyone" on ventures;
create policy "Ventures are viewable by everyone"
  on ventures for select
  using (true);

drop policy if exists "Venture members are viewable by everyone" on venture_members;
create policy "Venture members are viewable by everyone"
  on venture_members for select
  using (true);

drop policy if exists "Smart contracts are viewable by everyone" on smart_contracts;
create policy "Smart contracts are viewable by everyone"
  on smart_contracts for select
  using (true);

drop policy if exists "Contract funders are viewable by everyone" on contract_funders;
create policy "Contract funders are viewable by everyone"
  on contract_funders for select
  using (true);

-- Enable RLS on all tables
alter table venture_members enable row level security;
alter table smart_contracts enable row level security;
alter table contract_funders enable row level security;