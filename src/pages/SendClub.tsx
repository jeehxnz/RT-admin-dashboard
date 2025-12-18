import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Send, CheckCircle, AlertCircle, Eye, X, Megaphone } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { Modal } from '../components/ui/Modal';
import { sendClubEmail } from '../api/email';
import type { SendClubEmailRequest } from '../types';

const CLUBS = ['CC', 'AT', 'RT'] as const;

type Club = (typeof CLUBS)[number];

interface FormData {
  subject: string;
  htmlBody: string;
  plainTextBody: string;
}

export function SendClub() {
  const [selectedClubs, setSelectedClubs] = useState<Club[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      subject: '',
      htmlBody: '',
      plainTextBody: '',
    },
  });

  const htmlBody = watch('htmlBody');
  const plainTextBody = watch('plainTextBody');
  const subject = watch('subject');

  const sendMutation = useMutation({
    mutationFn: sendClubEmail,
    onSuccess: (data) => {
      const result = data.data;
      if (result) {
        setSuccessMessage(
          `Sent ${result.sent}/${result.recipients} (${result.skipped} skipped) for ${result.club}`
        );
      } else {
        setSuccessMessage('Email sent.');
      }
      reset();
      setSelectedClubs([]);
      setTimeout(() => setSuccessMessage(null), 6000);
    },
  });

  const toggleClub = (club: Club) => {
    setSelectedClubs((prev) =>
      prev.includes(club) ? prev.filter((c) => c !== club) : [...prev, club]
    );
  };

  const onSubmit = (data: FormData) => {
    if (selectedClubs.length === 0) return;
    if (!data.htmlBody && !data.plainTextBody) return;

    const payload: SendClubEmailRequest = {
      club: selectedClubs.join('|'),
      subject: data.subject,
    };

    if (data.htmlBody) payload.html_body = data.htmlBody;
    if (data.plainTextBody) payload.plain_text_body = data.plainTextBody;

    sendMutation.mutate(payload);
  };

  const canPreview = !!htmlBody;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[--color-text]">Send to Club</h1>
          <p className="text-[--color-text-muted] mt-1">
            Send an email to all players in selected clubs (CC, AT, RT)
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-[--color-success]/10 border border-[--color-success]/20">
          <CheckCircle size={20} className="text-[--color-success]" />
          <p className="text-[--color-success]">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader title="Compose Club Email" />
          <CardContent className="space-y-6">
            {/* Club Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[--color-text-muted]">
                Clubs (choose one or more)
              </label>
              <div className="flex flex-wrap gap-2">
                {CLUBS.map((club) => {
                  const active = selectedClubs.includes(club);
                  const base =
                    'px-3 py-1.75 rounded-xl text-sm font-semibold border transition-colors duration-150';
                  const activeClasses =
                    'bg-[--color-accent] text-[--color-background] border-[--color-accent] shadow-[0_0_0_3px_rgba(6,182,212,0.18)]';
                  const inactiveClasses =
                    'bg-[--color-background] text-[--color-text] border-[--color-border] hover:border-[--color-accent] hover:text-[--color-accent]';

                  return (
                    <button
                      key={club}
                      type="button"
                      onClick={() => toggleClub(club)}
                      aria-pressed={active}
                      className={`${base} ${active ? activeClasses : inactiveClasses}`}
                    >
                      {club}
                    </button>
                  );
                })}
              </div>
              <p
                className={`text-xs ${
                  selectedClubs.length === 0
                    ? 'text-[--color-danger]'
                    : 'text-[--color-text-muted]'
                }`}
              >
                {selectedClubs.length === 0
                  ? 'Select at least one club.'
                  : `Selected: ${selectedClubs.join(', ')}`}
              </p>
            </div>

            {/* Subject */}
            <Input
              label="Subject"
              placeholder="Enter email subject..."
              {...register('subject', { required: 'Subject is required' })}
              error={errors.subject?.message}
            />

            {/* Body */}
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[--color-text-muted]">
                  HTML Body
                </label>
                <TextArea
                  rows={14}
                  placeholder="<h1>Welcome</h1>"
                  className="font-[family-name:var(--font-mono)] text-sm"
                  {...register('htmlBody')}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[--color-text-muted]">
                  Plain Text Body
                </label>
                <TextArea
                  rows={14}
                  placeholder="Welcome to the club..."
                  {...register('plainTextBody')}
                />
              </div>
            </div>
            {!htmlBody && !plainTextBody && (
              <p className="text-xs text-[--color-danger]">
                Provide HTML or Plain Text content.
              </p>
            )}

            {sendMutation.error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[--color-danger]/10 text-[--color-danger] text-sm">
                <AlertCircle size={16} />
                {sendMutation.error.message || 'Failed to send email.'}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[--color-border]">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsPreviewOpen(true)}
                disabled={!canPreview}
                className="sm:flex-1"
              >
                <Eye size={18} />
                Preview HTML
              </Button>
              <Button
                type="submit"
                isLoading={sendMutation.isPending}
                disabled={
                  selectedClubs.length === 0 ||
                  (!htmlBody && !plainTextBody) ||
                  sendMutation.isPending
                }
                className="sm:flex-1"
              >
                <Send size={18} />
                Send to Clubs
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Megaphone size={20} className="text-[--color-accent] mt-0.5" />
            <div>
              <p className="font-medium text-[--color-text] mb-1">How it works</p>
              <ul className="text-sm text-[--color-text-muted] space-y-1">
                <li>• Select one or more clubs (CC, AT, RT).</li>
                <li>• Subject is required.</li>
                <li>• Provide at least one body: HTML or Plain Text.</li>
                <li>• The request sends `club` as a pipe-separated string (e.g., CC|RT).</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="HTML Preview"
        size="lg"
      >
        <div className="space-y-4">
          <div className="p-3 bg-[--color-background] rounded-lg border border-[--color-border]">
            <p className="text-xs text-[--color-text-muted] mb-1">Subject</p>
            <p className="font-medium text-[--color-text]">{subject || '(No subject)'}</p>
          </div>
          <div>
            <p className="text-xs text-[--color-text-muted] mb-2">HTML Preview</p>
            <div className="p-4 bg-white rounded-lg border border-[--color-border] min-h-[200px]">
              <div
                dangerouslySetInnerHTML={{
                  __html: htmlBody || '<p style="color: #666;">No content</p>',
                }}
                className="prose prose-sm max-w-none"
              />
            </div>
          </div>
          <Button variant="secondary" onClick={() => setIsPreviewOpen(false)} className="w-full">
            <X size={16} />
            Close Preview
          </Button>
        </div>
      </Modal>
    </div>
  );
}

