import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge } from 'react-bootstrap';
import api from '../services/api';
import '../Css/UserOrders.css';

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'warning',
      confirmed: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'danger'
    };

    return (
      <Badge bg={statusColors[status] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <h3>Loading orders...</h3>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container className="text-center py-5">
        <h3>No orders found</h3>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">My Orders</h2>
      {orders.map((order) => (
        <Card key={order._id} className="mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Order ID:</strong> {order.orderId}
              <br />
              <small className="text-muted">
                {new Date(order.createdAt).toLocaleDateString()}
              </small>
            </div>
            {getStatusBadge(order.status)}
          </Card.Header>
          <Card.Body>
            {order.items.map((item) => (
              <Row key={item._id} className="mb-3 align-items-center">
                <Col md={2}>
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000'}/vishva/tapntag${item.product.images && item.product.images.length > 0 ? item.product.images[0] : '/placeholder-image.jpg'}`}
                    alt={item.product.name}
                    className="order-item-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                </Col>
                <Col md={6}>
                  <h5 className="mb-1">{item.product.name}</h5>
                  <p className="mb-0 text-muted">Quantity: {item.quantity}</p>
                </Col>
                <Col md={4} className="text-end">
                  <p className="mb-0">₹{(item.price * item.quantity).toFixed(2)}</p>
                </Col>
              </Row>
            ))}
            <hr />
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Shipping Address</h5>
                <p className="mb-0">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  <br />
                  {order.shippingAddress.address}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}
                  <br />
                  Phone: {order.shippingAddress.phone}
                </p>
              </div>
              <div className="text-end">
                <h5 className="mb-0">Total Amount</h5>
                <h4 className="mb-0">₹{order.totalAmount.toFixed(2)}</h4>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

export default UserOrders; 