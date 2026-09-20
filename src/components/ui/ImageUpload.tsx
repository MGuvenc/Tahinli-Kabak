import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  folder?: string;
  className?: string;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
const MAX_SIZE = 25 * 1024 * 1024; // 5MB

export default function ImageUpload({ value, onChange, onRemove, folder = 'uploads', className = '' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (!supabase) {
      setError('Veritabanı bağlantısı yok.');
      return;
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('İzin verilen formatlar: JPG, PNG, GIF');
      return;
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      setError('Dosya boyutu en fazla 5MB olabilir.');
      return;
    }

    setError('');
    setUploading(true);

    try {
      // Generate unique filename
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage.
      from('images').
      upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage.
      from('images').
      getPublicUrl(filename);

      onChange(urlData.publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Yükleme başarısız oldu. Tekrar deneyin.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemove = () => {
    onChange('');
    onRemove?.();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div data-ev-id="ev_8568e5a76b" className={className}>
      <input data-ev-id="ev_33ee4ca200"
      ref={inputRef}
      type="file"
      accept=".jpg,.jpeg,.png,.gif"
      onChange={handleFileSelect}
      className="hidden" />


      {value ?
      <div data-ev-id="ev_040c69a6c8" className="relative group">
          <img data-ev-id="ev_6af01b2702"
        src={value}
        alt="Yüklenen görsel"
        className="w-full aspect-video object-cover rounded-lg" />

          <div data-ev-id="ev_1ab8ea8c16" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <button data-ev-id="ev_8784088748"
          type="button"
          onClick={() => inputRef.current?.click()}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
          title="Değiştir">

              <Upload className="w-5 h-5 text-white" />
            </button>
            <button data-ev-id="ev_4d62c7a208"
          type="button"
          onClick={handleRemove}
          className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
          title="Kaldır">

              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div> :

      <motion.div data-ev-id="ev_78bbbce350"
      onClick={() => !uploading && inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      whileHover={{ scale: uploading ? 1 : 1.01 }}
      className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${dragOver ? 'border-pumpkin bg-pumpkin/5' : 'border-border hover:border-pumpkin/50'}
            ${uploading ? 'cursor-wait opacity-70' : ''}
          `}>

          {uploading ?
        <div data-ev-id="ev_4bbeb52efa" className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-pumpkin animate-spin" />
              <p data-ev-id="ev_7016c00565" className="text-sm text-muted-foreground">Yükleniyor...</p>
            </div> :

        <div data-ev-id="ev_eb191d4fb1" className="flex flex-col items-center gap-3">
              <div data-ev-id="ev_576c23b727" className="p-3 bg-pumpkin/10 rounded-full">
                <ImageIcon className="w-8 h-8 text-pumpkin" />
              </div>
              <div data-ev-id="ev_374626ce03">
                <p data-ev-id="ev_fb6c831823" className="font-medium text-foreground">Görsel yükle</p>
                <p data-ev-id="ev_b3f09a7683" className="text-sm text-muted-foreground mt-1">
                  Sürükle bırak veya tıkla
                </p>
              </div>
              <p data-ev-id="ev_3f96c9288e" className="text-xs text-muted-foreground">
                JPG, PNG, GIF • Maks. 5MB
              </p>
            </div>
        }
        </motion.div>
      }

      {error &&
      <p data-ev-id="ev_cab45e874f" className="text-sm text-destructive mt-2">{error}</p>
      }
    </div>);

}