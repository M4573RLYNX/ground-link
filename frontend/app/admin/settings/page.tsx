'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {  Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/admin/PageHeader';

// Mock user data - replace with real API fetch later
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [profileForm, setProfileForm] = useState({
    name: 'Geolynx Admin',
    email: 'admin@groundlink.sb',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
  });
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Fetch users on load - stubbed, replace with real API
  useEffect(() => {
    // TODO: Fetch users from backend /api/users
    setUsers([
      { id: '1', name: 'Geolynx Admin', email: 'admin@groundlink.sb', role: 'admin', createdAt: '2026-03-01' },
      { id: '2', name: 'Agent One', email: 'agent1@groundlink.sb', role: 'user', createdAt: '2026-03-02' },
    ]);
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUserForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: API call to update profile
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // TODO: API call to change password
      toast.success('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: API call to create new user
      const newUser = {
        id: Date.now().toString(),
        name: newUserForm.name,
        email: newUserForm.email,
        role: newUserForm.role,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setUsers(prev => [...prev, newUser]);
      toast.success('New user added successfully');
      setIsAddUserOpen(false);
      setNewUserForm({ name: '', email: '', password: '', role: 'user' });
    } catch (err) {
      toast.error('Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    // TODO: API call to delete user
    setUsers(prev => prev.filter(u => u.id !== id));
    toast.success('User deleted successfully');
  };

  return (
    <div>
      <PageHeader title="Settings" description="Your profile, password and team access." />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="users">Manage Users</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="max-w-2xl">
            <CardHeader><CardTitle>Update Profile</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={profileForm.name} onChange={handleProfileChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={profileForm.email} onChange={handleProfileChange} />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card className="max-w-2xl">
            <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" name="currentPassword" type="password" required value={passwordForm.currentPassword} onChange={handlePasswordChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" name="newPassword" type="password" required value={passwordForm.newPassword} onChange={handlePasswordChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" required value={passwordForm.confirmPassword} onChange={handlePasswordChange} />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Changing...' : 'Change Password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Manage Users</CardTitle>
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus /> Add user</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Add New User</DialogTitle></DialogHeader>
                    <form onSubmit={handleAddUserSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="newName">Name</Label>
                        <Input id="newName" name="name" value={newUserForm.name} onChange={handleNewUserChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newEmail">Email</Label>
                        <Input id="newEmail" name="email" type="email" value={newUserForm.email} onChange={handleNewUserChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Password</Label>
                        <Input id="newPassword" name="password" type="password" value={newUserForm.password} onChange={handleNewUserChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Select value={newUserForm.role} onValueChange={(v) => setNewUserForm(prev => ({ ...prev, role: v as 'admin' | 'user' }))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Adding...' : 'Add User'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-semibold">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'ink' : 'muted'} className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.createdAt}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => toast.info('Edit user coming soon')}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteUser(user.id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}