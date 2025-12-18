import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Send, Eye, X, Plus, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { Modal } from '../components/ui/Modal';
import { sendEmail } from '../api/email';
import type { SendEmailRequest } from '../types';

interface EmailFormData {
  recipients: string;
  subject: string;
  htmlBody: string;
  plainTextBody: string;
}

export function SendEmail() {
  const [activeTab, setActiveTab] = useState<'html' | 'plain'>('html');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [recipientInput, setRecipientInput] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<EmailFormData>({
    defaultValues: {
      subject: '',
      htmlBody: '',
      plainTextBody: '',
    },
  });

  const htmlBody = watch('htmlBody');
  const subject = watch('subject');

  // Send email mutation
  const sendMutation = useMutation({
    mutationFn: sendEmail,
    onSuccess: (data) => {
      setSuccessMessage(data.data?.message || 'Email sent successfully!');
      reset();
      setRecipients([]);
      setTimeout(() => setSuccessMessage(null), 5000);
    },
  });

  const addRecipient = () => {
    const email = recipientInput.trim();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !recipients.includes(email)) {
      setRecipients([...recipients, email]);
      setRecipientInput('');
    }
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter((r) => r !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addRecipient();
    }
  };

  const onSubmit = (data: EmailFormData) => {
    if (recipients.length === 0) {
      return;
    }

    const payload: SendEmailRequest = {
      to: recipients,
      subject: data.subject,
    };

    if (activeTab === 'html' && data.htmlBody) {
      payload.html_body = data.htmlBody;
    }
    if (data.plainTextBody) {
      payload.plain_text_body = data.plainTextBody;
    }

    sendMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[--color-text]">Send Email</h1>
        <p className="text-[--color-text-muted] mt-1">Compose and send emails to users</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-[--color-success]/10 border border-[--color-success]/20">
          <CheckCircle size={20} className="text-[--color-success]" />
          <p className="text-[--color-success]">{successMessage}</p>
        </div>
      )}

      {/* Email Composer */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader title="Compose Email" />
          <CardContent className="space-y-6">
            {/* Recipients */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[--color-text-muted]">
                Recipients
              </label>
              <div className="flex flex-wrap gap-2 p-3 min-h-[48px] rounded-lg bg-[--color-background] border border-[--color-border] focus-within:ring-2 focus-within:ring-[--color-accent]/50 focus-within:border-[--color-accent] transition-colors">
                {recipients.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[--color-accent]/10 text-[--color-accent] text-sm"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() => removeRecipient(email)}
                      className="hover:bg-[--color-accent]/20 rounded p-0.5 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <input
                    type="email"
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={addRecipient}
                    placeholder={recipients.length === 0 ? "Enter email addresses..." : "Add another..."}
                    className="flex-1 bg-transparent border-none outline-none text-[--color-text] placeholder:text-[--color-text-muted]/50 text-sm"
                  />
                  <button
                    type="button"
                    onClick={addRecipient}
                    className="p-1 rounded hover:bg-[--color-surface-hover] transition-colors text-[--color-text-muted]"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              {recipients.length === 0 && (
                <p className="text-xs text-[--color-text-muted]">
                  Press Enter or comma to add each email address
                </p>
              )}
            </div>

            {/* Subject */}
            <Input
              label="Subject"
              placeholder="Enter email subject..."
              {...register('subject', { required: 'Subject is required' })}
              error={errors.subject?.message}
            />

            {/* Body Tabs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-[--color-text-muted]">
                  Body
                </label>
                <div className="flex bg-[--color-background] rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('html')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'html'
                        ? 'bg-[--color-accent] text-[--color-background]'
                        : 'text-[--color-text-muted] hover:text-[--color-text]'
                    }`}
                  >
                    HTML
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('plain')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'plain'
                        ? 'bg-[--color-accent] text-[--color-background]'
                        : 'text-[--color-text-muted] hover:text-[--color-text]'
                    }`}
                  >
                    Plain Text
                  </button>
                </div>
              </div>

              {activeTab === 'html' ? (
                <TextArea
                  placeholder="Enter HTML content..."
                  rows={12}
                  {...register('htmlBody')}
                  className="font-[family-name:var(--font-mono)] text-sm"
                />
              ) : (
                <TextArea
                  placeholder="Enter plain text content..."
                  rows={12}
                  {...register('plainTextBody')}
                />
              )}
            </div>

            {/* Error */}
            {sendMutation.error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[--color-danger]/10 text-[--color-danger] text-sm">
                <AlertCircle size={16} />
                {sendMutation.error.message || 'Failed to send email'}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[--color-border]">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsPreviewOpen(true)}
                disabled={!htmlBody}
                className="sm:flex-1"
              >
                <Eye size={18} />
                Preview HTML
              </Button>
              <Button
                type="submit"
                isLoading={sendMutation.isPending}
                disabled={recipients.length === 0}
                className="sm:flex-1"
              >
                <Send size={18} />
                Send Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Tips */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Mail size={20} className="text-[--color-accent] mt-0.5" />
            <div>
              <p className="font-medium text-[--color-text] mb-1">Tips</p>
              <ul className="text-sm text-[--color-text-muted] space-y-1">
                <li>• You can add multiple recipients by pressing Enter or comma after each email</li>
                <li>• HTML emails will be sent with the HTML body content</li>
                <li>• Plain text content serves as a fallback for email clients that don't support HTML</li>
                <li>• At least one body type (HTML or Plain Text) is required</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Email Preview"
        size="lg"
      >
        <div className="space-y-4">
          <div className="p-3 bg-[--color-background] rounded-lg border border-[--color-border]">
            <p className="text-xs text-[--color-text-muted] mb-1">Subject</p>
            <p className="font-medium text-[--color-text]">{subject || '(No subject)'}</p>
          </div>
          <div className="p-3 bg-[--color-background] rounded-lg border border-[--color-border]">
            <p className="text-xs text-[--color-text-muted] mb-2">Recipients</p>
            <div className="flex flex-wrap gap-1">
              {recipients.length > 0 ? (
                recipients.map((email) => (
                  <span
                    key={email}
                    className="px-2 py-0.5 rounded bg-[--color-surface-hover] text-[--color-text] text-sm"
                  >
                    {email}
                  </span>
                ))
              ) : (
                <span className="text-[--color-text-muted]">No recipients</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs text-[--color-text-muted] mb-2">HTML Preview</p>
            <div className="p-4 bg-white rounded-lg border border-[--color-border] min-h-[200px]">
              <div
                dangerouslySetInnerHTML={{ __html: htmlBody || '<p style="color: #666;">No content</p>' }}
                className="prose prose-sm max-w-none"
              />
            </div>
          </div>
          <Button variant="secondary" onClick={() => setIsPreviewOpen(false)} className="w-full">
            Close Preview
          </Button>
        </div>
      </Modal>
    </div>
  );
}

