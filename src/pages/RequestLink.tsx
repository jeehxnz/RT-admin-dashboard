import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AlertCircle, CheckCircle, Loader2, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

interface RequestForm {
  email: string;
}

export function RequestLink() {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestForm>();

  const onSubmit = async (data: RequestForm) => {
    setError(null);
    setSent(false);
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error: reqError } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo,
    });
    if (reqError) {
      setError(reqError.message);
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[--color-background]">
      <div className="w-full max-w-md bg-[--color-surface] border border-[--color-border] rounded-2xl p-6 shadow-xl">
        <h1 className="text-xl font-semibold text-[--color-text] mb-2">Request sign-in link</h1>
        <p className="text-sm text-[--color-text-muted] mb-4">
          We will email you a secure link to set your password and sign in.
        </p>

        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-[--color-danger]/10 text-[--color-danger] text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {sent ? (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[--color-success]/10 text-[--color-success] text-sm">
            <CheckCircle size={16} />
            Check your email for the link.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                })}
                error={errors.email?.message}
              />
              <Mail size={18} className="absolute right-3 top-9 text-[--color-text-muted]" />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Sending...
                </span>
              ) : (
                'Send link'
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

