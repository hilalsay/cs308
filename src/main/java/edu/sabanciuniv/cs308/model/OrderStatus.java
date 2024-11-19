package edu.sabanciuniv.cs308.model;

public enum OrderStatus {
    PENDING,
    PROCESSING,
    IN_TRANSIT,
    DELIVERED,
    CANCELED;

    public static OrderStatus fromString(String status) {
        if (status != null) {
            return switch (status.toLowerCase()) {
                case "pending" -> PENDING;
                case "processing" -> PROCESSING;
                case "in_transit" -> IN_TRANSIT;
                case "delivered" -> DELIVERED;
                case "canceled" -> CANCELED;
                default ->
                    // Handle invalid value (e.g., default to PENDING or log the issue)
                        PENDING;
            };
        }
        // Default case if status is null
        return PENDING;
    }

}

