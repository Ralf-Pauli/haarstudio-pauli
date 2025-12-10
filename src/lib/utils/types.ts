type Category = {
    id: number;
    name: string;
    icon: string;
    services: Services[];
}

type Services = {
    id: number;
    name: string;
    price: number;
    sub_services: Services[] | null;
}

export type {Category, Services};