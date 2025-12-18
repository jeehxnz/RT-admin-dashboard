import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { 
  Plus, 
  Search, 
  Trash2, 
  Eye, 
  Ticket, 
  Loader2, 
  RefreshCw,
  Edit2,
  Gift,
  CheckCircle
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../components/ui/Table';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { 
  listBonusCodes, 
  createBonusCode, 
  updateBonusCode, 
  deleteBonusCode,
  redeemBonusCode 
} from '../api/bonusCodes';
import type { BonusCode, CreateBonusCodeRequest, UpdateBonusCodeRequest, BonusCodeFilters } from '../types';

const CLUB_OPTIONS = [
  { value: '', label: 'All Clubs' },
  { value: 'RT', label: 'RT' },
  { value: 'CC', label: 'CC' },
];

const REDEMPTION_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'true', label: 'Redeemed' },
  { value: 'false', label: 'Unredeemed' },
];

const BONUS_TYPE_OPTIONS = [
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'referral', label: 'Referral' },
  { value: 'special', label: 'Special' },
  { value: 'promotion', label: 'Promotion' },
];

export function BonusCodes() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<BonusCodeFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingCode, setViewingCode] = useState<BonusCode | null>(null);
  const [editingCode, setEditingCode] = useState<BonusCode | null>(null);
  const [deletingCode, setDeletingCode] = useState<BonusCode | null>(null);
  const [redeemingCode, setRedeemingCode] = useState<BonusCode | null>(null);

  // Fetch bonus codes
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['bonusCodes', filters],
    queryFn: () => listBonusCodes(filters),
  });

  // Create bonus code mutation
  const createMutation = useMutation({
    mutationFn: createBonusCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bonusCodes'] });
      setIsCreateModalOpen(false);
    },
  });

  // Update bonus code mutation
  const updateMutation = useMutation({
    mutationFn: ({ code, data }: { code: string; data: UpdateBonusCodeRequest }) => 
      updateBonusCode(code, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bonusCodes'] });
      setEditingCode(null);
    },
  });

  // Delete bonus code mutation
  const deleteMutation = useMutation({
    mutationFn: deleteBonusCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bonusCodes'] });
      setDeletingCode(null);
    },
  });

  // Redeem bonus code mutation
  const redeemMutation = useMutation({
    mutationFn: redeemBonusCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bonusCodes'] });
      setRedeemingCode(null);
    },
  });

  const bonusCodes = data?.data || [];

  // Filter bonus codes by search query (client-side)
  const filteredCodes = searchQuery
    ? bonusCodes.filter(
        (code) =>
          code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          code.club_gg_id.includes(searchQuery) ||
          code.player_email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : bonusCodes;

  const handleFilterChange = (key: keyof BonusCodeFilters, value: string) => {
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
          <h1 className="text-2xl font-bold text-[--color-text]">Bonus Codes</h1>
          <p className="text-[--color-text-muted] mt-1">Manage bonus codes and track redemptions</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={18} />
          Create Code
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
                placeholder="Search by code, ID, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[--color-background] border border-[--color-border] text-[--color-text] placeholder:text-[--color-text-muted]/50 focus:outline-none focus:ring-2 focus:ring-[--color-accent]/50 focus:border-[--color-accent] transition-colors text-sm"
              />
            </div>
            <Select
              options={CLUB_OPTIONS}
              value={filters.club || ''}
              onChange={(e) => handleFilterChange('club', e.target.value)}
              className="sm:w-32"
            />
            <Select
              options={REDEMPTION_OPTIONS}
              value={filters.is_redeemed || ''}
              onChange={(e) => handleFilterChange('is_redeemed', e.target.value)}
              className="sm:w-36"
            />
            <Button variant="secondary" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bonus Codes Table */}
      <Card>
        <CardHeader
          title="All Bonus Codes"
          description={`${filteredCodes.length} code${filteredCodes.length !== 1 ? 's' : ''} found`}
        />
        <div className="border-t border-[--color-border]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-[--color-accent]" />
            </div>
          ) : filteredCodes.length === 0 ? (
            <EmptyState
              icon={Ticket}
              title="No bonus codes found"
              description={searchQuery || filters.club || filters.is_redeemed ? 'Try adjusting your filters' : 'Create your first bonus code to get started'}
              action={
                !searchQuery && !filters.club && !filters.is_redeemed && (
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus size={18} />
                    Create Code
                  </Button>
                )
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell isHeader>Code</TableCell>
                  <TableCell isHeader>Type</TableCell>
                  <TableCell isHeader>Player Email</TableCell>
                  <TableCell isHeader>ClubGG ID</TableCell>
                  <TableCell isHeader>Status</TableCell>
                  <TableCell isHeader>Created</TableCell>
                  <TableCell isHeader className="text-right">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCodes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell>
                      <span className="font-[family-name:var(--font-mono)] font-medium text-[--color-accent]">
                        {code.code}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{code.bonus_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-[--color-text-muted] text-sm">
                        {code.player_email || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-[family-name:var(--font-mono)] text-[--color-text-muted] text-sm">
                        {code.club_gg_id}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={code.is_redeemed ? 'success' : 'warning'}>
                        {code.is_redeemed ? 'Redeemed' : 'Available'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-[--color-text-muted] text-sm">
                        {new Date(code.created_at).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingCode(code)}
                          title="View details"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingCode(code)}
                          title="Edit code"
                        >
                          <Edit2 size={16} />
                        </Button>
                        {!code.is_redeemed && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setRedeemingCode(code)}
                            title="Redeem code"
                          >
                            <Gift size={16} className="text-[--color-success]" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingCode(code)}
                          title="Delete code"
                        >
                          <Trash2 size={16} className="text-[--color-danger]" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      {/* Create Bonus Code Modal */}
      <CreateBonusCodeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => createMutation.mutate(data)}
        isLoading={createMutation.isPending}
        error={createMutation.error?.message}
      />

      {/* Edit Bonus Code Modal */}
      {editingCode && (
        <EditBonusCodeModal
          code={editingCode}
          onClose={() => setEditingCode(null)}
          onSubmit={(data) => updateMutation.mutate({ code: editingCode.code, data })}
          isLoading={updateMutation.isPending}
          error={updateMutation.error?.message}
        />
      )}

      {/* View Bonus Code Modal */}
      {viewingCode && (
        <ViewBonusCodeModal
          code={viewingCode}
          onClose={() => setViewingCode(null)}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingCode}
        onClose={() => setDeletingCode(null)}
        onConfirm={() => deletingCode && deleteMutation.mutate(deletingCode.code)}
        title="Delete Bonus Code"
        message={`Are you sure you want to delete code "${deletingCode?.code}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />

      {/* Redeem Confirmation */}
      <RedeemConfirmDialog
        code={redeemingCode}
        onClose={() => setRedeemingCode(null)}
        onConfirm={() => redeemingCode && redeemMutation.mutate(redeemingCode.code)}
        isLoading={redeemMutation.isPending}
      />
    </div>
  );
}

// Create Bonus Code Modal
interface CreateBonusCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBonusCodeRequest) => void;
  isLoading: boolean;
  error?: string;
}

function CreateBonusCodeModal({ isOpen, onClose, onSubmit, isLoading, error }: CreateBonusCodeModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateBonusCodeRequest>();

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: CreateBonusCodeRequest) => {
    onSubmit(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Bonus Code">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Code"
          placeholder="e.g., WELCOME2024"
          {...register('code', { required: 'Code is required' })}
          error={errors.code?.message}
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[--color-text-muted]">
            Bonus Type
          </label>
          <select
            {...register('bonus_type', { required: 'Bonus type is required' })}
            className="w-full px-4 py-2.5 rounded-lg bg-[--color-background] border border-[--color-border] text-[--color-text] focus:outline-none focus:ring-2 focus:ring-[--color-accent]/50 focus:border-[--color-accent] transition-colors text-sm"
          >
            {BONUS_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.bonus_type && (
            <p className="text-sm text-[--color-danger]">{errors.bonus_type.message}</p>
          )}
        </div>
        <Input
          label="Player Email"
          type="email"
          placeholder="player@example.com"
          {...register('player_email', { required: 'Player email is required' })}
          error={errors.player_email?.message}
        />
        <Input
          label="ClubGG ID"
          placeholder="Enter ClubGG ID"
          {...register('club_gg_id', { required: 'ClubGG ID is required' })}
          error={errors.club_gg_id?.message}
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
            Create Code
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// Edit Bonus Code Modal
interface EditBonusCodeModalProps {
  code: BonusCode;
  onClose: () => void;
  onSubmit: (data: UpdateBonusCodeRequest) => void;
  isLoading: boolean;
  error?: string;
}

function EditBonusCodeModal({ code, onClose, onSubmit, isLoading, error }: EditBonusCodeModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateBonusCodeRequest>({
    defaultValues: {
      bonus_type: code.bonus_type,
      player_email: code.player_email,
      club_gg_id: code.club_gg_id,
      is_redeemed: code.is_redeemed,
    },
  });

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Bonus Code">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-3 bg-[--color-background] rounded-lg border border-[--color-border]">
          <p className="text-xs text-[--color-text-muted] mb-1">Code (read-only)</p>
          <p className="font-[family-name:var(--font-mono)] font-medium text-[--color-accent]">
            {code.code}
          </p>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[--color-text-muted]">
            Bonus Type
          </label>
          <select
            {...register('bonus_type')}
            className="w-full px-4 py-2.5 rounded-lg bg-[--color-background] border border-[--color-border] text-[--color-text] focus:outline-none focus:ring-2 focus:ring-[--color-accent]/50 focus:border-[--color-accent] transition-colors text-sm"
          >
            {BONUS_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Player Email"
          type="email"
          {...register('player_email')}
          error={errors.player_email?.message}
        />
        <Input
          label="ClubGG ID"
          {...register('club_gg_id')}
          error={errors.club_gg_id?.message}
        />

        {error && (
          <p className="text-sm text-[--color-danger] bg-[--color-danger]/10 p-3 rounded-lg">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} className="flex-1">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// View Bonus Code Modal
interface ViewBonusCodeModalProps {
  code: BonusCode;
  onClose: () => void;
}

function ViewBonusCodeModal({ code, onClose }: ViewBonusCodeModalProps) {
  return (
    <Modal isOpen={true} onClose={onClose} title="Bonus Code Details">
      <div className="space-y-4">
        <div className="p-4 bg-[--color-background] rounded-lg border border-[--color-border] text-center">
          <p className="text-xs text-[--color-text-muted] mb-2">Code</p>
          <p className="font-[family-name:var(--font-mono)] text-2xl font-bold text-[--color-accent]">
            {code.code}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-[--color-text-muted] mb-1">Bonus Type</p>
            <Badge variant="default">{code.bonus_type}</Badge>
          </div>
          <div>
            <p className="text-sm text-[--color-text-muted] mb-1">Status</p>
            <Badge variant={code.is_redeemed ? 'success' : 'warning'}>
              {code.is_redeemed ? 'Redeemed' : 'Available'}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-[--color-text-muted] mb-1">Player Email</p>
            <p className="text-[--color-text]">{code.player_email || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-[--color-text-muted] mb-1">ClubGG ID</p>
            <p className="font-[family-name:var(--font-mono)] text-[--color-text]">
              {code.club_gg_id}
            </p>
          </div>
          <div>
            <p className="text-sm text-[--color-text-muted] mb-1">Created At</p>
            <p className="text-[--color-text]">
              {new Date(code.created_at).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-[--color-text-muted] mb-1">Updated At</p>
            <p className="text-[--color-text]">
              {new Date(code.updated_at).toLocaleString()}
            </p>
          </div>
          {code.redeemed_at && (
            <div className="col-span-2">
              <p className="text-sm text-[--color-text-muted] mb-1">Redeemed At</p>
              <p className="text-[--color-success]">
                {new Date(code.redeemed_at).toLocaleString()}
              </p>
            </div>
          )}
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

// Redeem Confirmation Dialog
interface RedeemConfirmDialogProps {
  code: BonusCode | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

function RedeemConfirmDialog({ code, onClose, onConfirm, isLoading }: RedeemConfirmDialogProps) {
  if (!code) return null;

  return (
    <Modal isOpen={true} onClose={onClose} title="Redeem Bonus Code" size="sm">
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-12 h-12 rounded-full bg-[--color-success]/10 flex items-center justify-center mb-4">
          <CheckCircle size={24} className="text-[--color-success]" />
        </div>
        <p className="text-[--color-text] mb-2">
          Redeem code <span className="font-[family-name:var(--font-mono)] font-bold text-[--color-accent]">{code.code}</span>?
        </p>
        <p className="text-sm text-[--color-text-muted] mb-6">
          This will mark the bonus code as redeemed. This action cannot be undone.
        </p>
        <div className="flex gap-3 w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1" disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className="flex-1" isLoading={isLoading}>
            Redeem
          </Button>
        </div>
      </div>
    </Modal>
  );
}

