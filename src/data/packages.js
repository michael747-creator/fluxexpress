// Mock package data for FluxExpress delivery tracking

export const packagesData = [
    {
        id: 1,
        trackingCode: "FX-2024-001",
        sender: {
            name: "John Smith",
            address: "123 Main St, New York, NY 10001",
        },
        recipient: {
            name: "Alice Johnson",
            address: "456 Oak Ave, Los Angeles, CA 90001",
            phone: "+1 (555) 234-5678",
        },
        description: "Electronics - Laptop",
        weight: "2.5 kg",
        estimatedDelivery: "April 25, 2026",
        currentStatus: "in_transit",
        events: [
            {
                status: "picked_up",
                label: "Picked Up",
                description: "Package picked up by FluxExpress courier.",
                location: "New York, NY",
                timestamp: "April 20, 2026 - 02:30 PM",
                completed: true,
            },
            {
                status: "in_transit",
                label: "In Transit",
                description: "Package is on its way to the destination city.",
                location: "Philadelphia, PA",
                timestamp: "April 21, 2026 - 08:15 AM",
                completed: true,
            },
            {
                status: "out_for_delivery",
                label: "Out for Delivery",
                description: "Package is out for delivery to the recipient.",
                location: "Los Angeles, CA",
                timestamp: "",
                completed: false,
            },
            {
                status: "delivered",
                label: "Delivered",
                description: "Package has been delivered successfully.",
                location: "Los Angeles, CA",
                timestamp: "",
                completed: false,
            },
        ],
    },
    {
        id: 2,
        trackingCode: "FX-2024-002",
        sender: {
            name: "TechStore Inc.",
            address: "789 Commerce Blvd, Chicago, IL 60601",
        },
        recipient: {
            name: "Bob Williams",
            address: "321 Pine St, Houston, TX 77001",
            phone: "+1 (555) 345-6789",
        },
        description: "Clothing & Accessories",
        weight: "1.2 kg",
        estimatedDelivery: "April 23, 2026",
        currentStatus: "out_for_delivery",
        events: [
            {
                status: "picked_up",
                label: "Picked Up",
                description: "Package picked up by FluxExpress courier.",
                location: "Chicago, IL",
                timestamp: "April 19, 2026 - 03:00 PM",
                completed: true,
            },
            {
                status: "in_transit",
                label: "In Transit",
                description: "Package is on its way to the destination city.",
                location: "Dallas, TX",
                timestamp: "April 20, 2026 - 11:00 AM",
                completed: true,
            },
            {
                status: "out_for_delivery",
                label: "Out for Delivery",
                description: "Package is out for delivery to the recipient.",
                location: "Houston, TX",
                timestamp: "April 21, 2026 - 07:45 AM",
                completed: true,
            },
            {
                status: "delivered",
                label: "Delivered",
                description: "Package has been delivered successfully.",
                location: "Houston, TX",
                timestamp: "",
                completed: false,
            },
        ],
    },
    {
        id: 3,
        trackingCode: "FX-2024-003",
        sender: {
            name: "Sarah Connor",
            address: "555 Elm St, Seattle, WA 98101",
        },
        recipient: {
            name: "Mike Davis",
            address: "888 Maple Dr, Miami, FL 33101",
            phone: "+1 (555) 456-7890",
        },
        description: "Books & Documents",
        weight: "0.8 kg",
        estimatedDelivery: "April 22, 2026",
        currentStatus: "delivered",
        events: [
            {
                status: "picked_up",
                label: "Picked Up",
                description: "Package picked up by FluxExpress courier.",
                location: "Seattle, WA",
                timestamp: "April 17, 2026 - 01:00 PM",
                completed: true,
            },
            {
                status: "in_transit",
                label: "In Transit",
                description: "Package is on its way to the destination city.",
                location: "Atlanta, GA",
                timestamp: "April 19, 2026 - 09:30 AM",
                completed: true,
            },
            {
                status: "out_for_delivery",
                label: "Out for Delivery",
                description: "Package is out for delivery to the recipient.",
                location: "Miami, FL",
                timestamp: "April 21, 2026 - 08:00 AM",
                completed: true,
            },
            {
                status: "delivered",
                label: "Delivered",
                description: "Package has been delivered successfully.",
                location: "Miami, FL",
                timestamp: "April 21, 2026 - 02:15 PM",
                completed: true,
            },
        ],
    },
    {
        id: 4,
        trackingCode: "FX-2024-004",
        sender: {
            name: "Global Mart",
            address: "100 Trade Center, Phoenix, AZ 85001",
        },
        recipient: {
            name: "Emma Wilson",
            address: "200 Sunset Blvd, Denver, CO 80201",
            phone: "+1 (555) 567-8901",
        },
        description: "Home Appliances",
        weight: "5.0 kg",
        estimatedDelivery: "April 27, 2026",
        currentStatus: "picked_up",
        events: [
            {
                status: "picked_up",
                label: "Picked Up",
                description: "Package picked up by FluxExpress courier.",
                location: "Phoenix, AZ",
                timestamp: "April 21, 2026 - 11:30 AM",
                completed: true,
            },
            {
                status: "in_transit",
                label: "In Transit",
                description: "Package is on its way to the destination city.",
                location: "",
                timestamp: "",
                completed: false,
            },
            {
                status: "out_for_delivery",
                label: "Out for Delivery",
                description: "Package is out for delivery to the recipient.",
                location: "",
                timestamp: "",
                completed: false,
            },
            {
                status: "delivered",
                label: "Delivered",
                description: "Package has been delivered successfully.",
                location: "",
                timestamp: "",
                completed: false,
            },
        ],
    },
];

export const getPackageByTrackingCode = (code) => {
    return packagesData.find(
        (pkg) => pkg.trackingCode.toLowerCase() === code.toLowerCase()
    );
};

export const statusLabels = {
    picked_up: "Picked Up",
    out_for_delivery: "Out for Delivery",
    in_transit: "In Transit",
    on_hold: "On Hold",
    custom_clearance: "Custom Clearance",
    delivered: "Delivered",
};

export const statusColors = {
    picked_up: "#0d6efd",
    out_for_delivery: "#0dcaf0",
    in_transit: "#6610f2",
    on_hold: "#ffc107",
    custom_clearance: "#fd7e14",
    delivered: "#198754",
};

// Admin credentials (mock)
export const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "fluxexpress123",
};
