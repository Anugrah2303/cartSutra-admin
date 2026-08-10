export enum PayoutStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REJECTED = "REJECTED",
}

export enum PayoutMethod {
    BANK_TRANSFER = "BANK_TRANSFER",
    UPI = "UPI",
}