package com.project1.backend_spring.dto;

public class ViolationRequest {
    private String result;
    private String plate;
    private String time;
    private String location;
    private double prob;
    private String video_url;
    private String info;

    // 직접 생성 (롬복 에러 방지)
    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }
    public String getPlate() { return plate; }
    public void setPlate(String plate) { this.plate = plate; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public double getProb() { return prob; }
    public void setProb(double prob) { this.prob = prob; }
    public String getVideo_url() { return video_url; }
    public void setVideo_url(String video_url) { this.video_url = video_url; }
    public String getInfo() { return info; }
    public void setInfo(String info) { this.info = info; }
}