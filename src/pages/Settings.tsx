import { useState, useRef } from 'react'
import { Moon, Sun, Trash2, Plus, Download, Upload } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSettingsStore } from '@/store/settings'
import { useBloatingStore } from '@/store/bloating'
import { useBowelStore } from '@/store/bowel'
import { useWellnessStore } from '@/store/wellness'
import { useEatingStore } from '@/store/eating'
import { useRemindersStore } from '@/store/reminders'
import { exportJSON } from '@/lib/export'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const SECTIONS = [
  { id: 'bloating', label: 'Bloating tracker' },
  { id: 'bowel', label: 'Bowel movement tracker' },
  { id: 'wellness', label: 'Wellness tracker' },
  { id: 'eating', label: 'Eating tracker' },
  { id: 'reminders', label: 'Reminders' },
]

function TagList({ items, onRemove, onAdd, placeholder }: {
  items: string[]
  onRemove: (v: string) => void
  onAdd: (v: string) => void
  placeholder: string
}) {
  const [input, setInput] = useState('')
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span key={item} className="flex items-center gap-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border)] px-2.5 py-0.5 text-xs text-[var(--text)]">
            {item}
            <button onClick={() => onRemove(item)} className="text-[var(--text-muted)] hover:text-[var(--destructive)]">
              <Trash2 className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="h-8 text-xs"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && input.trim()) {
              onAdd(input.trim())
              setInput('')
            }
          }}
        />
        <Button
          size="sm"
          variant="outline"
          className="shrink-0"
          disabled={!input.trim()}
          onClick={() => { onAdd(input.trim()); setInput('') }}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

export function Settings() {
  const settings = useSettingsStore()
  const bloating = useBloatingStore()
  const bowel = useBowelStore()
  const wellness = useWellnessStore()
  const eating = useEatingStore()
  const reminders = useRemindersStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importDialog, setImportDialog] = useState<{ data: Record<string, unknown> } | null>(null)
  const [importError, setImportError] = useState<string | null>(null)

  function handleDarkMode(checked: boolean) {
    settings.set({ darkMode: checked })
    document.documentElement.classList.toggle('dark', checked)
  }

  function handleExport() {
    exportJSON({
      bloating: bloating.entries,
      bowel: bowel.entries,
      wellness: wellness.entries,
      eating: eating.entries,
      reminders: reminders.tasks,
      exportedAt: new Date().toISOString(),
    }, 'pt-helper-export')
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!fileInputRef.current) return
    fileInputRef.current.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string)
        if (typeof parsed !== 'object' || parsed === null) throw new Error('Invalid format')
        setImportError(null)
        setImportDialog({ data: parsed as Record<string, unknown> })
      } catch {
        setImportError('Invalid JSON file.')
      }
    }
    reader.readAsText(file)
  }

  function applyImport(mode: 'merge' | 'replace') {
    if (!importDialog) return
    const { data } = importDialog
    if (mode === 'replace') {
      if (Array.isArray(data.bloating)) bloating.replace(data.bloating)
      if (Array.isArray(data.bowel)) bowel.replace(data.bowel)
      if (Array.isArray(data.wellness)) wellness.replace(data.wellness)
      if (Array.isArray(data.eating)) eating.replace(data.eating)
      if (Array.isArray(data.reminders)) reminders.replace(data.reminders)
    } else {
      if (Array.isArray(data.bloating)) data.bloating.forEach((e) => bloating.restore(e))
      if (Array.isArray(data.bowel)) data.bowel.forEach((e) => bowel.restore(e))
      if (Array.isArray(data.wellness)) data.wellness.forEach((e) => wellness.restore(e))
      if (Array.isArray(data.eating)) data.eating.forEach((e) => eating.restore(e))
      if (Array.isArray(data.reminders)) data.reminders.forEach((t) => reminders.restore(t))
    }
    setImportDialog(null)
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Settings" />
      <div className="flex-1 p-4 mb-nav flex flex-col gap-4">

        {/* Appearance */}
        <Card>
          <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <Label>Dark mode</Label>
              </div>
              <Switch checked={settings.darkMode} onCheckedChange={handleDarkMode} />
            </div>
          </CardContent>
        </Card>

        {/* Visible sections */}
        <Card>
          <CardHeader><CardTitle>Home Sections</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {SECTIONS.map(({ id, label }) => (
              <div key={id} className="flex items-center justify-between">
                <Label className="font-normal">{label}</Label>
                <Switch
                  checked={!settings.hiddenSections.includes(id)}
                  onCheckedChange={() => settings.toggleSection(id)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Custom stool types */}
        <Card>
          <CardHeader><CardTitle>Stool Types</CardTitle></CardHeader>
          <CardContent>
            <TagList
              items={settings.customStoolTypes}
              onRemove={settings.removeCustomStoolType}
              onAdd={settings.addCustomStoolType}
              placeholder="Add stool type…"
            />
          </CardContent>
        </Card>

        {/* Custom emptiness options */}
        <Card>
          <CardHeader><CardTitle>Emptiness Options</CardTitle></CardHeader>
          <CardContent>
            <TagList
              items={settings.customEmptinessOptions}
              onRemove={settings.removeCustomEmptiness}
              onAdd={settings.addCustomEmptiness}
              placeholder="Add option…"
            />
          </CardContent>
        </Card>

        {/* Custom meal times */}
        <Card>
          <CardHeader><CardTitle>Meal Times</CardTitle></CardHeader>
          <CardContent>
            <TagList
              items={settings.customMealTimes}
              onRemove={settings.removeCustomMealTime}
              onAdd={settings.addCustomMealTime}
              placeholder="Add meal time…"
            />
          </CardContent>
        </Card>

        {/* Data export / import */}
        <Card>
          <CardHeader><CardTitle>Data</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button variant="outline" onClick={handleExport} className="w-full gap-2">
              <Download className="h-4 w-4" />
              Export all data (JSON)
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full gap-2">
              <Upload className="h-4 w-4" />
              Import data (JSON)
            </Button>
            <input ref={fileInputRef} type="file" accept=".json,application/json" className="hidden" onChange={handleFileChange} />
            {importError && <p className="text-xs text-[var(--destructive)]">{importError}</p>}
          </CardContent>
        </Card>

        <Dialog open={!!importDialog} onOpenChange={(o) => { if (!o) setImportDialog(null) }}>
          <DialogContent>
            <DialogHeader><DialogTitle>Import data</DialogTitle></DialogHeader>
            <p className="text-sm text-[var(--text-muted)]">
              <strong>Merge</strong> adds imported records without removing existing ones (duplicates by ID are skipped).<br />
              <strong>Replace</strong> overwrites all existing data with the imported file.
            </p>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" className="flex-1" onClick={() => applyImport('merge')}>Merge</Button>
              <Button variant="destructive" className="flex-1" onClick={() => applyImport('replace')}>Replace</Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}
