export type PartnerType = 'VENDOR' | 'CUSTOMER' | 'BOTH';

export interface BusinessPartner {
    id: string;
    code: string;
    name: string;
    type: PartnerType;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
}

export interface CreateBusinessPartnerDTO {
    code: string;
    name: string;
    type: PartnerType;
    address: string;
    phone: string;
    email: string;
}

export interface UpdateBusinessPartnerDTO extends CreateBusinessPartnerDTO {
    id?: string;
}
