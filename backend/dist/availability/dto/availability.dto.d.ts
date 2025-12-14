export declare class CreateAvailabilityDto {
    date: string;
}
export declare class CreateTimeSlotDto {
    startTime: string;
    endTime: string;
    meetLink?: string;
}
export declare class UpdateTimeSlotDto {
    startTime?: string;
    endTime?: string;
    meetLink?: string;
    isBooked?: boolean;
}
