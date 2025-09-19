import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Eye, CheckCircle, X, Clock, User, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Layout from '@/components/shared/Layout';
import apiEndpoints from '@/services/api';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ReviewDocuments = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const { toast } = useToast();

  const pendingDocuments = documents.filter(doc => doc.status === 'pending');
  const approvedDocuments = documents.filter(doc => doc.status === 'approved');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'under_review': return 'warning';
      case 'pending': return 'info';
      default: return 'secondary';
    }
  };

  const handleReviewDocument = (doc: any) => {
    setSelectedDocument(doc);
    setReviewNotes('');
    setSelectedEmployeeIds([]);
  };

  const handleApprove = async () => {
    if (!selectedDocument) return;

    setLoading(true);
    try {
      await apiEndpoints.approveDocument(selectedDocument.id, selectedEmployeeIds);
      setDocuments(prevDocs => prevDocs.filter(d => d.id !== selectedDocument.id));

      toast({
        title: "Document Approved",
        description: `${selectedDocument.title} has been approved and sent to employees.`,
      });

      setSelectedDocument(null);
      setReviewNotes('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedDocument) return;
    
    if (!reviewNotes.trim()) {
      toast({
        title: "Review Notes Required",
        description: "Please provide feedback for document rejection.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // You can implement reject endpoint similarly; for now just remove from list
      setDocuments(prevDocs => prevDocs.filter(d => d.id !== selectedDocument.id));

      toast({
        title: "Document Rejected",
        description: `${selectedDocument.title} has been rejected with feedback.`,
      });

      setSelectedDocument(null);
      setReviewNotes('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      requiredRole="admin"
      title="Review Documents"
      subtitle={`${pendingDocuments.length} documents pending review`}
    >
      <div className="space-y-6">
        {/* Load pending and employees on mount */}
        <Loader setDocuments={setDocuments} setEmployees={setEmployees} />
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-warning" />
                <div>
                  <p className="text-2xl font-bold text-warning">{pendingDocuments.length}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <p className="text-2xl font-bold text-success">{approvedDocuments.length}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-primary">{documents.length}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Documents */}
        {pendingDocuments.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <Clock className="w-5 h-5 text-warning" />
              <span>Pending Review</span>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingDocuments.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <FileText className="w-6 h-6 text-primary" />
                        <Badge variant={getStatusColor(doc.status) as any}>
                          {doc.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{doc.title}</CardTitle>
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
                      </div>
                      
                      <Button
                        onClick={() => handleReviewDocument(doc)}
                        className="w-full"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Review Document
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recently Approved */}
        {approvedDocuments.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span>Recently Approved</span>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {approvedDocuments.slice(0, 6).map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-medium text-sm line-clamp-2">{doc.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{doc.category}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="success">Approved</Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(doc.uploadedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {pendingDocuments.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground">
              No documents pending review at the moment.
            </p>
          </motion.div>
        )}

        {/* Review Modal */}
        <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-primary" />
                <span>Review Document</span>
              </DialogTitle>
              <DialogDescription>
                Review the document content and approve or reject for employee access.
              </DialogDescription>
            </DialogHeader>
            
            {selectedDocument && (
              <div className="space-y-6">
                {/* Document Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedDocument.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-4">
                      <Badge variant={getStatusColor(selectedDocument.status) as any}>
                        {selectedDocument.status.replace('_', ' ')}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Date:</span> {new Date(selectedDocument.created_at).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Original:</span> <a className="underline" href={selectedDocument.file_url} target="_blank" rel="noreferrer">Open</a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Document Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Document Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{selectedDocument.summary}</p>
                  </CardContent>
                </Card>

                {/* Extracted Text Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Extracted Text (Preview)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-muted/50 rounded-lg max-h-40 overflow-y-auto">
                      <p className="text-sm text-muted-foreground">
                        {selectedDocument.parsed_text}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Assign Employees */}
                <Card>
                  <CardHeader>
                    <CardTitle>Assign to Employees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {employees.map((emp) => (
                        <button
                          key={emp.id}
                          type="button"
                          className={`text-left p-2 border rounded ${selectedEmployeeIds.includes(emp.id) ? 'bg-primary/10 border-primary' : ''}`}
                          onClick={() => setSelectedEmployeeIds((prev) => prev.includes(emp.id) ? prev.filter(id => id !== emp.id) : [...prev, emp.id])}
                        >
                          <div className="font-medium text-sm">{emp.name || emp.email}</div>
                          <div className="text-xs text-muted-foreground">{emp.email}</div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Review Notes */}
                <div className="space-y-3">
                  <Label htmlFor="reviewNotes">Review Notes</Label>
                  <Textarea
                    id="reviewNotes"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add your review notes here..."
                    rows={4}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDocument(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-destructive-foreground"></div>
                        <span>Rejecting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </div>
                    )}
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                        <span>Approving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve & Send to Employees</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ReviewDocuments;

// Helper loader component to fetch pending documents and employees
const Loader = ({ setDocuments, setEmployees }: { setDocuments: (d: any[]) => void, setEmployees: (u: any[]) => void }) => {
  useEffect(() => {
    (async () => {
      try {
        const [docsResp, usersResp] = await Promise.all([
          apiEndpoints.getPendingDocuments(),
          supabase.from('users').select('id,name,email,role').eq('role','employee')
        ]);
        setDocuments(docsResp.data || []);
        // @ts-ignore
        if (usersResp.error) {
          setEmployees([]);
        } else {
          // @ts-ignore
          setEmployees(usersResp.data || []);
        }
      } catch {
        setDocuments([]);
        setEmployees([]);
      }
    })();
  }, [setDocuments, setEmployees]);
  return null;
};