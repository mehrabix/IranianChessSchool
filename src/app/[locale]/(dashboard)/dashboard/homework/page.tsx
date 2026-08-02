'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, FileText, CheckCircle2, Clock, User, MessageCircle } from 'lucide-react';

interface Homework {
  id: string;
  coachId: string;
  studentId: string;
  lessonId: string | null;
  courseId: string | null;
  title: string;
  description: string | null;
  pgn: string | null;
  status: 'PENDING' | 'SUBMITTED' | 'REVIEWED';
  coachNotes: string | null;
  studentNotes: string | null;
  assignedAt: number;
  submittedAt: number | null;
  reviewedAt: number | null;
}

export default function HomeworkPage() {
  const t = useTranslations('dashboard');
  const { data: session } = useSession();
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Homework | null>(null);
  const [pgn, setPgn] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const isCoach = session?.user?.role === 'COACH' || session?.user?.role === 'ADMIN';

  async function fetchHomeworks() {
    setLoading(true);
    const res = await fetch('/api/homeworks');
    const data = await res.json();
    setHomeworks(data.homeworks || []);
    setLoading(false);
  }

  useEffect(() => { fetchHomeworks(); }, []); {/* eslint-disable-line react-hooks/set-state-in-effect */}

  async function handleSubmit() {
    if (!selected || !pgn.trim()) return;
    setSubmitting(true);
    await fetch(`/api/homeworks/${selected.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pgn, studentNotes: notes || undefined }),
    });
    setSubmitting(false); setSelected(null); setPgn(''); setNotes('');
    fetchHomeworks();
  }

  async function handleReview(hwId: string) {
    if (!reviewNotes.trim()) return;
    setReviewing(true);
    await fetch(`/api/homeworks/${hwId}/review`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coachNotes: reviewNotes }),
    });
    setReviewing(false); setReviewNotes('');
    fetchHomeworks();
  }

  const statusBadge = (status: string) => {
    if (status === 'PENDING') return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />{t('pending')}</Badge>;
    if (status === 'SUBMITTED') return <Badge variant="default" className="gap-1 bg-blue-600"><Send className="h-3 w-3" />{t('submitted')}</Badge>;
    return <Badge variant="default" className="gap-1 bg-emerald-600"><CheckCircle2 className="h-3 w-3" />{t('reviewed')}</Badge>;
  };

  if (loading) return <section className="py-20"><Container size="md" className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></Container></section>;

  return (
    <section className="py-8">
      <Container size="lg">
        <h1 className="text-2xl font-bold mb-2">{t('homework')}</h1>
        <p className="text-muted-foreground mb-8">{isCoach ? t('homeworkCoachDesc') || 'Review and assign homework to your students.' : t('homeworkStudentDesc') || 'View and submit your assigned homework.'}</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {homeworks.map((hw) => (
            <Card key={hw.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setSelected(hw); setPgn(hw.pgn || ''); setNotes(hw.studentNotes || ''); }}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{hw.title}</CardTitle>
                  {statusBadge(hw.status)}
                </div>
                {hw.description && <p className="text-sm text-muted-foreground mt-1">{hw.description}</p>}
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" />{isCoach ? t('roleStudent') : t('coach') || 'Coach'}</span>
                  <span>{new Date(hw.assignedAt).toLocaleDateString()}</span>
                </div>
                {hw.coachNotes && (
                  <div className="mt-3 p-2 rounded bg-muted/50 text-xs">
                    <span className="font-medium flex items-center gap-1"><MessageCircle className="h-3 w-3" />{t('coachFeedback')}</span>
                    <p className="mt-1">{hw.coachNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          {homeworks.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>{t('noHomework')}</p>
            </div>
          )}
        </div>

        {selected && !isCoach && (
          <Card className="mt-8">
            <CardHeader><CardTitle>{t('submitHomework')}: {selected.title}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {selected.description && <p className="text-sm text-muted-foreground">{selected.description}</p>}
              <div>
                <label className="text-sm font-medium block mb-1">{t('pgnNotation')}</label>
                <Textarea value={pgn} onChange={(e) => setPgn(e.target.value)} rows={6} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">{t('notes')}</label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <Button onClick={handleSubmit} disabled={submitting || !pgn.trim()}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin me-2" />}
                <Send className="h-4 w-4 me-2" />{t('post')}
              </Button>
            </CardContent>
          </Card>
        )}

        {isCoach && homeworks.filter(h => h.status === 'SUBMITTED').map(hw => (
          <Card key={`review-${hw.id}`} className="mt-4">
            <CardHeader><CardTitle className="text-base">{t('review')}: {hw.title}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {hw.pgn && <pre className="text-xs bg-muted p-3 rounded overflow-x-auto max-h-32">{hw.pgn}</pre>}
              {hw.studentNotes && <p className="text-sm text-muted-foreground">{t('studentNotes')}: {hw.studentNotes}</p>}
              <div className="flex gap-2">
                <Input value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} className="flex-1" />
                <Button size="sm" onClick={() => handleReview(hw.id)} disabled={reviewing || !reviewNotes.trim()}>
                  {reviewing && <Loader2 className="h-3 w-3 animate-spin me-1" />}{t('post')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </Container>
    </section>
  );
}
