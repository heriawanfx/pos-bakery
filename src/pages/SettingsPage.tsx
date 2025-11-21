import { type FormEvent, useState } from "react";
import { useSettingsStore } from "../stores/useSettingsStore";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useToast } from "../components/ui/ToastProvider";

export function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettingsStore();
  const { showToast } = useToast();

  const [siteName, setSiteName] = useState(settings.siteName);
  const [appName, setAppName] = useState(settings.appName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [businessName, setBusinessName] = useState(settings.businessName);
  const [ownerName, setOwnerName] = useState(settings.ownerName);
  const [lowStockThreshold, setLowStockThreshold] = useState(
    settings.lowStockThreshold
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    updateSettings({
      siteName: siteName.trim() || "PoS Bakery",
      appName: appName.trim() || "PoS Bakery",
      tagline: tagline.trim(),
      businessName: businessName.trim(),
      ownerName: ownerName.trim(),
      lowStockThreshold:
        Number(lowStockThreshold) > 0 ? Number(lowStockThreshold) : 200,
    });

    showToast({
      variant: "success",
      title: "Pengaturan disimpan",
      description: "Pengaturan aplikasi telah diperbarui.",
    });
  };

  const handleReset = () => {
    resetSettings();
    setSiteName("PoS Bakery");
    setAppName("PoS Bakery");
    setTagline("Simple POS for Home Bakery");
    setBusinessName("Usaha Kue Rumahan");
    setOwnerName("");
    setLowStockThreshold(200);

    showToast({
      variant: "info",
      title: "Pengaturan direset",
      description: "Pengaturan kembali ke nilai bawaan.",
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Atur nama situs, identitas usaha, dan batas stok low stock.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Branding */}
        <Card className="p-4 space-y-3">
          <CardHeader
            title="Branding"
            description="Nama aplikasi dan tagline yang tampil di antarmuka."
          />
          <CardBody>
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                label="Site name"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="PoS Bakery"
                hint="Digunakan sebagai judul utama aplikasi."
              />
              <Input
                label="App name (NavBar)"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="PoS Bakery"
                hint="Muncul di sebelah logo / di sidebar."
              />
            </div>
            <Input
              label="Tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Simple POS for Home Bakery"
              hint="Kalimat singkat yang menjelaskan aplikasi."
            />
          </CardBody>
        </Card>

        {/* Info Usaha */}
        <Card className="p-4 space-y-3">
          <CardHeader
            title="Informasi Usaha"
            description="Detail singkat mengenai usaha bakery Anda."
          />
          <CardBody>
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                label="Nama usaha"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Usaha Kue Rumahan"
              />
              <Input
                label="Nama pemilik"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Contoh: Bu Ani"
              />
            </div>
          </CardBody>
        </Card>

        {/* Inventory / stok */}
        <Card className="p-4 space-y-3">
          <CardHeader
            title="Stok & Notifikasi"
            description="Pengaturan batas low stock untuk bahan baku."
          />
          <CardBody>
            <div className="grid gap-3 md:grid-cols-2 md:max-w-md">
              <Input
                label="Low stock threshold"
                type="number"
                min={1}
                value={lowStockThreshold}
                onChange={(e) =>
                  setLowStockThreshold(Number(e.target.value) || 0)
                }
                hint="Bahan dengan stok ≤ nilai ini akan dianggap low stock di dashboard."
              />
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-between gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
          >
            Reset ke default
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setSiteName(settings.siteName);
                setAppName(settings.appName);
                setTagline(settings.tagline);
                setBusinessName(settings.businessName);
                setOwnerName(settings.ownerName);
                setLowStockThreshold(settings.lowStockThreshold);
              }}
            >
              Batalkan perubahan
            </Button>
            <Button type="submit">Simpan pengaturan</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
