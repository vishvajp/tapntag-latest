import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/image/logo-tap.png";
import "../Css/ProfileCreation.css";

function ProfileCreation() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.state?.editMode || false;
  const existingProfile = location.state?.profileData || null;
  const userData = JSON.parse(localStorage.getItem("userData"));

  const [formData, setFormData] = useState({
    personalDetails: {
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      dob: "",
      age: "",
      phoneNumber: userData?.phoneNumber,
      email: userData?.email,
      profilePhoto: null, // Added profile photo field
    },
    socialProfiles: {
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: "",
    },
    education: [],
    workDetails: [],
    businessDetails: [],
  });

  const [showBusinessDetails, setShowBusinessDetails] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // For image preview

  useEffect(() => {
    if (isEditMode && existingProfile) {
      setFormData(existingProfile);
      if (existingProfile.personalDetails.profilePhoto) {
        // If the profile photo is already a data URL (from localStorage), use it directly
        if (typeof existingProfile.personalDetails.profilePhoto === "string") {
          setPreviewImage(existingProfile.personalDetails.profilePhoto);
        }
        // Otherwise, if it's a File object (from a new upload), create a preview
        else if (existingProfile.personalDetails.profilePhoto instanceof File) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImage(reader.result);
          };
          reader.readAsDataURL(existingProfile.personalDetails.profilePhoto);
        }
      }
    }
  }, [isEditMode, existingProfile]);

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        personalDetails: {
          ...prev.personalDetails,
          profilePhoto: file, // Store the File object
        },
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePersonalDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [name]: value,
      },
    }));
  };

  const handleSocialProfilesChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialProfiles: {
        ...prev.socialProfiles,
        [name]: value,
      },
    }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { school: "", degree: "", year: "", about: "", location: "" },
      ],
    }));
  };

  const removeEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const addWorkDetail = () => {
    setFormData((prev) => ({
      ...prev,
      workDetails: [
        ...prev.workDetails,
        { company: "", position: "", experience: "", about: "", location: "" },
      ],
    }));
  };

  const removeWorkDetail = (index) => {
    setFormData((prev) => ({
      ...prev,
      workDetails: prev.workDetails.filter((_, i) => i !== index),
    }));
  };

  const handleWorkDetailsChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      workDetails: prev.workDetails.map((work, i) =>
        i === index ? { ...work, [field]: value } : work
      ),
    }));
  };

  const addBusinessDetail = () => {
    setFormData((prev) => ({
      ...prev,
      businessDetails: [
        ...prev.businessDetails,
        {
          businessName: "",
          type: "",
          registrationNumber: "",
          about: "",
          location: "",
          facebookUrl: "",
          instagramUrl: "",
          linkedinUrl: "",
          twitterUrl: "",
        },
      ],
    }));
  };

  const removeBusinessDetail = (index) => {
    setFormData((prev) => ({
      ...prev,
      businessDetails: prev.businessDetails.filter((_, i) => i !== index),
    }));
  };

  const handleBusinessDetailsChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      businessDetails: prev.businessDetails.map((biz, i) =>
        i === index ? { ...biz, [field]: value } : biz
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a copy of formData to modify
    const dataToSave = JSON.parse(JSON.stringify(formData));

    // If there's a profile photo, replace the File object with the preview URL
    if (dataToSave.personalDetails.profilePhoto instanceof File) {
      dataToSave.personalDetails.profilePhoto = previewImage;
    }

    // Save profile data to localStorage
    localStorage.setItem("profileData", JSON.stringify(dataToSave));
    navigate("/profile-display");
  };

  return (
    <Container fluid className="p-5 profile-creation-container">
      <Card style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
        <Card.Body>
          <div className="d-flex justify-content-center mb-3">
            <div className="profile-creation-logo-div">
              <img src={logo} className="img-fluid"></img>
            </div>
          </div>
          <h3 className="text-center mb-4" style={{ color: "white" }}>
            {isEditMode
              ? "Edit Your TapNTag Profile"
              : "Create Your TapNTag Profile"}
          </h3>
          <Form onSubmit={handleSubmit}>
            {/* Personal Details */}
            <Card className="mb-4">
              <Card.Header>Personal Details</Card.Header>
              <Card.Body>
                <Row className="mb-4">
                  <Col
                    md={12}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <div className="me-3">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Profile preview"
                          style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                            backgroundColor: "#f0f0f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          No Photo
                        </div>
                      )}
                    </div>
                    <Form.Group>
                      <Form.Label>Profile Photo</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePhotoChange}
                      />
                      <Form.Text muted>
                        Upload a square image for best results
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.personalDetails.firstName}
                        onChange={handlePersonalDetailsChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.personalDetails.lastName}
                        onChange={handlePersonalDetailsChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="dob"
                        value={formData.personalDetails.dob}
                        onChange={handlePersonalDetailsChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Age</Form.Label>
                      <Form.Control
                        type="number"
                        name="age"
                        value={formData.personalDetails.age}
                        onChange={handlePersonalDetailsChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phoneNumber"
                        value={formData.personalDetails.phoneNumber}
                        onChange={handlePersonalDetailsChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.personalDetails.email}
                        onChange={handlePersonalDetailsChange}
                      />
                    </Form.Group>
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
                    <Form.Group className="mb-3">
                      <Form.Label>Facebook URL</Form.Label>
                      <Form.Control
                        type="url"
                        name="facebook"
                        placeholder="https://facebook.com/username"
                        value={formData.socialProfiles.facebook}
                        onChange={handleSocialProfilesChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Instagram URL</Form.Label>
                      <Form.Control
                        type="url"
                        name="instagram"
                        placeholder="https://instagram.com/username"
                        value={formData.socialProfiles.instagram}
                        onChange={handleSocialProfilesChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>LinkedIn URL</Form.Label>
                      <Form.Control
                        type="url"
                        name="linkedin"
                        placeholder="https://linkedin.com/in/username"
                        value={formData.socialProfiles.linkedin}
                        onChange={handleSocialProfilesChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Twitter/X URL</Form.Label>
                      <Form.Control
                        type="url"
                        name="twitter"
                        placeholder="https://twitter.com/username"
                        value={formData.socialProfiles.twitter}
                        onChange={handleSocialProfilesChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Education Details */}
            <Card className="mb-4">
              <Card.Header>
                Education Details
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="float-end"
                  onClick={addEducation}
                >
                  Add Education
                </Button>
              </Card.Header>
              <Card.Body>
                {formData.education.map((edu, index) => (
                  <div key={index} className="mb-4">
                    <Row className="mb-3 align-items-center">
                      <Col md={11}>
                        <Row>
                          <Col md={3}>
                            <Form.Group>
                              <Form.Label>School/College</Form.Label>
                              <Form.Control
                                type="text"
                                value={edu.school}
                                onChange={(e) =>
                                  handleEducationChange(
                                    index,
                                    "school",
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group>
                              <Form.Label>Degree</Form.Label>
                              <Form.Control
                                type="text"
                                value={edu.degree}
                                onChange={(e) =>
                                  handleEducationChange(
                                    index,
                                    "degree",
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group>
                              <Form.Label>Year</Form.Label>
                              <Form.Control
                                type="text"
                                value={edu.year}
                                onChange={(e) =>
                                  handleEducationChange(
                                    index,
                                    "year",
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group>
                              <Form.Label>Location</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="City, Country"
                                value={edu.location}
                                onChange={(e) =>
                                  handleEducationChange(
                                    index,
                                    "location",
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                      <Col md={1}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="mt-4"
                          onClick={() => removeEducation(index)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>About this education</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            value={edu.about}
                            onChange={(e) =>
                              handleEducationChange(
                                index,
                                "about",
                                e.target.value
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                ))}
              </Card.Body>
            </Card>

            {/* Work Details */}
            <Card className="mb-4">
              <Card.Header>
                Work Details
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="float-end"
                  onClick={addWorkDetail}
                >
                  Add Work
                </Button>
              </Card.Header>
              <Card.Body>
                {formData.workDetails.map((work, index) => (
                  <div key={index} className="mb-4">
                    <Row className="mb-3 align-items-center">
                      <Col md={2}>
                        <Form.Group>
                          <Form.Label>Company</Form.Label>
                          <Form.Control
                            type="text"
                            value={work.company}
                            onChange={(e) =>
                              handleWorkDetailsChange(
                                index,
                                "company",
                                e.target.value
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group>
                          <Form.Label>Position</Form.Label>
                          <Form.Control
                            type="text"
                            value={work.position}
                            onChange={(e) =>
                              handleWorkDetailsChange(
                                index,
                                "position",
                                e.target.value
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group>
                          <Form.Label>Experience (years)</Form.Label>
                          <Form.Control
                            type="number"
                            value={work.experience}
                            onChange={(e) =>
                              handleWorkDetailsChange(
                                index,
                                "experience",
                                e.target.value
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group>
                          <Form.Label>Location</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="City, Country"
                            value={work.location}
                            onChange={(e) =>
                              handleWorkDetailsChange(
                                index,
                                "location",
                                e.target.value
                              )
                            }
                          />
                        </Form.Group>
                      </Col>

                      <Col md={1}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="mt-4"
                          onClick={() => removeWorkDetail(index)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>About this work experience</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            value={work.about}
                            onChange={(e) =>
                              handleWorkDetailsChange(
                                index,
                                "about",
                                e.target.value
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                ))}
              </Card.Body>
            </Card>

            {/* Business Details */}
            <Card className="mb-4">
              <Card.Header>
                Business Details
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="float-end"
                  onClick={addBusinessDetail}
                >
                  Add Business
                </Button>
              </Card.Header>
              <Card.Body>
                {formData.businessDetails.map((biz, index) => (
                  <div key={index} className="mb-4">
                    <Row className="mb-3 align-items-center">
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Business Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Business Name"
                            value={biz.businessName}
                            onChange={(e) =>
                              handleBusinessDetailsChange(
                                index,
                                "businessName",
                                e.target.value
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Business Type</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Business Type"
                            value={biz.type}
                            onChange={(e) =>
                              handleBusinessDetailsChange(
                                index,
                                "type",
                                e.target.value
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Registration Number</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Registration Number"
                            value={biz.registrationNumber}
                            onChange={(e) =>
                              handleBusinessDetailsChange(
                                index,
                                "registrationNumber",
                                e.target.value
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group>
                          <Form.Label>Location</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="City, Country"
                            value={biz.location}
                            onChange={(e) =>
                              handleBusinessDetailsChange(
                                index,
                                "location",
                                e.target.value
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={1}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="mt-3"
                          onClick={() => removeBusinessDetail(index)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Facebook URL</Form.Label>
                          <Form.Control
                            type="url"
                            placeholder="https://facebook.com/business"
                            value={biz.facebookUrl}
                            onChange={(e) =>
                              handleBusinessDetailsChange(
                                index,
                                "facebookUrl",
                                e.target.value
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Instagram URL</Form.Label>
                          <Form.Control
                            type="url"
                            placeholder="https://instagram.com/business"
                            value={biz.instagramUrl}
                            onChange={(e) =>
                              handleBusinessDetailsChange(
                                index,
                                "instagramUrl",
                                e.target.value
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>LinkedIn URL</Form.Label>
                          <Form.Control
                            type="url"
                            placeholder="https://linkedin.com/company/business"
                            value={biz.linkedinUrl}
                            onChange={(e) =>
                              handleBusinessDetailsChange(
                                index,
                                "linkedinUrl",
                                e.target.value
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Twitter/X URL</Form.Label>
                          <Form.Control
                            type="url"
                            placeholder="https://twitter.com/business"
                            value={biz.twitterUrl}
                            onChange={(e) =>
                              handleBusinessDetailsChange(
                                index,
                                "twitterUrl",
                                e.target.value
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>About this business</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            value={biz.about}
                            onChange={(e) =>
                              handleBusinessDetailsChange(
                                index,
                                "about",
                                e.target.value
                              )
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                ))}
              </Card.Body>
            </Card>

            <Button variant="primary" type="submit" className="w-100">
              {isEditMode ? "Update Profile" : "Create Profile"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProfileCreation;
