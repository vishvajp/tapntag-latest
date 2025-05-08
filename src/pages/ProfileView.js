import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "../Css/ProfileDisplay.css";

function ProfileView() {
  const { profileId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get profile data from localStorage
    const storedProfile = localStorage.getItem("profileData");
    if (storedProfile) {
      const profileData = JSON.parse(storedProfile);
      setProfile(profileData);
    } else {
      setError("Profile not found");
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !profile) {
    return (
      <Container className="py-5">
        <Card>
          <Card.Body className="text-center">
            <h2>Profile Not Found</h2>
            <p>{error || "The requested profile could not be found."}</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // Check if this is a business-only view
  const isBusinessView = profileId.endsWith("-business");

  return (
    <Container fluid className="p-5 pro-display-main-bg">
      <h2 className="text-center mb-4 text-white">
        {isBusinessView ? "Business Profile" : "Full Profile"}
      </h2>

      {/* Business Details - Always shown */}
      <Card className="mb-4">
        <Card.Header className="pro-display-card-header">
          Business Details
        </Card.Header>
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
                  {biz.facebookUrl && <p>Facebook: {biz.facebookUrl}</p>}
                  {biz.instagramUrl && <p>Instagram: {biz.instagramUrl}</p>}
                  {biz.linkedinUrl && <p>LinkedIn: {biz.linkedinUrl}</p>}
                  {biz.twitterUrl && <p>Twitter: {biz.twitterUrl}</p>}
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Only show these sections if it's a full profile view */}
      {!isBusinessView && (
        <>
          {/* Personal Details */}
          <Card className="mb-4">
            <Card.Header className="pro-display-card-header">
              Personal Details
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p>
                    <strong>First Name:</strong>{" "}
                    {profile.personalDetails.firstName}
                  </p>
                  <p>
                    <strong>Last Name:</strong>{" "}
                    {profile.personalDetails.lastName}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong>{" "}
                    {profile.personalDetails.dob}
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
                  {profile.socialProfiles.facebook && (
                    <p>
                      <strong>Facebook:</strong>{" "}
                      {profile.socialProfiles.facebook}
                    </p>
                  )}
                  {profile.socialProfiles.instagram && (
                    <p>
                      <strong>Instagram:</strong>{" "}
                      {profile.socialProfiles.instagram}
                    </p>
                  )}
                </Col>
                <Col md={6}>
                  {profile.socialProfiles.linkedin && (
                    <p>
                      <strong>LinkedIn:</strong>{" "}
                      {profile.socialProfiles.linkedin}
                    </p>
                  )}
                  {profile.socialProfiles.twitter && (
                    <p>
                      <strong>Twitter:</strong> {profile.socialProfiles.twitter}
                    </p>
                  )}
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
                    <h5 className="pro-display-h5">
                      Work Experience {index + 1}
                    </h5>
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
        </>
      )}
    </Container>
  );
}

export default ProfileView;
