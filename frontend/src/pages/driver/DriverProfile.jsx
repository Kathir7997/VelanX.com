import React from 'react';
import { User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import CustomerProfile from '../customer/CustomerProfile';

// Reuse the profile component
export default function DriverProfile() {
  return <CustomerProfile />;
}
