"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Eye, Users, MessageSquare, FileText } from "lucide-react"

type Contact = {
  id: string
  name: string
  email: string
  phone: string
  service: string
  message: string
  timestamp: any
}

type Testimonial = {
  id: string
  name: string
  role: string
  content: string
  approved: boolean
  timestamp: any
}

type User = {
  id: string
  name: string
  email: string
  role: string
  createdAt: any
}

export default function AdminDashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/admin');
      return;
    }

    if (!isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access the admin dashboard.',
        variant: 'destructive',
      });
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch contacts
        const contactsQuery = query(collection(db, 'contacts'), orderBy('timestamp', 'desc'));
        const contactsSnapshot = await getDocs(contactsQuery);
        const contactsData: Contact[] = [];
        contactsSnapshot.forEach((doc) => {
          contactsData.push({ id: doc.id, ...doc.data() } as Contact);
        });
        setContacts(contactsData);

        // Fetch testimonials
        const testimonialsQuery = query(collection(db, 'testimonials'), orderBy('timestamp', 'desc'));
        const testimonialsSnapshot = await getDocs(testimonialsQuery);
        const testimonialsData: Testimonial[] = [];
        testimonialsSnapshot.forEach((doc) => {
          testimonialsData.push({ id: doc.id, ...doc.data() } as Testimonial);
        });
        setTestimonials(testimonialsData);

        // Fetch users
        const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const usersSnapshot = await getDocs(usersQuery);
        const usersData: User[] = [];
        usersSnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() } as User);
        });
        setUsers(usersData);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, isAdmin, router, toast]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const handleViewDetails = (item: any) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleApproveTestimonial = async (id: string) => {
    try {
      await updateDoc(doc(db, 'testimonials', id), {
        approved: true,
      });
      
      setTestimonials((prev) =>
        prev.map((testimonial) =>
          testimonial.id === id ? { ...testimonial, approved: true } : testimonial
        )
      );
      
      toast({
        title: 'Success',
        description: 'Testimonial approved successfully.',
      });
    } catch (error) {
      console.error('Error approving testimonial:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve testimonial. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRejectTestimonial = async (id: string) => {
    try {
      await updateDoc(doc(db, 'testimonials', id), {
        approved: false,
      });
      
      setTestimonials((prev) =>
        prev.map((testimonial) =>
          testimonial.id === id ? { ...testimonial, approved: false } : testimonial
        )
      );
      
      toast({
        title: 'Success',
        description: 'Testimonial rejected successfully.',
      });
    } catch (error) {
      console.error('Error rejecting testimonial:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject testimonial. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteItem = async (collection: string, id: string) => {
    try {
      await deleteDoc(doc(db, collection, id));
      
      if (collection === 'contacts') {
        setContacts((prev) => prev.filter((contact) => contact.id !== id));
      } else if (collection === 'testimonials') {
        setTestimonials((prev) => prev.filter((testimonial) => testimonial.id !== id));
      }
      
      toast({
        title: 'Success',
        description: `Item deleted successfully.`,
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete item. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 dark:bg-navy-900 py-12">
          <div className="container">
            <div className="flex items-center justify-center h-[60vh]">
              <p>Loading dashboard data...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-navy-900 py-12">
        <div className="container">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage contacts, testimonials, and users from one central location.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Registered platform users
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    New Messages
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{contacts.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Contact form submissions
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Testimonials
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {testimonials.filter((t) => !t.approved).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting approval
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="contacts">
              <TabsList className="mb-6">
                <TabsTrigger value="contacts">Contacts</TabsTrigger>
                <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>
              
              <TabsContent value="contacts">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Submissions</CardTitle>
                    <CardDescription>
                      View and manage contact form submissions from potential clients.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {contacts.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No contact submissions yet.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Service</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {contacts.map((contact) => (
                              <TableRow key={contact.id}>
                                <TableCell className="font-medium">{contact.name}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell>{contact.service || 'N/A'}</TableCell>
                                <TableCell>{formatDate(contact.timestamp)}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleViewDetails(contact)}
                                    >
                                      <Eye className="h-4 w-4" />
                                      <span className="sr-only">View details</span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size\
