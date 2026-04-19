import { Link } from 'react-router-dom'
import { Activity, Droplets, Brain, UtensilsCrossed, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/PageHeader'

const TRACKERS = [
  { label: 'Bloating', Icon: Activity, color: 'var(--bloating-color)', href: '/trackers/bloating' },
  { label: 'Bowel Movement', Icon: Droplets, color: 'var(--bowel-color)', href: '/trackers/bowel' },
  { label: 'Wellness', Icon: Brain, color: 'var(--wellness-color)', href: '/trackers/wellness' },
  { label: 'Eating', Icon: UtensilsCrossed, color: 'var(--eating-color)', href: '/trackers/eating' },
]

export function Trackers() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Trackers" />
      <div className="flex-1 p-4 mb-nav flex flex-col gap-3">
        {TRACKERS.map(({ label, Icon, color, href }) => (
          <Link key={href} to={href}>
            <Card className="active:opacity-70 transition-opacity">
              <CardContent className="pt-4 pb-4 flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center" style={{ background: color }}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <p className="flex-1 font-medium text-[var(--text)]">{label}</p>
                <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
