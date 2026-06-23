package com.example.Server.Reports;

import java.util.List;

public class ReportRequest {

    private String description;

    private Integer riskPercentage;

    private String riskLevel;

    private Double lat;

    private Double lng;

    private List<String> imageUrls;

    // getters & setters

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getRiskPercentage() {
        return riskPercentage;
    }

    public void setRiskPercentage(Integer riskPercentage) {
        this.riskPercentage = riskPercentage;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLng() {
        return lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
}