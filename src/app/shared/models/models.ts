export interface User {
    uid: string;
    full_name: string;
    email: string;
    accountId: string;
};

export enum AccountTypes {
    agency,
    other
};

export enum EntityStatus {
    active,
    disabled,
    deleted
};

export enum LeadStatus {
    received,
    responsed,
    done
}

export interface Account {
    $key: string;
    business: string;
    phone: string;
    users: number;
    website: string;
    api_key?: string;
    status: boolean;
    account_type: AccountTypes;
    createdAt: Object;
    agencyId: string;
};


export interface Field {
    $key?: string;
    name: string;
    type: string;
}

export interface Form {
    $key: string;
    name: string;
    status: EntityStatus;
    leads: number;
};


export interface Person {
    $key: string;
    name: string;
    email: string;
    data: Object;
}

export interface Lead {
    $key: string;
    formKey: string;
    personKey: string;
    data: Object;
    status?: LeadStatus
    person?: Person;
    proposal?: Proposal;
    revenue?: Revenue;
    createdAt?: Object;
}

export interface Proposal {
    $key: string;
    leadKey: string;
    price: number;
    description: string;
    closed: boolean;
    createdAt: Object;
}

export interface Revenue {
    $key:string;
    createdAt: Object;
    price: number;
    closed: boolean;
}