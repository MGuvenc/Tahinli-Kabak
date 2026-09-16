import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Save, Eye, ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/helpers';
import { slugify, generateUniqueSlug, calculateReadingTime } from '@/lib/utils';
import ImageUpload from '@/components/ui/ImageUpload';

type Post = Tables<'posts'>;
type Tag = Tables<'tags'>;

interface BlockData {
  id: string;
  block_type: string;
  content: string;
  image_url: string;
  image_alt: string;
  layout: string;
  sort_order: number;
  isNew?: boolean;
}

export default function AdminPostEditor() {
  const { id } = useParams<{id: string;}>();
  const navigate = useNavigate();
  const isNew = !id;

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  // Post data
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  // Blocks
  const [blocks, setBlocks] = useState<BlockData[]>([]);

  // Tags
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (!supabase) return;

    const fetchData = async () => {
      // Fetch all tags
      const { data: tagsData } = await supabase.from('tags').select('*').order('name');
      setAllTags(tagsData ?? []);

      if (!isNew && id) {
        // Fetch post
        const { data: postData } = await supabase.
        from('posts').
        select('*').
        eq('id', id).
        single();

        if (postData) {
          setTitle(postData.title);
          setSlug(postData.slug);
          setExcerpt(postData.excerpt ?? '');
          setCoverImage(postData.cover_image_url ?? '');
          setStatus(postData.status as 'draft' | 'published');
          setIsAnonymous(postData.is_anonymous_submission ?? false);
          setSeoTitle(postData.seo_title ?? '');
          setSeoDescription(postData.seo_description ?? '');
          setSeoKeywords(postData.seo_keywords ?? '');

          // Fetch blocks
          const { data: blocksData } = await supabase.
          from('post_blocks').
          select('*').
          eq('post_id', id).
          order('sort_order');

          setBlocks(
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

          // Fetch post tags
          const { data: postTags } = await supabase.
          from('post_tags').
          select('tag_id').
          eq('post_id', id);

          setSelectedTags((postTags ?? []).map((pt) => pt.tag_id));
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [id, isNew]);

  const addBlock = (type: string) => {
    const newBlock: BlockData = {
      id: `new-${Date.now()}`,
      block_type: type,
      content: '',
      image_url: '',
      image_alt: '',
      layout: 'full',
      sort_order: blocks.length,
      isNew: true
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (blockId: string, updates: Partial<BlockData>) => {
    setBlocks(blocks.map((b) => b.id === blockId ? { ...b, ...updates } : b));
  };

  const removeBlock = (blockId: string) => {
    setBlocks(blocks.filter((b) => b.id !== blockId));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks.map((b, i) => ({ ...b, sort_order: i })));
  };

  const addTag = async () => {
    if (!supabase || !newTag.trim()) return;

    const tagSlug = slug;
    const { data, error } = await supabase.
    from('tags').
    insert({ name: newTag.trim(), slug: tagSlug }).
    select().
    single();

    if (!error && data) {
      setAllTags([...allTags, data]);
      setSelectedTags([...selectedTags, data.id]);
      setNewTag('');
    }
  };

  const handleSave = async (publish = false) => {
    if (!supabase || !title.trim()) return;

    setSaving(true);

    // Calculate reading time from blocks content
    const allContent = blocks.
    filter((b) => b.block_type === 'text').
    map((b) => b.content).
    join(' ');
    const readingTime = calculateReadingTime(allContent || excerpt);

    const finalSlug = await generateUniqueSlug(supabase, title.trim(), isNew ? undefined : id);

    const postData = {
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt.trim() || null,
      cover_image_url: coverImage.trim() || null,
      status: publish ? 'published' : status,
      is_anonymous_submission: isAnonymous,
      reading_time_minutes: readingTime,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
      seo_keywords: seoKeywords.trim() || null,
      published_at: publish && status !== 'published' ? new Date().toISOString() : undefined
    };

    let postId = id;

    if (isNew) {
      const { data, error } = await supabase.from('posts').insert(postData).select().single();

      if (error) {
        alert('Yazı kaydedilemedi: ' + error.message);
        setSaving(false);
        return;
      }
      postId = data.id;
    } else {
      const { error } = await supabase.from('posts').update(postData).eq('id', id);

      if (error) {
        alert('Yazı güncellenemedi: ' + error.message);
        setSaving(false);
        return;
      }
    }

    // Save blocks
    if (postId) {
      // Delete existing blocks
      await supabase.from('post_blocks').delete().eq('post_id', postId);

      // Insert new blocks
      if (blocks.length > 0) {
        const blocksToInsert = blocks.map((b, i) => ({
          post_id: postId,
          block_type: b.block_type,
          content: b.content || null,
          image_url: b.image_url || null,
          image_alt: b.image_alt || null,
          layout: b.layout,
          sort_order: i
        }));

        await supabase.from('post_blocks').insert(blocksToInsert);
      }

      // Save tags
      await supabase.from('post_tags').delete().eq('post_id', postId);
      if (selectedTags.length > 0) {
        const tagsToInsert = selectedTags.map((tagId) => ({
          post_id: postId,
          tag_id: tagId
        }));
        await supabase.from('post_tags').insert(tagsToInsert);
      }
    }

    setSaving(false);
    navigate('/admin/yazilar');
  };

  if (loading) {
    return (
      <div data-ev-id="ev_4d21ffba83" className="flex items-center justify-center py-12">
        <div data-ev-id="ev_2b37415298" className="animate-spin w-8 h-8 border-4 border-pumpkin border-t-transparent rounded-full" />
      </div>);

  }

  return (
    <div data-ev-id="ev_1d65630154">
      <div data-ev-id="ev_934dc73899" className="flex items-center justify-between mb-8">
        <div data-ev-id="ev_951ad62f42" className="flex items-center gap-4">
          <button data-ev-id="ev_a20c77e573"
          onClick={() => navigate('/admin/yazilar')}
          className="p-2 rounded-lg hover:bg-muted transition-colors">

            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 data-ev-id="ev_a8f76ba721" className="font-display text-2xl font-bold text-pine">
            {isNew ? 'Yeni Yazı' : 'Yazıyı Düzenle'}
          </h1>
        </div>
        <div data-ev-id="ev_d560277219" className="flex items-center gap-2">
          <button data-ev-id="ev_8a28d15d3e"
          onClick={() => handleSave(false)}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-lg transition-colors disabled:opacity-50">

            <Save className="w-5 h-5" />
            Kaydet
          </button>
          <button data-ev-id="ev_c25811a111"
          onClick={() => handleSave(true)}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-pumpkin hover:bg-pumpkin-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50">

            <Eye className="w-5 h-5" />
            Yayınla
          </button>
        </div>
      </div>

      <div data-ev-id="ev_651bf89276" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div data-ev-id="ev_b309616c65" className="lg:col-span-2 flex flex-col gap-6">
          {/* Title & Slug */}
          <div data-ev-id="ev_766b8b01eb" className="bg-card rounded-xl p-6 shadow-soft">
            <div data-ev-id="ev_47274a80d3" className="flex flex-col gap-4">
              <div data-ev-id="ev_f0c9850c2c">
                <label data-ev-id="ev_1a202b971f" className="block text-sm font-medium mb-2">Başlık</label>
                <input data-ev-id="ev_492db28eaa"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin text-lg font-display"
                placeholder="Yazının başlığı" />

              </div>
              <div data-ev-id="ev_2268ca0f01">
                <label data-ev-id="ev_53e9083da4" className="block text-sm font-medium mb-2">URL (Slug)</label>
                <div data-ev-id="ev_d8de9a629d" className="flex items-center gap-2">
                  <span data-ev-id="ev_06e8b6b1b1" className="text-muted-foreground text-sm">/yazi/</span>
                  <input data-ev-id="ev_2b615f814d"
                  type="text"
                  value={slug || '(başlığa göre otomatik oluşturulacak)'}
                  readOnly
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed" />
                </div>
              </div>
              <div data-ev-id="ev_af8db225d4">
                <label data-ev-id="ev_334d80af07" className="block text-sm font-medium mb-2">Özet</label>
                <textarea data-ev-id="ev_f20bef0aa3"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin resize-none"
                placeholder="Yazının kısa özeti..." />

              </div>
            </div>
          </div>

          {/* Content Blocks */}
          <div data-ev-id="ev_3ec92207fc" className="bg-card rounded-xl p-6 shadow-soft">
            <h2 data-ev-id="ev_cf4ffb0787" className="font-display text-lg font-bold text-pine mb-4">İçerik Blokları</h2>

            {blocks.length > 0 ?
            <div data-ev-id="ev_8c91256b87" className="flex flex-col gap-4 mb-4">
                {blocks.map((block, index) =>
              <motion.div data-ev-id="ev_0ac9bd48ff"
              key={block.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-border rounded-lg p-4">

                    <div data-ev-id="ev_8d779bf84b" className="flex items-center justify-between mb-3">
                      <div data-ev-id="ev_f62700b10d" className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                        <span data-ev-id="ev_22cba8f3c6" className="text-sm font-medium capitalize">
                          {block.block_type === 'text' ?
                      'Metin' :
                      block.block_type === 'image' ?
                      'Görsel' :
                      block.block_type === 'quote' ?
                      'Alıntı' :
                      block.block_type}
                        </span>
                      </div>
                      <div data-ev-id="ev_2cb976cfa2" className="flex items-center gap-1">
                        <button data-ev-id="ev_896bf8710e"
                    onClick={() => moveBlock(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30">

                          ↑
                        </button>
                        <button data-ev-id="ev_ee0c24c8f2"
                    onClick={() => moveBlock(index, 'down')}
                    disabled={index === blocks.length - 1}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30">

                          ↓
                        </button>
                        <button data-ev-id="ev_cb3c5f926f"
                    onClick={() => removeBlock(block.id)}
                    className="p-1 text-destructive hover:text-destructive/80">

                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {block.block_type === 'text' &&
                <textarea data-ev-id="ev_5d1a15227a"
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin resize-none"
                placeholder="Metin içeriği..." />

                }

                    {block.block_type === 'image' &&
                <div data-ev-id="ev_b5ffe9f023" className="flex flex-col gap-3">
                        <ImageUpload
                    value={block.image_url}
                    onChange={(url) => updateBlock(block.id, { image_url: url })}
                    folder="posts" />

                        <input data-ev-id="ev_d68d8e2464"
                  type="text"
                  value={block.image_alt}
                  onChange={(e) => updateBlock(block.id, { image_alt: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin"
                  placeholder="Görsel açıklaması (alt text)" />

                        <select data-ev-id="ev_21ca74c36b"
                  value={block.layout}
                  onChange={(e) => updateBlock(block.id, { layout: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin">

                          <option data-ev-id="ev_70ac8fc301" value="full">Tam genişlik</option>
                          <option data-ev-id="ev_f9b325bf8a" value="image-left">Görsel solda</option>
                          <option data-ev-id="ev_b54b6523e9" value="image-right">Görsel sağda</option>
                        </select>
                      </div>
                }

                    {block.block_type === 'quote' &&
                <textarea data-ev-id="ev_36683705b5"
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin resize-none italic"
                placeholder="Alıntı metni..." />

                }
                  </motion.div>
              )}
              </div> :

            <p data-ev-id="ev_4c23d0a5d1" className="text-muted-foreground text-sm mb-4">Henüz içerik bloğu eklenmemiş.</p>
            }

            {/* Add block buttons */}
            <div data-ev-id="ev_ee5b462a00" className="flex flex-wrap gap-2">
              <button data-ev-id="ev_54792193a8"
              onClick={() => addBlock('text')}
              className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors">

                <Plus className="w-4 h-4" />
                Metin
              </button>
              <button data-ev-id="ev_d4a14290f9"
              onClick={() => addBlock('image')}
              className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors">

                <Plus className="w-4 h-4" />
                Görsel
              </button>
              <button data-ev-id="ev_54dcea041d"
              onClick={() => addBlock('quote')}
              className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors">

                <Plus className="w-4 h-4" />
                Alıntı
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div data-ev-id="ev_86291b8308" className="flex flex-col gap-6">
          {/* Cover Image */}
          <div data-ev-id="ev_3f998603e4" className="bg-card rounded-xl p-6 shadow-soft">
            <h3 data-ev-id="ev_ef38c847e8" className="font-display font-semibold text-pine mb-4">Kapak Görseli</h3>
            <ImageUpload
              value={coverImage}
              onChange={setCoverImage}
              folder="covers" />

          </div>

          {/* Settings */}
          <div data-ev-id="ev_24c358a922" className="bg-card rounded-xl p-6 shadow-soft">
            <h3 data-ev-id="ev_d65520854d" className="font-display font-semibold text-pine mb-4">Ayarlar</h3>
            <div data-ev-id="ev_edab68481a" className="flex flex-col gap-4">
              <label data-ev-id="ev_b7f4c2e4fd" className="flex items-center gap-3 cursor-pointer">
                <input data-ev-id="ev_456672ab2f"
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 rounded border-border text-pumpkin focus:ring-pumpkin" />

                <span data-ev-id="ev_7bc7fa0e6d" className="text-sm">Anonim yazı olarak işaretle</span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div data-ev-id="ev_d03de05239" className="bg-card rounded-xl p-6 shadow-soft">
            <h3 data-ev-id="ev_1520bb7715" className="font-display font-semibold text-pine mb-4">Etiketler</h3>
            <div data-ev-id="ev_ca6b0b7b8c" className="flex flex-wrap gap-2 mb-4">
              {allTags.map((tag) =>
              <button data-ev-id="ev_876d414506"
              key={tag.id}
              onClick={() => {
                if (selectedTags.includes(tag.id)) {
                  setSelectedTags(selectedTags.filter((t) => t !== tag.id));
                } else {
                  setSelectedTags([...selectedTags, tag.id]);
                }
              }}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedTags.includes(tag.id) ?
              'bg-pumpkin text-white' :
              'bg-muted text-muted-foreground hover:bg-muted/80'}`
              }>

                  {tag.name}
                </button>
              )}
            </div>
            <div data-ev-id="ev_c215c90238" className="flex gap-2">
              <input data-ev-id="ev_f2fe156f2e"
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin text-sm"
              placeholder="Yeni etiket" />

              <button data-ev-id="ev_9240931469"
              onClick={addTag}
              className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm">

                Ekle
              </button>
            </div>
          </div>

          {/* SEO */}
          <div data-ev-id="ev_d57e82ce52" className="bg-card rounded-xl p-6 shadow-soft">
            <h3 data-ev-id="ev_f5c046fc9c" className="font-display font-semibold text-pine mb-4">SEO</h3>
            <div data-ev-id="ev_ef129c505f" className="flex flex-col gap-4">
              <div data-ev-id="ev_1e412aadb4">
                <label data-ev-id="ev_ae64c4dda4" className="block text-sm font-medium mb-1">SEO Başlığı</label>
                <input data-ev-id="ev_4bbb44fe8f"
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin text-sm"
                placeholder={title || 'Sayfa başlığı'} />

              </div>
              <div data-ev-id="ev_e24e0984b0">
                <label data-ev-id="ev_0e7943d68b" className="block text-sm font-medium mb-1">Meta Açıklama</label>
                <textarea data-ev-id="ev_1d313f90a8"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin text-sm resize-none"
                placeholder={excerpt || 'Sayfa açıklaması'} />

              </div>
              <div data-ev-id="ev_e873804164">
                <label data-ev-id="ev_16bf08d1ce" className="block text-sm font-medium mb-1">Anahtar Kelimeler</label>
                <input data-ev-id="ev_8702c17816"
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-pumpkin text-sm"
                placeholder="kelime1, kelime2, kelime3" />

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}