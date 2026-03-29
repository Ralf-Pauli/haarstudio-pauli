type Category = {
    id: number;
    name: string;
    icon: string;
    services: Services[];
}

type Services = {
    id: number;
    name: string;
    price: number | string;
    sub_services: Services[] | null;
}

type Contact = {
    address: {
        street: string;
        zipcode: string;
        city: string;
        country: string;
    },
    contact: {
        phone: string;
        email: string;
    },
    socialMedia: [
        {
            name: string;
            url: string;
        }
    ],
    openingHours: [{
        days: string,
        hours: string,
        closed: boolean
    }]
}

export type {Category, Services, Contact};