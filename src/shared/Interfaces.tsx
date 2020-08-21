
export interface Pharmacy {
    pharmacy_id: number,
    pharmacy_desc: string,
    gps_latitude: number,
    gps_longitude: number,
    distance: number,
    communication: string,
    country: string,
    creation_date: Date,
    email: string,
    eth_address: string,
    facebook: string,
    icon: string,
    instagram: string,
    locality: string,
    municipality: string,
    nif: string,
    opening_hours: string,
    owner_name: string,
    password: string,
    pharmacy_code: string,
    phone_number: string,
    province: string,
    status: number,
    street: string,
    token: string,
    update_date: Date,
    web: string,
    whatsapp: string,
    zip_code: string,
    address: string,
}

export interface Product {
    item_id: number,
    dose_form: string,
    dose_qty: string,
    leaflet_url: string,
    max_date: Date,
    prescription: boolean,
    price: number,
    product_desc: string,
    product_id: number,
    screen: string,
}

export interface Order {
    chat_id: number,
    creation_date: Date,
    order_id: string,
    order_item: number,
    order_id_app: number,
    pharmacy_desc: string,
    pharmacy_id: number,
    status: number,
    status_desc: string,
    total_price: number,
    unseen: boolean,
    user_id: number,
}

export interface EarnToken {
    earn_desc: string,
    earn_desc_long: string,
    earn_qty: 50,
    id: string,
    photo: string,
    supplier_desc: string,
    validity_end_date: Date,
    validity_start_date: Date,
}

export interface Filter {
    grey: boolean,
    red: boolean,
    yellow: boolean,
    green: boolean
}

export interface Schedule {
    pharmacy_id: 4,
    version: 1,
    active: boolean,
    description: string,
    mon_end_am: string,
    mon_end_pm: string,
    mon_start_am: string,
    mon_start_pm: string,
    tue_end_am: string,
    tue_end_pm: string,
    tue_start_am: string,
    tue_start_pm: string,
    wed_end_am: string,
    wed_end_pm: string,
    wed_start_am: string,
    wed_start_pm: string,
    thu_end_am: string,
    thu_end_pm: string,
    thu_start_am: string,
    thu_start_pm: string,
    fri_end_am: string,
    fri_end_pm: string,
    fri_start_am: string,
    fri_start_pm: string,
    sat_end_am: string,
    sat_end_pm: string,
    sat_start_am: string,
    sat_start_pm: string,
    sun_end_am: string,
    sun_end_pm: string,
    sun_start_am: string,
    sun_start_pm: string,
}

export interface ScheduleOutput {
    result: string[],
    isOpen: boolean,
    day: number
}
