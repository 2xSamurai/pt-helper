import { NavLink } from 'react-router-dom'
import { Home, Bell, BarChart2, Settings, Dumbbell } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/reminders', label: 'Reminders', Icon: Bell },
  { to: '/trackers', label: 'Trackers', Icon: BarChart2 },
  { to: '/settings', label: 'Settings', Icon: Settings },
]

export function SideNav() {
  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-60 border-r border-[var(--border)] bg-[var(--bg-card)] z-40">
      {/* App title */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[var(--border)]">
        <div className="h-8 w-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
          <Dumbbell className="h-4 w-4 text-[var(--primary-fg)]" />
        </div>
        <span className="font-semibold text-[var(--text)] text-sm">PT Helper</span>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[var(--bg-subtle)] text-[var(--primary)]'
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text)]'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('h-4 w-4 shrink-0', isActive && 'text-[var(--primary)]')} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-[var(--border)]">
        <p className="text-[10px] text-[var(--text-muted)]">Data stored locally</p>
      </div>
    </aside>
  )
}
