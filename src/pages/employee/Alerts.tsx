import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, X, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/shared/Layout';
import { mockAlerts } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const Alerts = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const { toast } = useToast();

  const unreadAlerts = alerts.filter(alert => !alert.read);
  const readAlerts = alerts.filter(alert => alert.read);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      case 'low': return CheckCircle;
      default: return AlertTriangle;
    }
  };

  const handleMarkAsRead = (alertId: number) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
    
    toast({
      title: "Alert Marked as Read",
      description: "Alert has been marked as read.",
    });
  };

  const handleDismiss = (alertId: number) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
    
    toast({
      title: "Alert Dismissed",
      description: "Alert has been dismissed.",
    });
  };

  return (
    <Layout
      requiredRole="employee"
      title="Alerts"
      subtitle={`${unreadAlerts.length} unread alerts`}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <div>
                  <p className="text-2xl font-bold text-destructive">{unreadAlerts.length}</p>
                  <p className="text-sm text-muted-foreground">Unread</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <p className="text-2xl font-bold text-success">{readAlerts.length}</p>
                  <p className="text-sm text-muted-foreground">Read</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-warning" />
                <div>
                  <p className="text-2xl font-bold text-warning">
                    {alerts.filter(a => a.priority === 'high').length}
                  </p>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Unread Alerts */}
        {unreadAlerts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <span>Unread Alerts</span>
            </h2>
            
            <div className="space-y-3">
              {unreadAlerts.map((alert, index) => {
                const PriorityIcon = getPriorityIcon(alert.priority);
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-l-4 border-l-primary bg-accent/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <PriorityIcon className={`w-5 h-5 mt-0.5 ${
                              alert.priority === 'high' ? 'text-destructive' :
                              alert.priority === 'medium' ? 'text-warning' : 'text-muted-foreground'
                            }`} />
                            <div className="flex-1">
                              <h3 className="font-medium text-sm">{alert.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {alert.message}
                              </p>
                              <div className="flex items-center space-x-3 mt-3">
                                <Badge variant={getPriorityColor(alert.priority) as any}>
                                  {alert.priority} priority
                                </Badge>
                                <Badge variant="outline">
                                  {alert.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(alert.createdAt).toLocaleDateString()}
                                </span>
                                {alert.deadline && (
                                  <span className="text-xs text-warning">
                                    Due: {new Date(alert.deadline).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkAsRead(alert.id)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Mark Read
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDismiss(alert.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Read Alerts */}
        {readAlerts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span>Read Alerts</span>
            </h2>
            
            <div className="space-y-3">
              {readAlerts.map((alert, index) => {
                const PriorityIcon = getPriorityIcon(alert.priority);
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="opacity-75 hover:opacity-100 transition-opacity">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <PriorityIcon className={`w-5 h-5 mt-0.5 ${
                              alert.priority === 'high' ? 'text-destructive' :
                              alert.priority === 'medium' ? 'text-warning' : 'text-muted-foreground'
                            }`} />
                            <div className="flex-1">
                              <h3 className="font-medium text-sm">{alert.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {alert.message}
                              </p>
                              <div className="flex items-center space-x-3 mt-3">
                                <Badge variant={getPriorityColor(alert.priority) as any}>
                                  {alert.priority} priority
                                </Badge>
                                <Badge variant="outline">
                                  {alert.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(alert.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDismiss(alert.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {alerts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Alerts</h3>
            <p className="text-muted-foreground">
              You're all caught up! No alerts to display.
            </p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Alerts;