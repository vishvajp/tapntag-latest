import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../Css/ProfileDisplay.css";

function ProfileDisplay() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileUrl, setProfileUrl] = useState("");

  useEffect(() => {
    // Get profile data from localStorage
    const storedProfile = localStorage.getItem("profileData");
    if (storedProfile) {
      const profileData = JSON.parse(storedProfile);
      setProfile(profileData);

      // Generate unique profile URL
      const uniqueId =
        profileData.id || Math.random().toString(36).substr(2, 9);
      const firstName = profileData.personalDetails.firstName.toLowerCase();
      const lastName = profileData.personalDetails.lastName.toLowerCase();
      const urlSlug = `${firstName}-${lastName}-${uniqueId}`;
      setProfileUrl(urlSlug);
    }
    setLoading(false);
  }, []);

  const handleEdit = () => {
    navigate("/profile-creation", {
      state: { editMode: true, profileData: profile },
    });
  };

  const handleConfigure = () => {
    // Navigate to NFC configuration page with the unique profile URL
    navigate("/nfc-configuration", {
      state: {
        profileUrl: profileUrl,
        profileData: profile,
      },
    });
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container className="py-5">
        <Card>
          <Card.Body className="text-center">
            <h2>No Profile Found</h2>
            <p>Please create your profile first.</p>
            <Button
              variant="primary"
              onClick={() => navigate("/profile-creation")}
            >
              Create Profile
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid className="p-5 pro-display-main-bg">
      <h2 className="text-center mb-4 text-white ">
        Your Tap<span className="n-gradient-text">N</span>
        <span className="tag-gradient-text">Tag</span> Profile
      </h2>

      {/* Profile URL Display */}
      <Card className="mb-4">
        <Card.Header className="pro-display-card-header">
          Your Profile URL
        </Card.Header>
        <Card.Body>
          <div className="text-center">
            <p className="mb-2">Your unique profile URL:</p>
            <code className="bg-light p-2 rounded">
              {window.location.origin}/profile/{profileUrl}
            </code>
            <p className="mt-2 text-muted">
              This URL will be configured with your NFC tag
            </p>
          </div>
        </Card.Body>
      </Card>

      {/* Personal Details */}
      <Card className="mb-4">
        <Card.Header className="pro-display-card-header">
          Personal Details
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p>
                <strong>First Name:</strong> {profile.personalDetails.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {profile.personalDetails.lastName}
              </p>
              <p>
                <strong>Date of Birth:</strong> {profile.personalDetails.dob}
              </p>
              <p>
                <strong>Age:</strong> {profile.personalDetails.age}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>Phone Number:</strong>{" "}
                {profile.personalDetails.phoneNumber}
              </p>
              <p>
                <strong>Email:</strong> {profile.personalDetails.email}
              </p>
              {profile.personalDetails.profilePhoto && (
                <img
                  src={profile.personalDetails.profilePhoto}
                  alt="Profile"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Social Profiles */}
      <Card className="mb-4">
        <Card.Header>Social Profiles</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p>
                <strong>Facebook:</strong> {profile.socialProfiles.facebook}
              </p>
              <p>
                <strong>Instagram:</strong> {profile.socialProfiles.instagram}
              </p>
            </Col>
            <Col md={6}>
              <p>
                <strong>LinkedIn:</strong> {profile.socialProfiles.linkedin}
              </p>
              <p>
                <strong>Twitter:</strong> {profile.socialProfiles.twitter}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Education Details */}
      <Card className="mb-4">
        <Card.Header>Education Details</Card.Header>
        <Card.Body>
          <Row>
            {profile.education.map((edu, index) => (
              <Col md={6} key={index} className="mb-3">
                <h5 className="pro-display-h5">Education {index + 1}</h5>
                <p>
                  <strong>School/College:</strong> {edu.school}
                </p>
                <p>
                  <strong>Degree:</strong> {edu.degree}
                </p>
                <p>
                  <strong>Year:</strong> {edu.year}
                </p>
                <p>
                  <strong>Location:</strong> {edu.location}
                </p>
                <p>
                  <strong>About:</strong> {edu.about}
                </p>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Work Details */}
      <Card className="mb-4">
        <Card.Header>Work Details</Card.Header>
        <Card.Body>
          <Row>
            {profile.workDetails.map((work, index) => (
              <Col md={6} key={index} className="mb-3">
                <h5 className="pro-display-h5">Work Experience {index + 1}</h5>
                <p>
                  <strong>Company:</strong> {work.company}
                </p>
                <p>
                  <strong>Position:</strong> {work.position}
                </p>
                <p>
                  <strong>Experience:</strong> {work.experience} years
                </p>
                <p>
                  <strong>Location:</strong> {work.location}
                </p>
                <p>
                  <strong>About:</strong> {work.about}
                </p>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Business Details */}
      <Card className="mb-4">
        <Card.Header>Business Details</Card.Header>
        <Card.Body>
          <Row>
            {profile.businessDetails.map((biz, index) => (
              <Col md={6} key={index} className="mb-3">
                <h5 className="pro-display-h5">Business {index + 1}</h5>
                <p>
                  <strong>Business Name:</strong> {biz.businessName}
                </p>
                <p>
                  <strong>Type:</strong> {biz.type}
                </p>
                <p>
                  <strong>Registration Number:</strong> {biz.registrationNumber}
                </p>
                <p>
                  <strong>Location:</strong> {biz.location}
                </p>
                <p>
                  <strong>About:</strong> {biz.about}
                </p>
                <div className="mt-2">
                  <p>
                    <strong>Social Links:</strong>
                  </p>
                  <p>Facebook: {biz.facebookUrl}</p>
                  <p>Instagram: {biz.instagramUrl}</p>
                  <p>LinkedIn: {biz.linkedinUrl}</p>
                  <p>Twitter: {biz.twitterUrl}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Action Buttons */}
      <div className="d-flex justify-content-center gap-3">
        <Button variant="primary" onClick={handleEdit}>
          Edit Profile
        </Button>
        <Button variant="success" onClick={handleConfigure}>
          Configure NFC Tag
        </Button>
      </div>
    </Container>
  );
}

export default ProfileDisplay;
