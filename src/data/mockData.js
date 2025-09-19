// Mock data for the prototype - will be replaced with real API calls

export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@kmrl.kerala.gov.in',
    department: 'Administration',
    active: true,
    createdAt: '2024-01-15',
    lastLogin: '2024-01-20T10:30:00Z'
  },
  {
    id: 2,
    username: 'employee',
    password: 'emp123',
    role: 'employee',
    name: 'Priya Nair',
    email: 'priya.nair@kmrl.kerala.gov.in',
    department: 'Operations',
    active: true,
    createdAt: '2024-01-10',
    lastLogin: '2024-01-20T09:15:00Z'
  },
  {
    id: 3,
    username: 'john.doe',
    password: 'john123',
    role: 'employee',
    name: 'John Doe',
    email: 'john.doe@kmrl.kerala.gov.in',
    department: 'Maintenance',
    active: true,
    createdAt: '2024-01-12',
    lastLogin: '2024-01-19T14:20:00Z'
  },
  {
    id: 4,
    username: 'sarah.thomas',
    password: 'sarah123',
    role: 'employee',
    name: 'Sarah Thomas',
    email: 'sarah.thomas@kmrl.kerala.gov.in',
    department: 'Human Resources',
    active: false,
    createdAt: '2024-01-08',
    lastLogin: '2024-01-18T11:45:00Z'
  }
];

export const mockDocuments = [
  {
    id: 1,
    title: 'Safety Protocol Manual - Updated Version 3.2',
    category: 'Safety & Compliance',
    uploadedBy: 'Ravi Kumar',
    uploadedAt: '2024-01-15T10:30:00Z',
    status: 'approved',
    assignedTo: [2, 3], // Employee IDs
    summary: 'Updated safety protocols for metro operations including new emergency procedures and passenger safety guidelines. Key changes include enhanced crowd management strategies and updated evacuation procedures.',
    extractedText: 'This document outlines the comprehensive safety protocols for Kochi Metro Rail operations. It includes detailed procedures for emergency situations, passenger safety measures, crowd control during peak hours, and updated evacuation protocols. The document also covers new safety equipment requirements and training procedures for all staff members.',
    fileUrl: '/docs/safety-protocol-v3.2.pdf',
    priority: 'high',
    deadline: '2024-01-25',
    malayalamTranslation: 'കൊച്ചി മെട്രോ റെയിൽ പ്രവർത്തനങ്ങൾക്കായുള്ള പുതുക്കിയ സുരക്ഷാ പ്രോട്ടോക്കോളുകൾ. പുതിയ അടിയന്തര നടപടിക്രമങ്ങളും യാത്രക്കാരുടെ സുരക്ഷാ നിർദ്ദേശങ്ങളും ഉൾപ്പെടുന്നു.'
  },
  {
    id: 2,
    title: 'Monthly Operations Report - December 2023',
    category: 'Operations',
    uploadedBy: 'System Auto',
    uploadedAt: '2024-01-08T09:00:00Z',
    status: 'under_review',
    assignedTo: [2],
    summary: 'Comprehensive monthly operations report covering ridership statistics, maintenance activities, and performance metrics for December 2023.',
    extractedText: 'December 2023 Operations Summary: Total ridership: 2.3M passengers, Average daily ridership: 74,200, On-time performance: 96.8%, System availability: 99.2%. Key achievements include successful implementation of new ticketing system and completion of quarterly maintenance schedule.',
    fileUrl: '/docs/operations-dec-2023.pdf',
    priority: 'medium',
    deadline: '2024-01-20',
    malayalamTranslation: 'ഡിസംബർ 2023-ലെ സമഗ്ര മാസിക പ്രവർത്തന റിപ്പോർട്ട്. യാത്രക്കാരുടെ സംഖ്യ, പരിപാലന പ്രവർത്തനങ്ങൾ, പ്രകടന മെട്രിക്സ് എന്നിവ ഉൾപ്പെടുന്നു.'
  },
  {
    id: 3,
    title: 'Staff Training Module - Customer Service',
    category: 'Human Resources',
    uploadedBy: 'HR Department',
    uploadedAt: '2024-01-10T14:15:00Z',
    status: 'approved',
    assignedTo: [2, 3, 4],
    summary: 'Customer service training materials for metro staff, covering communication skills, problem resolution, and passenger assistance protocols.',
    extractedText: 'This training module focuses on enhancing customer service skills for all customer-facing metro staff. Topics include effective communication techniques, handling customer complaints, assisting passengers with disabilities, and emergency customer support procedures.',
    fileUrl: '/docs/training-customer-service.pdf',
    priority: 'medium',
    deadline: '2024-02-01',
    malayalamTranslation: 'മെട്രോ ജീവനക്കാർക്കുള്ള ഉപഭോക്തൃ സേവന പരിശീലന സാമഗ്രികൾ. ആശയവിനിമയ കഴിവുകൾ, പ്രശ്‌ന പരിഹാരം, യാത്രക്കാരുടെ സഹായ പ്രോട്ടോക്കോളുകൾ എന്നിവ ഉൾക്കൊള്ളുന്നു.'
  },
  {
    id: 4,
    title: 'Technical Maintenance Schedule - Q1 2024',
    category: 'Maintenance',
    uploadedBy: 'Maintenance Team',
    uploadedAt: '2024-01-12T11:20:00Z',
    status: 'pending',
    assignedTo: [3],
    summary: 'First quarter maintenance schedule for metro operations including rolling stock maintenance, track inspection, and system upgrades.',
    extractedText: 'Q1 2024 maintenance activities include comprehensive rolling stock inspections, track geometry surveys, signal system updates, and preventive maintenance for escalators and elevators. Schedule includes daily, weekly, and monthly maintenance tasks.',
    fileUrl: '/docs/maintenance-q1-2024.pdf',
    priority: 'high',
    deadline: '2024-01-30',
    malayalamTranslation: 'മെട്രോ പ്രവർത്തനങ്ങൾക്കുള്ള ആദ്യ പാദ പരിപാലന ഷെഡ്യൂൾ. റോളിംഗ് സ്റ്റോക്ക് മെയിന്റനൻസ്, ട്രാക്ക് പരിശോധന, സിസ്റ്റം അപ്‌ഗ്രേഡുകൾ എന്നിവ ഉൾപ്പെടുന്നു.'
  }
];

export const mockAlerts = [
  {
    id: 1,
    title: 'Safety Drill Reminder',
    message: 'Monthly safety drill scheduled for January 20th at 10:00 AM. All staff must participate.',
    priority: 'high',
    category: 'Safety',
    createdAt: '2024-01-15T09:00:00Z',
    read: false,
    deadline: '2024-01-20T10:00:00Z'
  },
  {
    id: 2,
    title: 'System Maintenance Window',
    message: 'Scheduled system maintenance on January 22nd from 2:00 AM to 4:00 AM. Limited services during this period.',
    priority: 'medium',
    category: 'Operations',
    createdAt: '2024-01-14T16:30:00Z',
    read: false,
    deadline: '2024-01-22T02:00:00Z'
  },
  {
    id: 3,
    title: 'Compliance Deadline Approaching',
    message: 'Environmental compliance report submission deadline is January 25th. Please ensure all documentation is complete.',
    priority: 'high',
    category: 'Compliance',
    createdAt: '2024-01-13T14:20:00Z',
    read: true,
    deadline: '2024-01-25T23:59:00Z'
  },
  {
    id: 4,
    title: 'Training Session Update',
    message: 'Customer service training session rescheduled to January 28th at 2:00 PM in Conference Room A.',
    priority: 'low',
    category: 'Training',
    createdAt: '2024-01-12T10:15:00Z',
    read: false,
    deadline: '2024-01-28T14:00:00Z'
  }
];

export const mockAnalytics = {
  totalDocuments: 156,
  pendingReviews: 23,
  approvedToday: 8,
  totalUsers: 45,
  documentsThisMonth: 34,
  averageProcessingTime: '2.3 days',
  systemUptime: '99.8%',
  monthlyGrowth: 12
};

// Helper functions for mock API simulation
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authenticateUser = async (username, password, role) => {
  await delay(1000); // Simulate API delay
  
  const user = mockUsers.find(u => 
    u.username === username && 
    u.password === password && 
    u.role === role &&
    u.active
  );
  
  if (user) {
    const token = `mock_token_${user.id}_${Date.now()}`;
    return { user: { ...user, password: undefined }, token };
  }
  
  throw new Error('Invalid credentials');
};

export const getDocumentsForUser = async (userId, role) => {
  await delay(500);
  
  if (role === 'admin') {
    return mockDocuments;
  } else {
    return mockDocuments.filter(doc => doc.assignedTo.includes(userId));
  }
};

export const uploadDocument = async (documentData) => {
  await delay(1500); // Simulate upload time
  
  const newDocument = {
    id: mockDocuments.length + 1,
    ...documentData,
    uploadedAt: new Date().toISOString(),
    status: 'pending',
    extractedText: 'This is extracted text from the uploaded document. In a real implementation, this would be processed by OCR or document processing services.',
    summary: 'Auto-generated summary of the uploaded document content. This would be created by AI processing in the actual system.',
    malayalamTranslation: 'അപ്‌ലോഡ് ചെയ്ത ഡോക്യുമെന്റിന്റെ മലയാളം പരിഭാഷ. യഥാർത്ഥ സിസ്റ്റത്തിൽ ഇത് AI വിവർത്തനം വഴി സൃഷ്ടിക്കപ്പെടും.'
  };
  
  mockDocuments.push(newDocument);
  return newDocument;
};

export const addEmployee = async (employeeData) => {
  await delay(800);
  
  const newEmployee = {
    id: mockUsers.length + 1,
    ...employeeData,
    role: 'employee',
    active: true,
    createdAt: new Date().toISOString().split('T')[0],
    lastLogin: null
  };
  
  mockUsers.push(newEmployee);
  return newEmployee;
};

export const removeEmployee = async (employeeId) => {
  await delay(500);
  
  const index = mockUsers.findIndex(u => u.id === employeeId);
  if (index > -1) {
    mockUsers.splice(index, 1);
    return true;
  }
  
  throw new Error('Employee not found');
};