package edu.sabanciuniv.cs308.model;

public enum OrderStatus {
    PROCESSING,
    IN_TRANSIT,
    DELIVERED,
    CANCELED;

    public static OrderStatus fromString(String status) {
        for (OrderStatus os : OrderStatus.values()) {
            if (os.name().equalsIgnoreCase(status)) {
                return os;
            }
        }
        throw new IllegalArgumentException("No enum constant for status: " + status);
    }
}

