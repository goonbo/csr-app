import type { Employee, EmployeeSignals } from '../types';

export const EMPLOYEES: Employee[] = [
  { id: 'u1', name: 'Sarah Chen', dept: 'People Ops', hours: 18 },
  { id: 'u2', name: 'Marcus Lee', dept: 'Engineering', hours: 24 },
  { id: 'u3', name: 'Priya Raman', dept: 'Marketing', hours: 12 },
  { id: 'u4', name: 'Daniel Okonkwo', dept: 'Sales', hours: 6 },
  { id: 'u5', name: 'Jenna Park', dept: 'Engineering', hours: 21 },
];

// Employee survey themes — used by mutual-fit scoring
export const EMPLOYEE_SIGNALS: EmployeeSignals = {
  topCauses: ['Food Security', 'Environment', 'Youth Education'],
  preferredFormat: 'Direct service, half-day',
  remoteShareInterested: 0.34, // 34% of remote workforce expressed interest
};
