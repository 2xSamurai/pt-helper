import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { BottomNav } from '@/components/BottomNav'
import { Home } from '@/pages/Home'
import { Trackers } from '@/pages/Trackers'
import { Settings } from '@/pages/Settings'
import { BloatingList } from '@/features/bloating/pages/BloatingList'
import { BloatingDetail } from '@/features/bloating/pages/BloatingDetail'
import { BowelList } from '@/features/bowel/pages/BowelList'
import { BowelDetail } from '@/features/bowel/pages/BowelDetail'
import { WellnessList } from '@/features/wellness/pages/WellnessList'
import { WellnessDetail } from '@/features/wellness/pages/WellnessDetail'
import { EatingList } from '@/features/eating/pages/EatingList'
import { EatingDetail } from '@/features/eating/pages/EatingDetail'
import { RemindersList } from '@/features/reminders/pages/RemindersList'
import { useSettingsStore } from '@/store/settings'

export default function App() {
  const { darkMode } = useSettingsStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className="flex flex-col min-h-dvh max-w-lg mx-auto relative">
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trackers" element={<Trackers />} />
          <Route path="/trackers/bloating" element={<BloatingList />} />
          <Route path="/trackers/bloating/:id" element={<BloatingDetail />} />
          <Route path="/trackers/bowel" element={<BowelList />} />
          <Route path="/trackers/bowel/:id" element={<BowelDetail />} />
          <Route path="/trackers/wellness" element={<WellnessList />} />
          <Route path="/trackers/wellness/:id" element={<WellnessDetail />} />
          <Route path="/trackers/eating" element={<EatingList />} />
          <Route path="/trackers/eating/:id" element={<EatingDetail />} />
          <Route path="/reminders" element={<RemindersList />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}
