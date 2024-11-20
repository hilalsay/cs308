package edu.sabanciuniv.cs308.model;

public enum OrderStatus {
    PENDING,
    PROCESSING,
    IN_TRANSIT,
    DELIVERED,
    CANCELED;

    public static OrderStatus fromString(String status) {
        if (status != null) {
            status = status.replace("\"", "").trim();
            System.out.println("Received status: '" + status + "'");

            if (status.equalsIgnoreCase("PENDING")) {
                return PENDING;
            } else if (status.equalsIgnoreCase("PROCESSING")) {
                return PROCESSING;
            } else if (status.equalsIgnoreCase("IN_TRANSIT")) {
                return IN_TRANSIT;
            } else if (status.equalsIgnoreCase("DELIVERED")) {
                return DELIVERED;
            } else if (status.equalsIgnoreCase("CANCELED")) {
                return CANCELED;
            } else {
                throw new IllegalArgumentException("Invalid status: " + status);
            }
        }
        throw new IllegalArgumentException("Status cannot be null");
    }

}

