import { useQuery } from '@tanstack/react-query';
import { Users, Ticket, CheckCircle, XCircle, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { listUsers } from '../api/users';
import { listBonusCodes } from '../api/bonusCodes';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  color: 'cyan' | 'green' | 'yellow' | 'red';
}

function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  const colors = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 text-cyan-400',
    green: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400',
    yellow: 'from-amber-500/20 to-amber-500/5 text-amber-400',
    red: 'from-rose-500/20 to-rose-500/5 text-rose-400',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[--color-text-muted] mb-1">{title}</p>
            <p className="text-3xl font-bold text-[--color-text] font-[family-name:var(--font-mono)]">
              {value}
            </p>
            {trend && (
              <p className="text-xs text-[--color-text-muted] mt-2 flex items-center gap-1">
                <TrendingUp size={12} />
                {trend}
              </p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center`}>
            <Icon size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => listUsers(),
  });

  const { data: bonusCodesData, isLoading: bonusCodesLoading } = useQuery({
    queryKey: ['bonusCodes'],
    queryFn: () => listBonusCodes(),
  });

  const users = usersData?.data || [];
  const bonusCodes = bonusCodesData?.data || [];
  const redeemedCodes = bonusCodes.filter(code => code.is_redeemed);
  const unredeemedCodes = bonusCodes.filter(code => !code.is_redeemed);

  const isLoading = usersLoading || bonusCodesLoading;

  // Get recent items
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const recentBonusCodes = [...bonusCodes]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[--color-text]">Dashboard</h1>
        <p className="text-[--color-text-muted] mt-1">Overview of your application data</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={isLoading ? '...' : users.length}
          icon={Users}
          color="cyan"
        />
        <StatCard
          title="Bonus Codes"
          value={isLoading ? '...' : bonusCodes.length}
          icon={Ticket}
          color="yellow"
        />
        <StatCard
          title="Redeemed"
          value={isLoading ? '...' : redeemedCodes.length}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Unredeemed"
          value={isLoading ? '...' : unredeemedCodes.length}
          icon={XCircle}
          color="red"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <div className="px-6 py-4 border-b border-[--color-border]">
            <h3 className="font-semibold text-[--color-text] flex items-center gap-2">
              <Users size={18} className="text-[--color-accent]" />
              Recent Users
            </h3>
          </div>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 text-center text-[--color-text-muted]">Loading...</div>
            ) : recentUsers.length === 0 ? (
              <div className="p-6 text-center text-[--color-text-muted]">No users yet</div>
            ) : (
              <div className="divide-y divide-[--color-border]">
                {recentUsers.map((user) => (
                  <div key={user.club_gg_id} className="px-6 py-3 flex items-center justify-between hover:bg-[--color-surface-hover]/50 transition-colors">
                    <div>
                      <p className="font-medium text-[--color-text] font-[family-name:var(--font-mono)] text-sm">
                        {user.club_gg_username}
                      </p>
                      <p className="text-xs text-[--color-text-muted]">
                        ID: {user.club_gg_id}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[--color-text-muted]">
                      <Clock size={12} />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Bonus Codes */}
        <Card>
          <div className="px-6 py-4 border-b border-[--color-border]">
            <h3 className="font-semibold text-[--color-text] flex items-center gap-2">
              <Ticket size={18} className="text-[--color-accent]" />
              Recent Bonus Codes
            </h3>
          </div>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 text-center text-[--color-text-muted]">Loading...</div>
            ) : recentBonusCodes.length === 0 ? (
              <div className="p-6 text-center text-[--color-text-muted]">No bonus codes yet</div>
            ) : (
              <div className="divide-y divide-[--color-border]">
                {recentBonusCodes.map((code) => (
                  <div key={code.id} className="px-6 py-3 flex items-center justify-between hover:bg-[--color-surface-hover]/50 transition-colors">
                    <div>
                      <p className="font-medium text-[--color-text] font-[family-name:var(--font-mono)] text-sm">
                        {code.code}
                      </p>
                      <p className="text-xs text-[--color-text-muted]">
                        {code.bonus_type}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      code.is_redeemed 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {code.is_redeemed ? 'Redeemed' : 'Available'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

