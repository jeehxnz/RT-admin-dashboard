import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Loader2, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

interface PasswordForm {
  password: string;
  confirmPassword: string;
}

export function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [updated, setUpdated] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PasswordForm>();

  const passwordValue = watch('password');

  useEffect(() => {
    const exchange = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      if (!code) {
        setSessionError('Invalid or missing verification code.');
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        setSessionError(error.message);
      }
      setLoading(false);
    };

    void exchange();
  }, [location.search]);

  const onSubmit = async (data: PasswordForm) => {
    setSessionError(null);
    const { error } = await supabase.auth.updateUser({ password: data.password });
    if (error) {
      setSessionError(error.message);
      return;
    }
    setUpdated(true);
    setTimeout(() => navigate('/'), 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-[--color-text]">
          <Loader2 className="animate-spin" size={18} />
          <span>Verifying link...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[--color-background]">
      <div className="w-full max-w-md bg-[--color-surface] border border-[--color-border] rounded-2xl p-6 shadow-xl">
        <h1 className="text-xl font-semibold text-[--color-text] mb-2">Set your password</h1>
        <p className="text-sm text-[--color-text-muted] mb-4">
          Choose a strong password to secure your account.
        </p>

        {sessionError && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-[--color-danger]/10 text-[--color-danger] text-sm">
            <AlertCircle size={16} />
            {sessionError}
          </div>
        )}

        {updated ? (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[--color-success]/10 text-[--color-success] text-sm">
            <CheckCircle size={16} />
            Password updated. Redirecting...
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Minimum 8 characters' },
                })}
                error={errors.password?.message}
              />
              <Lock size={18} className="absolute right-3 top-9 text-[--color-text-muted]" />
            </div>

            <div className="relative">
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm new password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === passwordValue || 'Passwords do not match',
                })}
                error={errors.confirmPassword?.message}
              />
              <Lock size={18} className="absolute right-3 top-9 text-[--color-text-muted]" />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Saving...
                </span>
              ) : (
                'Save password'
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

