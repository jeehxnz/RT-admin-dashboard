import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { KeyRound, AlertCircle, Loader2, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

interface LoginForm {
  email: string;
  password: string;
}

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    setIsChecking(true);

    try {
      const result = await login(data.email, data.password);
      if (result && 'error' in result && result.error) {
        setError(result.error);
        return;
      }
      navigate('/');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[--color-background]">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-[--color-accent]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-[--color-accent]/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[--color-accent] mb-4">
            <span className="text-2xl font-bold text-[--color-background]">RT</span>
          </div>
          <h1 className="text-2xl font-bold text-[--color-text]">Admin Dashboard</h1>
          <p className="text-[--color-text-muted] mt-2">Enter your API key to continue</p>
        </div>

        {/* Login Form */}
        <div className="bg-[--color-surface] rounded-2xl border border-[--color-border] p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
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
              <div className="relative">
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  error={errors.password?.message}
                />
                <Lock size={18} className="absolute right-3 top-9 text-[--color-text-muted]" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[--color-danger]/10 text-[--color-danger] text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isChecking}>
              {isChecking ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Connecting...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-[--color-text-muted] mt-6">
            Your credentials are securely handled by Supabase Auth.
          </p>
        </div>
      </div>
    </div>
  );
}

