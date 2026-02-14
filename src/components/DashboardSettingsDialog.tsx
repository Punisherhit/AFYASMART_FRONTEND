import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type DashboardSettings = {
  enableAlerts: boolean;
  compactMode: boolean;
  autoRefresh: boolean;
  refreshIntervalMinutes: number;
  timezone: string;
  theme: "system" | "light" | "dark";
};

type DashboardSettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storageKey: string;
  title: string;
  description: string;
};

const DEFAULT_SETTINGS: DashboardSettings = {
  enableAlerts: true,
  compactMode: false,
  autoRefresh: true,
  refreshIntervalMinutes: 5,
  timezone: "Africa/Nairobi",
  theme: "system"
};

const DashboardSettingsDialog = ({
  open,
  onOpenChange,
  storageKey,
  title,
  description
}: DashboardSettingsDialogProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<DashboardSettings>(DEFAULT_SETTINGS);

  const resolvedStorageKey = useMemo(() => `afya-settings-${storageKey}`, [storageKey]);

  useEffect(() => {
    if (!open) return;

    const raw = localStorage.getItem(resolvedStorageKey);
    if (!raw) {
      setSettings(DEFAULT_SETTINGS);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as DashboardSettings;
      setSettings({ ...DEFAULT_SETTINGS, ...parsed });
    } catch {
      setSettings(DEFAULT_SETTINGS);
    }
  }, [open, resolvedStorageKey]);

  const saveSettings = () => {
    localStorage.setItem(resolvedStorageKey, JSON.stringify(settings));
    onOpenChange(false);
    toast({
      title: "Settings saved",
      description: "Your preferences were updated successfully."
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem(resolvedStorageKey, JSON.stringify(DEFAULT_SETTINGS));
    toast({
      title: "Settings reset",
      description: "Dashboard settings restored to defaults."
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label>Enable desktop alerts</Label>
              <p className="text-xs text-muted-foreground">Receive critical workflow updates.</p>
            </div>
            <Switch checked={settings.enableAlerts} onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enableAlerts: checked }))} />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label>Compact mode</Label>
              <p className="text-xs text-muted-foreground">Show denser cards and lists.</p>
            </div>
            <Switch checked={settings.compactMode} onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, compactMode: checked }))} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={settings.theme} onValueChange={(value: "system" | "light" | "dark") => setSettings((prev) => ({ ...prev, theme: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={settings.timezone} onValueChange={(value) => setSettings((prev) => ({ ...prev, timezone: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Nairobi">Africa/Nairobi</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="Europe/London">Europe/London</SelectItem>
                  <SelectItem value="America/New_York">America/New_York</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Auto refresh</Label>
              <div className="rounded-md border p-2">
                <Switch checked={settings.autoRefresh} onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoRefresh: checked }))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Refresh interval (minutes)</Label>
              <Input
                type="number"
                min={1}
                max={60}
                value={settings.refreshIntervalMinutes}
                onChange={(e) => setSettings((prev) => ({ ...prev, refreshIntervalMinutes: Number(e.target.value) || 1 }))}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={resetSettings}>Reset defaults</Button>
          <Button onClick={saveSettings}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardSettingsDialog;
