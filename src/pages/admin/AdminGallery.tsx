import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/helpers';
import { formatDate } from '@/lib/utils';
import ImageUpload from '@/components/ui/ImageUpload';

type GalleryPost = Tables<'gallery_posts'>;
type GalleryImage = Tables<'gallery_images'> & {gallery_posts?: GalleryPost;};

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // New image form
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newAltText, setNewAltText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    if (!supabase) return;

    const { data } = await supabase.
    from('gallery_images').
    select('*, gallery_posts(*)').
    order('created_at', { ascending: false });

    setImages(data ?? []);
    setLoading(false);
  };

  const handleAddImage = async () => {
    if (!supabase || !newImageUrl.trim()) return;

    setSaving(true);

    // First, create or get a gallery post
    let { data: galleryPost } = await supabase.
    from('gallery_posts').
    select('*').
    order('created_at', { ascending: false }).
    limit(1).
    single();

    if (!galleryPost) {
      const { data: newPost, error } = await supabase.
      from('gallery_posts').
      insert({ title: 'Galeri' }).
      select().
      single();

      if (error) {
        alert('Galeri oluşturulamadı: ' + error.message);
        setSaving(false);
        return;
      }
      galleryPost = newPost;
    }

    // Get max sort order
    const { data: maxSort } = await supabase.
    from('gallery_images').
    select('sort_order').
    eq('gallery_post_id', galleryPost.id).
    order('sort_order', { ascending: false }).
    limit(1);

    const nextOrder = (maxSort?.[0]?.sort_order ?? -1) + 1;

    // Insert image
    const { data: newImage, error } = await supabase.
    from('gallery_images').
    insert({
      gallery_post_id: galleryPost.id,
      image_url: newImageUrl.trim(),
      alt_text: newAltText.trim() || null,
      sort_order: nextOrder
    }).
    select('*, gallery_posts(*)').
    single();

    if (error) {
      alert('Görsel eklenemedi: ' + error.message);
    } else if (newImage) {
      setImages([newImage, ...images]);
      resetForm();
      setShowModal(false);
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    if (!confirm('Bu görseli silmek istediğinden emin misin?')) return;

    const { error } = await supabase.from('gallery_images').delete().eq('id', id);
    if (!error) {
      setImages(images.filter((img) => img.id !== id));
      if (selectedImage?.id === id) setSelectedImage(null);
    }
  };

  const resetForm = () => {
    setNewImageUrl('');
    setNewAltText('');
  };

  return (
    <div data-ev-id="ev_1a79a5ea26">
      <div data-ev-id="ev_f5e0eb64fd" className="flex items-center justify-between mb-8">
        <h1 data-ev-id="ev_cd1305b3f9" className="font-display text-3xl font-bold text-pine">Galeri</h1>
        <button data-ev-id="ev_031aaadfd6"
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-pumpkin hover:bg-pumpkin-dark text-white font-medium rounded-lg transition-colors">

          <Plus className="w-5 h-5" />
          Görsel Ekle
        </button>
      </div>

      {/* Images Grid */}
      {loading ?
      <div data-ev-id="ev_f99c9ef52e" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) =>
        <div data-ev-id="ev_3f746c3c07" key={i} className="aspect-square bg-card rounded-xl animate-pulse" />
        )}
        </div> :
      images.length > 0 ?
      <div data-ev-id="ev_afcf957ef9" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) =>
        <motion.div data-ev-id="ev_bd6dedceaf"
        key={image.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.02 }}
        className="group relative aspect-square bg-card rounded-xl overflow-hidden shadow-soft">

              <img data-ev-id="ev_0283ac8f3c"
          src={image.image_url}
          alt={image.alt_text ?? 'Galeri görseli'}
          className="w-full h-full object-cover" />

              <div data-ev-id="ev_2c1647c87f" className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button data-ev-id="ev_fd2a7eb4d5"
            onClick={() => setSelectedImage(image)}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
            title="Detay">

                  <ImageIcon className="w-5 h-5 text-white" />
                </button>
                <button data-ev-id="ev_0ad91e9a1b"
            onClick={() => handleDelete(image.id)}
            className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
            title="Sil">

                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </motion.div>
        )}
        </div> :

      <div data-ev-id="ev_9b9800a7c3" className="bg-card rounded-xl p-12 text-center">
          <span data-ev-id="ev_fd26fd8e4f" className="text-5xl mb-4 block">🖼️</span>
          <p data-ev-id="ev_45b736fefd" className="text-muted-foreground mb-4">Henüz galeri görseli yok.</p>
          <button data-ev-id="ev_309cc15667"
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-pumpkin hover:bg-pumpkin-dark text-white font-medium rounded-lg transition-colors">

            <Plus className="w-5 h-5" />
            İlk Görseli Ekle
          </button>
        </div>
      }

      {/* Add Image Modal */}
      <AnimatePresence>
        {showModal &&
        <motion.div data-ev-id="ev_0548e523ce"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowModal(false)}>

            <motion.div data-ev-id="ev_404fe378f9"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card rounded-2xl p-6 w-full max-w-md shadow-2xl">

              <div data-ev-id="ev_b736ce9302" className="flex items-center justify-between mb-6">
                <h2 data-ev-id="ev_1bb0ed4327" className="font-display text-xl font-bold text-pine">Yeni Görsel</h2>
                <button data-ev-id="ev_dbcb9bb270"
              onClick={() => setShowModal(false)}
              className="p-2 rounded-lg hover:bg-muted transition-colors">

                  <X className="w-5 h-5" />
                </button>
              </div>

              <div data-ev-id="ev_0810877979" className="flex flex-col gap-4">
                <div data-ev-id="ev_2ee8c32f4a">
                  <label data-ev-id="ev_adccd6b706" className="block text-sm font-medium mb-2">Görsel *</label>
                  <ImageUpload
                  value={newImageUrl}
                  onChange={setNewImageUrl}
                  folder="gallery" />

                </div>

                <div data-ev-id="ev_370c727cb5">
                  <label data-ev-id="ev_bbe5a408e0" className="block text-sm font-medium mb-1">Alt Metin (SEO)</label>
                  <input data-ev-id="ev_52520924c9"
                type="text"
                value={newAltText}
                onChange={(e) => setNewAltText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin"
                placeholder="Görselin açıklaması" />

                </div>

                <button data-ev-id="ev_02445525b8"
              onClick={handleAddImage}
              disabled={!newImageUrl.trim() || saving}
              className="w-full py-3 bg-pumpkin hover:bg-pumpkin-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50">

                  {saving ? 'Ekleniyor...' : 'Görsel Ekle'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Image Detail Modal */}
      <AnimatePresence>
        {selectedImage &&
        <motion.div data-ev-id="ev_067ff90acc"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={() => setSelectedImage(null)}>

            <motion.div data-ev-id="ev_113e703893"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl">

              <img data-ev-id="ev_4cc966607b"
            src={selectedImage.image_url}
            alt={selectedImage.alt_text ?? ''}
            className="w-full max-h-[60vh] object-contain bg-black" />

              <div data-ev-id="ev_872e10224b" className="p-6">
                {selectedImage.alt_text &&
              <p data-ev-id="ev_e207d7f0aa" className="text-foreground mb-2">{selectedImage.alt_text}</p>
              }
                <div data-ev-id="ev_74300e1bf3" className="flex items-center justify-between text-sm text-muted-foreground">
                  <span data-ev-id="ev_5317de04ff">{formatDate(selectedImage.created_at)}</span>
                  <button data-ev-id="ev_b0601f6dee"
                onClick={() => handleDelete(selectedImage.id)}
                className="text-destructive hover:underline">

                    Sil
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}