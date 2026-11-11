export const siteConfig = {
    name: "Haarstudio Pauli",
    description: "Willkommen bei Haarstudio Pauli in Deggendorf. Ihr Friseursalon für exzellente Haarschnitte, Colorationen und Styling.",
    url: "https://haarstudio-pauli.de",
    bookingUrl: "https://connect.shore.com/bookings/haarstudio-pauli/services?locale=de",
    address: {
        street: "Östlicher Stadtgraben 32",
        zipcode: "94469",
        city: "Deggendorf"
    },
    contact: {
        phone: "0151 24235034",
        email: "info@haarstudio-pauli.de"
    },
    social: {
        facebook: "https://www.facebook.com/p/Haarstudio-Pauli-61553966530565/",
        instagram: "https://www.instagram.com/haarstudiopauli/"
    },
    /** Opening hours by weekday (0 = Sunday); `null` = closed. Hours are [open, close) in local time. */
    openingHours: [
        null,
        null,
        [9, 18],
        [9, 18],
        [9, 18],
        [9, 18],
        [8, 13]
    ] as ([number, number] | null)[],
    /** Optional copy – sections stay hidden until the salon fills these in. */
    about: {
        quote: "",
        author: "",
        text: ""
    },
    holidayNote: "",
    directions: [] as { label: string; text: string }[]
};
