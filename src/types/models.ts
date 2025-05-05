export type User = {
    id: string,
    name: string,
    email: string,
    image_url: string,
    created_at: string,
    role: 'superuser'|'user'
}   

export type Venture = {
    id: string,
    name: string,
    description: string,
    image_url: string,
    v_token_amount: number,
    end_date: string,
    category: string,
    created_at: string,
    members: User[]
}    

export type UserToVenture = {
    user_id: string,
    venture_id: string,
    role: 'owner' | 'member',
    created_at: string
}   

export interface Contract {
    id: string,
    pulse_id: string,
    holder: User,
    initiator: User,
    backers: User[],
    description: string,
    conversion_rate: number,
    required_v_tokens_amount: number,
    a_tokens_granted: number,
    value_in_currency: number,
    status: 'new'|'assigned'|'pending_beckers'|'pending_multi_sigs'|'activated'|'terminated'|'completed'|'cancelled',
    type: 'resource'|'labor',
    buffer_time: number,
    completed_date: Date,
    due_date: Date,
    created_at: Date,
}   