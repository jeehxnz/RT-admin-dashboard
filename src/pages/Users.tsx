import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Search, Trash2, Eye, Users as UsersIcon, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Pagination } from '../components/ui/Pagination';
import { listUsers, upsertUser, deleteUser } from '../api/users';
import type { User, UpsertUserRequest, UserFilters } from '../types';

const CLUB_OPTIONS = [
  { value: '', label: 'All Clubs' },
  { value: 'RT', label: 'RT' },
  { value: 'CC', label: 'CC' },
];

export function Users() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<UserFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch users
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => listUsers(filters),
  });

  // Create/Update user mutation
  const createMutation = useMutation({
    mutationFn: upsertUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsCreateModalOpen(false);
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeletingUser(null);
    },
  });

  const users = data?.data || [];

  // Filter users by search query (client-side for username partial match)
  const filteredUsers = searchQuery
    ? users.filter(
        (user) =>
          user.club_gg_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.club_gg_id.includes(searchQuery) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  // Paginate filtered users
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[--color-text]">Users</h1>
          <p className="text-[--color-text-muted] mt-1">Manage user accounts and club memberships</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={18} />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--color-text-muted]" />
              <input
                type="text"
                placeholder="Search by username, ID, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[--color-background] border border-[--color-border] text-[--color-text] placeholder:text-[--color-text-muted]/50 focus:outline-none focus:ring-2 focus:ring-[--color-accent]/50 focus:border-[--color-accent] transition-colors text-sm"
              />
            </div>
            <Select
              options={CLUB_OPTIONS}
              value={filters.club || ''}
              onChange={(e) => handleFilterChange('club', e.target.value)}
              className="sm:w-40"
            />
            <Button variant="secondary" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader
          title="All Users"
          description={`${filteredUsers.length} user${filteredUsers.length !== 1 ? 's' : ''} found`}
        />
        <div className="border-t border-[--color-border]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-[--color-accent]" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              icon={UsersIcon}
              title="No users found"
              description={searchQuery || filters.club ? 'Try adjusting your filters' : 'Add your first user to get started'}
              action={
                !searchQuery && !filters.club && (
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus size={18} />
                    Add User
                  </Button>
                )
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell isHeader>Username</TableCell>
                  <TableCell isHeader>ClubGG ID</TableCell>
                  <TableCell isHeader>Email</TableCell>
                  <TableCell isHeader>Clubs</TableCell>
                  <TableCell isHeader>Created</TableCell>
                  <TableCell isHeader className="text-right">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.club_gg_id}>
                    <TableCell>
                      <span className="font-[family-name:var(--font-mono)] font-medium">
                        {user.club_gg_username}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-[family-name:var(--font-mono)] text-[--color-text-muted]">
                        {user.club_gg_id}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-[--color-text-muted]">
                        {user.email || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1.5 flex-wrap">
                        {user.clubs?.map((club) => (
                          <Badge key={club} variant="info">{club}</Badge>
                        ))}
                        {(!user.clubs || user.clubs.length === 0) && (
                          <span className="text-[--color-text-muted]">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[--color-text-muted]">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingUser(user)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setDeletingUser(user)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        {filteredUsers.length > 0 && (
          <div className="border-t border-[--color-border]">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredUsers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(count) => {
                setItemsPerPage(count);
                setCurrentPage(1);
              }}
            />
          </div>
        )}
      </Card>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => createMutation.mutate(data)}
        isLoading={createMutation.isPending}
        error={createMutation.error?.message}
      />

      {/* View User Modal */}
      {viewingUser && (
        <ViewUserModal
          user={viewingUser}
          onClose={() => setViewingUser(null)}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={() => deletingUser && deleteMutation.mutate(deletingUser.club_gg_id)}
        title="Delete User"
        message={`Are you sure you want to delete "${deletingUser?.club_gg_username}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

// Create User Modal Component
interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpsertUserRequest) => void;
  isLoading: boolean;
  error?: string;
}

function CreateUserModal({ isOpen, onClose, onSubmit, isLoading, error }: CreateUserModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpsertUserRequest>();

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: UpsertUserRequest) => {
    onSubmit(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New User">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="ClubGG Username"
          placeholder="Enter username"
          {...register('club_gg_username', { required: 'Username is required' })}
          error={errors.club_gg_username?.message}
        />
        <Input
          label="ClubGG ID"
          placeholder="Enter ClubGG ID"
          {...register('club_gg_id', { required: 'ClubGG ID is required' })}
          error={errors.club_gg_id?.message}
        />
        <Input
          label="Email (optional)"
          type="email"
          placeholder="Enter email address"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          label="Club (optional)"
          placeholder="e.g., RT, CC"
          {...register('club')}
          error={errors.club?.message}
        />

        {error && (
          <p className="text-sm text-[--color-danger] bg-[--color-danger]/10 p-3 rounded-lg">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} className="flex-1">
            Add User
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// View User Modal Component
interface ViewUserModalProps {
  user: User;
  onClose: () => void;
}

function ViewUserModal({ user, onClose }: ViewUserModalProps) {
  return (
    <Modal isOpen={true} onClose={onClose} title="User Details">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-[--color-text-muted] mb-1">Username</p>
            <p className="font-[family-name:var(--font-mono)] font-medium text-[--color-text]">
              {user.club_gg_username}
            </p>
          </div>
          <div>
            <p className="text-sm text-[--color-text-muted] mb-1">ClubGG ID</p>
            <p className="font-[family-name:var(--font-mono)] text-[--color-text]">
              {user.club_gg_id}
            </p>
          </div>
          <div>
            <p className="text-sm text-[--color-text-muted] mb-1">Email</p>
            <p className="text-[--color-text]">{user.email || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-[--color-text-muted] mb-1">Clubs</p>
            <div className="flex gap-1.5 flex-wrap">
              {user.clubs?.map((club) => (
                <Badge key={club} variant="info">{club}</Badge>
              ))}
              {(!user.clubs || user.clubs.length === 0) && '-'}
            </div>
          </div>
          <div>
            <p className="text-sm text-[--color-text-muted] mb-1">Created At</p>
            <p className="text-[--color-text]">
              {new Date(user.created_at).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-[--color-text-muted] mb-1">Updated At</p>
            <p className="text-[--color-text]">
              {new Date(user.updated_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="pt-4">
          <Button variant="secondary" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

