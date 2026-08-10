export enum RefundStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
}

export enum RefundSource {
    ORDER_CANCELLATION = "ORDER_CANCELLATION",
    RETURN = "RETURN",
    MANUAL = "MANUAL",
}