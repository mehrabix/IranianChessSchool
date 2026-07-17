import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, BookOpen, Clock } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  level: string | null;
  published: boolean | null;
  createdAt: Date | null;
}

export function CourseMetaCard({ course }: { course: Course }) {
  const totalLessons = 0; // would need a count query
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 text-sm">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Level:</span>
                  <span className="font-medium capitalize">{(course.level ?? 'BEGINNER').toLowerCase()}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Status:</span>
          <span className="font-medium">{course.published ? 'Published' : 'Draft'}</span>
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
