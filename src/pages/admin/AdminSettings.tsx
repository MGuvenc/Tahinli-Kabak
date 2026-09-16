import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, Palette } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/helpers';

type SiteSetting = Tables<'site_settings'>;

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form fields
  const [siteTitle, setSiteTitle] = useState('');
  const [footerText, setFooterText] = useState('');
  const [aboutContent, setAboutContent] = useState('');
  const [aboutImageUrl, setAboutImageUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data } = await supabase.
    from('site_settings').
    select('*').
    limit(1).
    single();

    if (data) {
      setSettings(data);
      setSiteTitle(data.site_title ?? '');
      setFooterText(data.footer_text ?? '');
      setAboutContent(data.about_content ?? '');
      setAboutImageUrl(data.about_image_url ?? '');
      setLogoUrl(data.logo_url ?? '');
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!supabase) return;

    setSaving(true);

    const updates = {
      site_title: siteTitle,
      footer_text: footerText,
      about_content: aboutContent,
      about_image_url: aboutImageUrl || null,
      logo_url: logoUrl || null
    };

    if (settings) {
      // Update existing
      const { error } = await supabase.
      from('site_settings').
      update(updates).
      eq('id', settings.id);

      if (error) {
        alert('Ayarlar kaydedilemedi: ' + error.message);
      }
    } else {
      // Create new
      const { error } = await supabase.
      from('site_settings').
      insert(updates);

      if (error) {
        alert('Ayarlar oluşturulamadı: ' + error.message);
      }
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div data-ev-id="ev_320bbf7d38" className="flex items-center justify-center py-12">
        <div data-ev-id="ev_4f6f77d665" className="animate-spin w-8 h-8 border-4 border-pumpkin border-t-transparent rounded-full" />
      </div>);

  }

  return (
    <div data-ev-id="ev_7dab3b265c">
      <div data-ev-id="ev_3972fccbcb" className="flex items-center justify-between mb-8">
        <h1 data-ev-id="ev_be9a5072e7" className="font-display text-3xl font-bold text-pine">Ayarlar</h1>
        <button data-ev-id="ev_eaf8731ca4"
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-4 py-2 bg-pumpkin hover:bg-pumpkin-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50">

          <Save className="w-5 h-5" />
          {saving ? 'Kaydediliyor...' : saved ? 'Kaydedildi ✓' : 'Kaydet'}
        </button>
      </div>

      <div data-ev-id="ev_39f509fce6" className="flex flex-col gap-6">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-6 shadow-soft">

          <div data-ev-id="ev_1458aed9d0" className="flex items-center gap-3 mb-6">
            <div data-ev-id="ev_f616d1d1d1" className="p-2 bg-pumpkin/10 rounded-lg">
              <Globe className="w-5 h-5 text-pumpkin" />
            </div>
            <h2 data-ev-id="ev_9d81e2a9d2" className="font-display text-lg font-bold text-pine">Genel</h2>
          </div>

          <div data-ev-id="ev_486f12693c" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div data-ev-id="ev_06d09bf47f">
              <label data-ev-id="ev_6901210045" className="block text-sm font-medium mb-1">Site Başlığı</label>
              <input data-ev-id="ev_e4d2ac7a51"
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin"
              placeholder="tahinlikabak" />

            </div>
            <div data-ev-id="ev_1630ddd8dc">
              <label data-ev-id="ev_d029b91f5c" className="block text-sm font-medium mb-1">Logo URL</label>
              <input data-ev-id="ev_8ee805c3c4"
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin"
              placeholder="https://..." />

            </div>
            <div data-ev-id="ev_61b44b217a" className="md:col-span-2">
              <label data-ev-id="ev_df10024374" className="block text-sm font-medium mb-1">Footer Metni</label>
              <input data-ev-id="ev_22102feba0"
              type="text"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin"
              placeholder="Tahin + Kabak ile yapıldı ❤️" />

            </div>
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-6 shadow-soft">

          <div data-ev-id="ev_f37f77b3ab" className="flex items-center gap-3 mb-6">
            <div data-ev-id="ev_7246d947c5" className="p-2 bg-pumpkin/10 rounded-lg">
              <Palette className="w-5 h-5 text-pumpkin" />
            </div>
            <h2 data-ev-id="ev_aaed9c79cb" className="font-display text-lg font-bold text-pine">Hakkımda Sayfası</h2>
          </div>

          <div data-ev-id="ev_4b891e4979" className="flex flex-col gap-4">
            <div data-ev-id="ev_ff746d931d">
              <label data-ev-id="ev_589ae47bd0" className="block text-sm font-medium mb-1">Hakkımda Görseli URL</label>
              <input data-ev-id="ev_2d72be0f70"
              type="url"
              value={aboutImageUrl}
              onChange={(e) => setAboutImageUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin"
              placeholder="https://..." />

              {aboutImageUrl &&
              <img data-ev-id="ev_c8c30b61b5"
              src={aboutImageUrl}
              alt="Hakkımda görseli"
              className="mt-2 w-32 h-32 object-cover rounded-lg" />

              }
            </div>
            <div data-ev-id="ev_6ced1d5284">
              <label data-ev-id="ev_25e514b0fc" className="block text-sm font-medium mb-1">Hakkımda İçeriği</label>
              <textarea data-ev-id="ev_759500eecc"
              value={aboutContent}
              onChange={(e) => setAboutContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin resize-none"
              placeholder="Merhaba! Ben..." />

            </div>
          </div>
        </motion.div>

        {/* Info Card */}
        <div data-ev-id="ev_6b26b4e1f2" className="bg-pumpkin/10 rounded-xl p-6">
          <h3 data-ev-id="ev_eb5bb1f887" className="font-display font-bold text-pine mb-2">🎃 İpucu</h3>
          <p data-ev-id="ev_a9cc06de3a" className="text-muted-foreground text-sm">
            Buradaki ayarlar sitenin genel görünümünü etkiler. Renk teması ve font
            değişiklikleri için theme.css dosyasını düzenleyebilirsin.
          </p>
        </div>
      </div>
    </div>);

}