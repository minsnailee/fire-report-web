package com.firemap.backend.dto;

public class ReportDto {
    private double reporterLatitude;
    private double reporterLongitude;
    private double fireLatitude;
    private double fireLongitude;
    private String timestamp;

    public double getReporterLatitude() {
        return reporterLatitude;
    }

    public void setReporterLatitude(double reporterLatitude) {
        this.reporterLatitude = reporterLatitude;
    }

    public double getReporterLongitude() {
        return reporterLongitude;
    }

    public void setReporterLongitude(double reporterLongitude) {
        this.reporterLongitude = reporterLongitude;
    }

    public double getFireLatitude() {
        return fireLatitude;
    }

    public void setFireLatitude(double fireLatitude) {
        this.fireLatitude = fireLatitude;
    }

    public double getFireLongitude() {
        return fireLongitude;
    }

    public void setFireLongitude(double fireLongitude) {
        this.fireLongitude = fireLongitude;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
