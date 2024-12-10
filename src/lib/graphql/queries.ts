import { gql } from 'graphql-tag';

export const GET_VENTURE = gql`
  query GetVenture($id: UUID!) {
    ventures_by_pk(id: $id) {
      id
      name
      description
      banner_url
      venture_image
      category
      period_in_months
      total_tokens
      v_token_treasury
      a_token_treasury
      created_at
      updated_at
      venture_members {
        user_id
        role
        v_tokens
        a_tokens
        initial_tokens
        profile: user {
          full_name
          avatar_url
        }
      }
      smart_contracts {
        id
        name
        description
        v_tokens
        end_date
        exchange_date
        owner_id
        signed_at
        created_at
        updated_at
        contract_funders {
          user_id
          tokens
        }
      }
    }
  }
`;

export const GET_VENTURE_MEMBERS = gql`
  query GetVentureMembers($ventureId: UUID!) {
    venture_members(where: { venture_id: { _eq: $ventureId } }) {
      user_id
      role
      v_tokens
      a_tokens
      initial_tokens
      profile: user {
        full_name
        avatar_url
      }
    }
  }
`;

export const CREATE_VENTURE = gql`
  mutation CreateVenture($input: ventures_insert_input!) {
    insert_ventures_one(object: $input) {
      id
      name
      description
      banner_url
      venture_image
      category
      period_in_months
      total_tokens
      v_token_treasury
      a_token_treasury
      created_at
      updated_at
    }
  }
`;

export const UPDATE_VENTURE = gql`
  mutation UpdateVenture($id: UUID!, $input: ventures_set_input!) {
    update_ventures_by_pk(
      pk_columns: { id: $id }
      _set: $input
    ) {
      id
      updated_at
    }
  }
`;