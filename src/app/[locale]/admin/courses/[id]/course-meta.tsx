import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  level: string | null;
  published: boolean | null;
  createdAt: Date | null;
}

export async function CourseMetaCard({ course }: { course: Course }) {
  const t = await getTranslations('admin.courses');
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('courseInfo')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 text-sm">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{t('courseLevel')}:</span>
          <span className="font-medium capitalize">{(course.level ?? 'BEGINNER').toLowerCase()}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{t('status')}:</span>
          <span className="font-medium">{course.published ? t('coursePublished') : t('draft')}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">ID:</span>
          <span className="font-mono text-xs">{course.id}</span>
        </div>
      </CardContent>
    </Card>
  );
}