import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Send, CheckCircle, AlertCircle, MessageSquare, ShieldOff } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TextArea } from '../components/ui/TextArea';
import { sendTelegramToClub } from '../api/telegram';
import type { SendTelegramRequest } from '../types';

const CLUBS = ['CC', 'AT', 'RT'] as const;
type Club = (typeof CLUBS)[number];

interface FormData {
  text: string;
}

export function SendTelegram() {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      text: '',
    },
  });

  const message = watch('text');

  const sendMutation = useMutation({
    mutationFn: (payload: SendTelegramRequest) => sendTelegramToClub(payload),
    onSuccess: (res) => {
      const data = res.data;
      if (data) {
        setSuccessMessage(
          `Sent ${data.sent}/${data.attempted} (distinct chat IDs: ${data.distinct_chat_ids}, failed: ${data.failed})`
        );
      } else {
        setSuccessMessage('Message sent.');
      }
      reset();
      setSelectedClub(null);
      setTimeout(() => setSuccessMessage(null), 6000);
    },
  });

  const onSubmit = (form: FormData) => {
    if (!selectedClub) return;
    if (!form.text) return;

    const payload: SendTelegramRequest = {
      club: selectedClub,
      text: form.text,
      parse_mode: 'MarkdownV2',
      disable_web_page_preview: false,
      dry_run: false,
    };

    sendMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[--color-text]">Send Telegram</h1>
          <p className="text-[--color-text-muted] mt-1">
            Broadcast a Telegram message to all players in a club.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-[--color-success]/10 border border-[--color-success]/20">
          <CheckCircle size={20} className="text-[--color-success]" />
          <p className="text-[--color-success]">{successMessage}</p>
        </div>
      )}

      {sendMutation.error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-[--color-danger]/10 text-[--color-danger] text-sm">
          <AlertCircle size={16} />
          {sendMutation.error.message || 'Failed to send message.'}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader title="Telegram Message" />
          <CardContent className="space-y-6">
            {/* Club Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[--color-text-muted]">
                Club (CC, AT, RT)
              </label>
              <div className="flex flex-wrap gap-2">
                {CLUBS.map((club) => {
                  const active = selectedClub === club;
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
                      onClick={() => setSelectedClub(club)}
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
                  !selectedClub ? 'text-[--color-danger]' : 'text-[--color-text-muted]'
                }`}
              >
                {!selectedClub ? 'Select a club.' : `Selected: ${selectedClub}`}
              </p>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[--color-text-muted]">
                Message (MarkdownV2)
              </label>
              <TextArea
                rows={10}
                placeholder="Hello players! ..."
                {...register('text', { required: 'Message is required' })}
                error={errors.text?.message}
              />
              <p className="text-xs text-[--color-text-muted] flex items-center gap-2">
                <MessageSquare size={14} /> Telegram limit: 4096 chars. Default parse_mode:
                MarkdownV2.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[--color-border]">
              <Button
                type="submit"
                isLoading={sendMutation.isPending}
                disabled={!selectedClub || !message || sendMutation.isPending}
                className="sm:flex-1"
              >
                <Send size={18} />
                Send Telegram
              </Button>
              <div className="flex items-center gap-2 text-xs text-[--color-text-muted] sm:flex-1 sm:justify-end">
                <ShieldOff size={14} />
                Defaults: MarkdownV2, previews enabled, no dry-run, backend rate limits apply.
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

