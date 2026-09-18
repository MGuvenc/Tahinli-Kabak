import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, Palette, Lock, Plus, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/helpers';
import { useAuth } from '@/hooks/useAuth';
import ImageUpload from '@/components/ui/ImageUpload';

type SiteSetting = Tables<'site_settings'>;

interface AboutBlockData {
  id: string;
  block_type: string;
  content: string;
  image_url: string;
  image_alt: string;
  layout: string;
  sort_order: number;
}

export default function AdminSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SiteSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Şifre değiştirme
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form fields
  const [siteTitle, setSiteTitle] = useState('');
  const [footerText, setFooterText] = useState('');
  const [aboutBlocks, setAboutBlocks] = useState<AboutBlockData[]>([]);
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
      setAboutImageUrl(data.about_image_url ?? '');
      setLogoUrl(data.logo_url ?? '');
    }

    const { data: blocksData } = await supabase.
    from('about_blocks').
    select('*').
    order('sort_order');

    setAboutBlocks(
      (blocksData ?? []).map((b) => ({
        id: b.id,
        block_type: b.block_type,
        content: b.content ?? '',
        image_url: b.image_url ?? '',
        image_alt: b.image_alt ?? '',
        layout: b.layout ?? 'full',
        sort_order: b.sort_order
      }))
    );

    setLoading(false);
  };

    const addAboutBlock = (type: string) => {
    setAboutBlocks([...aboutBlocks, {
      id: `new-${Date.now()}`,
      block_type: type,
      content: '',
      image_url: '',
      image_alt: '',
      layout: 'full',
      sort_order: aboutBlocks.length
    }]);
  };

  const updateAboutBlock = (blockId: string, updates: Partial<AboutBlockData>) => {
    setAboutBlocks(aboutBlocks.map((b) => b.id === blockId ? { ...b, ...updates } : b));
  };

  const removeAboutBlock = (blockId: string) => {
    setAboutBlocks(aboutBlocks.filter((b) => b.id !== blockId));
  };

  const moveAboutBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...aboutBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= aboutBlocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setAboutBlocks(newBlocks.map((b, i) => ({ ...b, sort_order: i })));
  };

  const handleSave = async () => {
    if (!supabase) return;

    setSaving(true);

    const updates = {
      site_title: siteTitle,
      footer_text: footerText,
      about_image_url: aboutImageUrl || null,
      logo_url: logoUrl || null
    };

    if (settings) {
      const { error } = await supabase.
      from('site_settings').
      update(updates).
      eq('id', settings.id);

      if (error) {
        alert('Ayarlar kaydedilemedi: ' + error.message);
      }
    } else {
      const { error } = await supabase.
      from('site_settings').
      insert(updates);

      if (error) {
        alert('Ayarlar oluşturulamadı: ' + error.message);
      }
    }

    // Hakkımda bloklarını kaydet
    await supabase.from('about_blocks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (aboutBlocks.length > 0) {
      const blocksToInsert = aboutBlocks.map((b, i) => ({
        block_type: b.block_type,
        content: b.content || null,
        image_url: b.image_url || null,
        image_alt: b.image_alt || null,
        layout: b.layout,
        sort_order: i
      }));
      await supabase.from('about_blocks').insert(blocksToInsert);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };
  
    const handleChangePassword = async () => {
    if (!supabase) return;
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Şifre en az 6 karakter olmalı.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Şifreler eşleşmiyor.' });
      return;
    }

    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPassword(false);

    if (error) {
      setPasswordMessage({ type: 'error', text: 'Şifre değiştirilemedi: ' + error.message });
      return;
    }

    setPasswordMessage({ type: 'success', text: 'Şifren başarıyla değiştirildi ✓' });
    setNewPassword('');
    setConfirmPassword('');
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
                <label className="block text-sm font-medium mb-2">Hakkımda Görseli</label>
                <ImageUpload
                  value={aboutImageUrl}
                  onChange={setAboutImageUrl}
                  folder="about" />
              </div>
            <div data-ev-id="ev_6ced1d5284">
              <label className="block text-sm font-medium mb-2">Hakkımda İçeriği</label>

              {aboutBlocks.length > 0 && (
                <div className="flex flex-col gap-4 mb-4">
                  {aboutBlocks.map((block, index) => (
                    <div key={block.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                          <span className="text-sm font-medium capitalize">
                            {block.block_type === 'text' ? 'Metin' : block.block_type === 'image' ? 'Görsel' : 'Alıntı'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => moveAboutBlock(index, 'up')} disabled={index === 0} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30">↑</button>
                          <button onClick={() => moveAboutBlock(index, 'down')} disabled={index === aboutBlocks.length - 1} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30">↓</button>
                          <button onClick={() => removeAboutBlock(block.id)} className="p-1 text-destructive hover:text-destructive/80"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>

                      {block.block_type === 'text' && (
                        <textarea
                          value={block.content}
                          onChange={(e) => updateAboutBlock(block.id, { content: e.target.value })}
                          rows={5}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin resize-none"
                          placeholder="Metin içeriği..." />
                      )}

                      {block.block_type === 'image' && (
                        <div className="flex flex-col gap-3">
                          <ImageUpload value={block.image_url} onChange={(url) => updateAboutBlock(block.id, { image_url: url })} folder="about" />
                          <input
                            type="text"
                            value={block.image_alt}
                            onChange={(e) => updateAboutBlock(block.id, { image_alt: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin"
                            placeholder="Görsel açıklaması (alt text)" />
                          <select
                            value={block.layout}
                            onChange={(e) => updateAboutBlock(block.id, { layout: e.target.value })}
                            className="px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin">
                            <option value="full">Tam genişlik</option>
                            <option value="image-left">Görsel solda</option>
                            <option value="image-right">Görsel sağda</option>
                          </select>
                        </div>
                      )}

                      {block.block_type === 'quote' && (
                        <textarea
                          value={block.content}
                          onChange={(e) => updateAboutBlock(block.id, { content: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin resize-none italic"
                          placeholder="Alıntı metni..." />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button onClick={() => addAboutBlock('text')} className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors">
                  <Plus className="w-4 h-4" /> Metin
                </button>
                <button onClick={() => addAboutBlock('image')} className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors">
                  <Plus className="w-4 h-4" /> Görsel
                </button>
                <button onClick={() => addAboutBlock('quote')} className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors">
                  <Plus className="w-4 h-4" /> Alıntı
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Account Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-6 shadow-soft">

          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-pumpkin/10 rounded-lg">
              <Lock className="w-5 h-5 text-pumpkin" />
            </div>
            <h2 className="font-display text-lg font-bold text-pine">Hesap Güvenliği</h2>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Giriş yapan hesap: <span className="font-medium text-foreground">{user?.email}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Yeni Şifre</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin"
                placeholder="En az 6 karakter" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Yeni Şifre (Tekrar)</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin"
                placeholder="Şifreyi tekrar yaz" />
            </div>
          </div>

          {passwordMessage && (
            <p className={`text-sm mb-4 ${passwordMessage.type === 'success' ? 'text-green-600' : 'text-destructive'}`}>
              {passwordMessage.text}
            </p>
          )}

          <button
            onClick={handleChangePassword}
            disabled={changingPassword || !newPassword || !confirmPassword}
            className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
            <Lock className="w-4 h-4" />
            {changingPassword ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
          </button>
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