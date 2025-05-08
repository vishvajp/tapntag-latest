import React, { useState } from 'react';
import { NavDropdown, Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../Css/ProfileDropdown.css';

function ProfileDropdown() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem('userData');
    return stored ? JSON.parse(stored) : null;
  });
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    email: userData?.email || ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const handleEdit = () => {
    setShowProfile(false);
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await api.patch('/auth/profile', formData);
      if (response.success) {
        setUserData(response.user);
        localStorage.setItem('userData', JSON.stringify(response.user));
        setSuccess('Profile updated successfully');
        setShowEditModal(false);
      }
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    }
  };

  return (
    <>
      <NavDropdown
        title={
          <div className="d-inline-flex align-items-center">
            <i className="fas fa-user-circle fa-lg me-2"></i>
            {userData?.firstName}
          </div>
        }
        id="profile-dropdown"
        align="end"
      >
        <NavDropdown.Item onClick={() => setShowProfile(true)}>
          <i className="fas fa-user me-2"></i>View Profile
        </NavDropdown.Item>
        <NavDropdown.Item onClick={handleEdit}>
          <i className="fas fa-edit me-2"></i>Edit Profile
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={handleLogout}>
          <i className="fas fa-sign-out-alt me-2"></i>Sign Out
        </NavDropdown.Item>
      </NavDropdown>

      {/* Profile View Modal */}
      <Modal show={showProfile} onHide={() => setShowProfile(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Profile Information</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <div className="mb-3">
            <strong className='pro-display-text'>Name:</strong> <span className="pro-value-text">{userData?.firstName} {userData?.lastName}</span>
          </div>
          <div className="mb-3">
            <strong className='pro-display-text'>Email:</strong><span className="pro-value-text"> {userData?.email}</span>
          </div>
          <div className="mb-3">
            <strong className='pro-display-text'>Phone:</strong><span className="pro-value-text"> {userData?.phoneNumber}</span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfile(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Edit Profile
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateProfile}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            {error && <div className="text-danger mb-3">{error}</div>}
            {success && <div className="text-success mb-3">{success}</div>}

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ProfileDropdown; 