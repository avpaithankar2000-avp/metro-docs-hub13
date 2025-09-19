import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Calendar, User, Eye, Languages, ExternalLink, Download, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Layout from '@/components/shared/Layout';
import apiEndpoints from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const DocumentsList = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('kmrl_user') || '{}');
        const resp = await apiEndpoints.getApprovedForUser(userData.id);
        setDocuments(resp.data || []);
      } catch (error) {
        console.error('Error loading documents:', error);
        toast({
          title: "Error",
          description: "Failed to load documents. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [toast]);

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const handleViewDocument = (doc: any) => {
    setSelectedDocument(doc);
    setShowTranslation(false);
  };

  const handleTranslate = () => {
    setShowTranslation(!showTranslation);
    toast({
      title: showTranslation ? "Original Text" : "Malayalam Translation",
      description: showTranslation ? "Showing original document summary" : "Document translated to Malayalam",
    });
  };

  const handleViewOriginal = (doc: any) => {
    toast({
      title: "Opening Document",
      description: `Opening ${doc.title} in new window...`,
    });
    // In real implementation, this would open the actual PDF
    window.open(doc.fileUrl, '_blank');
  };

  if (loading) {
    return (
      <Layout requiredRole="employee" title="Loading Documents..." subtitle="Please wait...">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      requiredRole="employee"
      title="Document List"
      subtitle={`${documents.length} of ${documents.length} documents`}
    >
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <p className="text-2xl font-bold text-success">
                    {documents.filter(doc => doc.status === 'approved').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Approved</p>
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
                    {documents.filter(doc => doc.status === 'under_review').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Under Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-info" />
                <div>
                  <p className="text-2xl font-bold text-info">
                    {documents.filter(doc => doc.status === 'pending').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {documents.map((doc, index) => {
            const StatusIcon = getStatusIcon(doc.status);
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <StatusIcon className="w-6 h-6 text-primary" />
                      <Badge variant={getStatusColor(doc.status) as any}>
                        {doc.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{doc.title}</CardTitle>
                    <CardDescription />
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {doc.summary}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                      </div>
                      <div />
                    </div>
                    
                    {doc.priority && (
                      <Badge variant={getPriorityColor(doc.priority) as any} className="w-fit">
                        {doc.priority} priority
                      </Badge>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDocument(doc)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Summary
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewOriginal({ ...doc, fileUrl: doc.file_url })}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Document Detail Modal */}
        <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-primary" />
                <span>{selectedDocument?.title}</span>
              </DialogTitle>
              <DialogDescription className="flex items-center space-x-4">
                <span>{selectedDocument?.category}</span>
                <Badge variant={getStatusColor(selectedDocument?.status) as any}>
                  {selectedDocument?.status?.replace('_', ' ')}
                </Badge>
              </DialogDescription>
            </DialogHeader>
            
            {selectedDocument && (
              <div className="space-y-6">
                {/* Document Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Uploaded by:</span> {selectedDocument.uploadedBy}
                  </div>
                  <div>
                    <span className="font-medium">Date:</span> {new Date(selectedDocument.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
                
                {/* Summary Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Document Summary</h3>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleTranslate}
                      >
                        <Languages className="w-4 h-4 mr-2" />
                        {showTranslation ? "Show Original" : "Translate to Malayalam"}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleViewOriginal(selectedDocument)}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Original Document
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-accent/20 rounded-lg">
                    {showTranslation ? (
                      <p className="text-sm leading-relaxed" style={{ fontFamily: 'sans-serif' }}>
                        {selectedDocument.malayalamTranslation}
                      </p>
                    ) : (
                      <p className="text-sm leading-relaxed">
                        {selectedDocument.summary}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Extracted Text Preview */}
                <div>
                  <h3 className="font-medium mb-3">Extracted Text (Preview)</h3>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {selectedDocument.extractedText}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

// Document Detail Page Component
export const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doc = documents.find(d => String(d.id) === String(id));
    setDocument(doc);
    setLoading(false);
    
    if (!doc) {
      navigate('/employee/documents');
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <Layout requiredRole="employee" title="Loading..." subtitle="Please wait...">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!document) {
    return null;
  }

  return (
    <Layout
      requiredRole="employee"
      title={document.title}
      subtitle={document.category}
    >
      <DocumentsList />
    </Layout>
  );
};

export default DocumentsList;