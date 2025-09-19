import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, CheckCircle, Clock, Upload, Eye, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/shared/Layout';
import { mockDocuments, mockUsers, mockAnalytics } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [documents, setDocuments] = useState(mockDocuments);
  const [users, setUsers] = useState(mockUsers);
  const [analytics, setAnalytics] = useState(mockAnalytics);
  const navigate = useNavigate();

  const pendingDocuments = documents.filter(doc => doc.status === 'pending' || doc.status === 'under_review');
  const approvedToday = documents.filter(doc => {
    const today = new Date().toISOString().split('T')[0];
    const docDate = new Date(doc.uploadedAt).toISOString().split('T')[0];
    return doc.status === 'approved' && docDate === today;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'under_review': return 'warning';
      case 'pending': return 'info';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'under_review': return Clock;
      case 'pending': return Clock;
      default: return FileText;
    }
  };

  const headerActions = (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        onClick={() => navigate('/admin/review')}
        className="flex items-center space-x-2"
      >
        <Eye className="w-4 h-4" />
        <span>Review Queue</span>
      </Button>
      <Button onClick={() => navigate('/admin/upload')}>
        <Upload className="w-4 h-4 mr-2" />
        Upload Document
      </Button>
    </div>
  );

  return (
    <Layout
      requiredRole="admin"
      title="Admin Dashboard"
      subtitle="Welcome back! Here's what's happening with your documents."
      headerActions={headerActions}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{analytics.totalDocuments}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                <Clock className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{analytics.pendingReviews}</div>
                <p className="text-xs text-muted-foreground">
                  Requires immediate attention
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{analytics.approvedToday}</div>
                <p className="text-xs text-muted-foreground">
                  +3 from yesterday
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-info" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-info">{analytics.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Active employees
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Reviews */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    <span>Pending Reviews</span>
                  </CardTitle>
                  <CardDescription>Documents waiting for your approval</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/review')}
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingDocuments.slice(0, 3).map((doc, index) => {
                  const StatusIcon = getStatusIcon(doc.status);
                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/admin/review/${doc.id}`)}
                    >
                      <StatusIcon className="w-5 h-5 mt-0.5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1">{doc.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{doc.category}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant={getStatusColor(doc.status) as any} className="text-xs">
                            {doc.status.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            by {doc.uploadedBy}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/upload')}
                >
                  <Upload className="w-4 h-4 mr-3" />
                  Upload New Document
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/users')}
                >
                  <Users className="w-4 h-4 mr-3" />
                  Manage Users
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/review')}
                >
                  <Eye className="w-4 h-4 mr-3" />
                  Review Queue
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/analytics')}
                >
                  <TrendingUp className="w-4 h-4 mr-3" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Overview of system performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success mb-2">{analytics.systemUptime}</div>
                  <p className="text-sm text-muted-foreground">System Uptime</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">{analytics.averageProcessingTime}</div>
                  <p className="text-sm text-muted-foreground">Avg Processing Time</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-info mb-2">{analytics.documentsThisMonth}</div>
                  <p className="text-sm text-muted-foreground">Documents This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;