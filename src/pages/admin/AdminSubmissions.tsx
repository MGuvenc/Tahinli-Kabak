import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/helpers';
import { formatDate, generateUniqueSlug } from '@/lib/utils';

type Submission = Tables<'anonymous_submissions'>;

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    if (!supabase) return;

    const { data } = await supabase.
    from('anonymous_submissions').
    select('*').
    order('created_at', { ascending: false });

    setSubmissions(data ?? []);
    setLoading(false);
  };

  const handleApprove = async (submission: Submission) => {
    if (!supabase) return;

      setProcessing(true);

    const uniqueSlug = await generateUniqueSlug(supabase, submission.title);

    // Create a new post from the submission
    const { data: newPost, error: postError } = await supabase.
    from('posts').
    insert({
      title: submission.title,
      slug: uniqueSlug,
      excerpt: submission.content.substring(0, 200) + '...',
      status: 'draft', // Create as draft so admin can review
      is_anonymous_submission: true
    }).
    select().
    single();

    if (postError) {
      alert('Yazı oluşturulamadı: ' + postError.message);
      setProcessing(false);
      return;
    }

    // Add the content as a text block
    await supabase.from('post_blocks').insert({
      post_id: newPost.id,
      block_type: 'text',
      content: submission.content,
      sort_order: 0
    });

    // Update submission status
    const { error } = await supabase.
    from('anonymous_submissions').
    update({ status: 'approved' }).
    eq('id', submission.id);

    if (!error) {
      setSubmissions(submissions.map((s) =>
      s.id === submission.id ? { ...s, status: 'approved' } : s
      ));
      setSelectedSubmission(null);
    }

    setProcessing(false);
  };

  const handleReject = async (submission: Submission) => {
    if (!supabase) return;
    if (!confirm('Bu gönderiyi reddetmek istediğinden emin misin?')) return;

    setProcessing(true);

    const { error } = await supabase.
    from('anonymous_submissions').
    update({ status: 'rejected' }).
    eq('id', submission.id);

    if (!error) {
      setSubmissions(submissions.map((s) =>
      s.id === submission.id ? { ...s, status: 'rejected' } : s
      ));
      setSelectedSubmission(null);
    }

    setProcessing(false);
  };

  const filteredSubmissions = submissions.filter((s) =>
  filter === 'all' || s.status === filter
  );

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':return <Clock className="w-4 h-4" />;
      case 'approved':return <CheckCircle className="w-4 h-4" />;
      case 'rejected':return <XCircle className="w-4 h-4" />;
      default:return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':return 'text-amber-500 bg-amber-500/10';
      case 'approved':return 'text-olive bg-olive/10';
      case 'rejected':return 'text-destructive bg-destructive/10';
      default:return '';
    }
  };

  return (
    <div data-ev-id="ev_b8cc985a95">
      <div data-ev-id="ev_feda8a538a" className="flex items-center justify-between mb-8">
        <div data-ev-id="ev_5c51fd5cb5" className="flex items-center gap-4">
          <h1 data-ev-id="ev_a17791fbea" className="font-display text-3xl font-bold text-pine">Anonim Gönderiler</h1>
          {pendingCount > 0 &&
          <span data-ev-id="ev_37a5f61672" className="px-3 py-1 bg-pumpkin text-white text-sm font-medium rounded-full">
              {pendingCount} bekleyen
            </span>
          }
        </div>
      </div>

      {/* Filters */}
      <div data-ev-id="ev_14300940c4" className="flex gap-2 mb-6">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((f) =>
        <button data-ev-id="ev_b9d5a6fe15"
        key={f}
        onClick={() => setFilter(f)}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        filter === f ?
        'bg-pumpkin text-white' :
        'bg-card text-muted-foreground hover:bg-muted'}`
        }>

            {f === 'pending' ? 'Bekleyen' :
          f === 'approved' ? 'Onaylı' :
          f === 'rejected' ? 'Reddedilen' : 'Tümü'}
          </button>
        )}
      </div>

      {/* Submissions List */}
      {loading ?
      <div data-ev-id="ev_a3d2be6a8d" className="flex flex-col gap-4">
          {[...Array(5)].map((_, i) =>
        <div data-ev-id="ev_773103264e" key={i} className="bg-card rounded-xl p-4 animate-pulse h-24" />
        )}
        </div> :
      filteredSubmissions.length > 0 ?
      <div data-ev-id="ev_b935ea00fa" className="flex flex-col gap-4">
          {filteredSubmissions.map((submission, index) =>
        <motion.div
          key={submission.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-card rounded-xl p-4 shadow-soft">

              <div data-ev-id="ev_0a980c7b3c" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div data-ev-id="ev_a770e3c1be" className="flex-1 min-w-0">
                  <div data-ev-id="ev_d4d9ebc102" className="flex items-center gap-2 mb-1">
                    <h3 data-ev-id="ev_c65045b27c" className="font-display font-semibold text-foreground truncate">
                      {submission.title}
                    </h3>
                    <span data-ev-id="ev_3206ed674a" className={`flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${getStatusColor(submission.status)}`}>
                      {getStatusIcon(submission.status)}
                      {submission.status === 'pending' ? 'Bekliyor' :
                  submission.status === 'approved' ? 'Onaylı' : 'Reddedildi'}
                    </span>
                  </div>
                  <p data-ev-id="ev_995131648c" className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {submission.content}
                  </p>
                  <div data-ev-id="ev_12ddf9f66a" className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span data-ev-id="ev_dfb9779977">{formatDate(submission.created_at)}</span>
                  </div>
                </div>
                <div data-ev-id="ev_ed5760cc5f" className="flex items-center gap-2">
                  <button data-ev-id="ev_6f5a67a853"
              onClick={() => setSelectedSubmission(submission)}
              className="p-2 rounded-lg text-pumpkin hover:bg-pumpkin/10 transition-colors"
              title="Oku">

                    <Eye className="w-5 h-5" />
                  </button>
                  {submission.status === 'pending' &&
              <>
                      <button data-ev-id="ev_39d3265077"
                onClick={() => handleApprove(submission)}
                className="p-2 rounded-lg text-olive hover:bg-olive/10 transition-colors"
                title="Onayla">

                        <Check className="w-5 h-5" />
                      </button>
                      <button data-ev-id="ev_6c7ae5e1f7"
                onClick={() => handleReject(submission)}
                className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                title="Reddet">

                        <X className="w-5 h-5" />
                      </button>
                    </>
              }
                </div>
              </div>
            </motion.div>
        )}
        </div> :

      <div data-ev-id="ev_e43735dfc8" className="bg-card rounded-xl p-12 text-center">
          <span data-ev-id="ev_2509202b49" className="text-5xl mb-4 block">📬</span>
          <p data-ev-id="ev_2a45d88894" className="text-muted-foreground">
            {filter === 'pending' ? 'Bekleyen gönderi yok. Harika iş!' : 'Gönderi bulunamadı.'}
          </p>
        </div>
      }

      {/* Submission Detail Modal */}
      <AnimatePresence>
        {selectedSubmission &&
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedSubmission(null)}>

            <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl">

              <div data-ev-id="ev_34f3eb6d27" className="flex items-start justify-between mb-4">
                <div data-ev-id="ev_619e677fc7">
                  <h2 data-ev-id="ev_ba91d2ed1c" className="font-display text-xl font-bold text-pine">
                    {selectedSubmission.title}
                  </h2>
                  <div data-ev-id="ev_07a530d82b" className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span data-ev-id="ev_ab3192d97f">{formatDate(selectedSubmission.created_at)}</span>
                  </div>
                </div>
                <button data-ev-id="ev_cc12212b41"
              onClick={() => setSelectedSubmission(null)}
              className="p-2 rounded-lg hover:bg-muted transition-colors">

                  <X className="w-5 h-5" />
                </button>
              </div>

              <div data-ev-id="ev_7430fb704a" className="prose prose-pine dark:prose-invert max-w-none mb-6">
                <div data-ev-id="ev_a5041a4abb" className="whitespace-pre-wrap text-foreground">
                  {selectedSubmission.content}
                </div>
              </div>

              {selectedSubmission.status === 'pending' &&
            <div data-ev-id="ev_3743312e93" className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <button data-ev-id="ev_cec603ba0a"
              onClick={() => handleReject(selectedSubmission)}
              disabled={processing}
              className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-lg transition-colors disabled:opacity-50">

                    <X className="w-5 h-5" />
                    Reddet
                  </button>
                  <button data-ev-id="ev_0153521241"
              onClick={() => handleApprove(selectedSubmission)}
              disabled={processing}
              className="flex items-center gap-2 px-4 py-2 bg-pumpkin hover:bg-pumpkin-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50">

                    <Check className="w-5 h-5" />
                    Onayla & Yazı Oluştur
                  </button>
                </div>
            }
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}