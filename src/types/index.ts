export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    code?: string;
    timestamp?: string;
    source?: string;
}

export interface Coordinates {
    lat: number;
    lng: number;
}
