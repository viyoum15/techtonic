import pytest
from app import run_detection_pipeline

def test_bank_otp_phishing_detection():
    sample = "URGENT SECURITY ALERT: Your national savings banking account has been suspended. Click http://bank-secure-auth.cc to verify your 6-digit OTP code."
    result = run_detection_pipeline(sample)
    
    assert result["category"] == "cybercrime_phishing"
    assert result["severity"] == "critical"
    assert result["riskScore"] >= 80
    assert any("OTP" in indicator for indicator in result["matchedIndicators"])

def test_unverified_misinformation_rumor():
    sample = "BREAKING: Central Reserve Bank has ordered an emergency $500 ATM withdrawal cap nationwide starting Friday! Withdraw cash now!"
    result = run_detection_pipeline(sample)
    
    assert result["category"] == "misinformation"
    assert result["riskScore"] >= 60

def test_benign_informational_post():
    sample = "The Department of Transportation published the revised high-speed rail timetable today. Service operates on standard schedules."
    result = run_detection_pipeline(sample)
    
    assert result["category"] == "benign_public"
    assert result["severity"] == "low"
    assert result["riskScore"] < 35
