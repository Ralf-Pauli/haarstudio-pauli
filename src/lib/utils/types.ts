type Category = {
    id: number;
    name: string;
    icon: string;
    services: Services[];
}

type Services = {
    id: number;
    name: string;
    price: number|string;
    sub_services: Services[] | null;
}

export type {Category, Services};