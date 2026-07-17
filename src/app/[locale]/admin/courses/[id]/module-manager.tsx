'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/routing';
import { Plus, FileText, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  order: number;
  type: string | null;
}

interface Module {
  id: string;
  title: string;
  order: number;
  courseId: string | null;
  lessons: Lesson[];
}

export function ModuleManager({ courseId, modules: initialModules }: { courseId: string; modules: Module[] }) {
  const [modules, setModules] = useState(initialModules);
  const [newModuleTitle, setNewModuleTitle] = useState('');

  async function addModule() {
    if (!newModuleTitle.trim()) return;
    const res = await fetch('/api/admin/modules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newModuleTitle, courseId, order: modules.length }),
    });
    if (res.ok) {
      const { module } = await res.json();
      setModules([...modules, { ...module, lessons: [] }]);
      setNewModuleTitle('');
    }
  }

  async function deleteModule(id: string) {
    await fetch('/api/admin/modules', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setModules(modules.filter(m => m.id !== id));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modules & Lessons</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="New module title..."
            value={newModuleTitle}
            onChange={e => setNewModuleTitle(e.target.value)}
          />
          <Button onClick={addModule}><Plus className="h-4 w-4" /></Button>
        </div>
        <div className="space-y-3">
          {modules.map((mod) => (
            <ModuleCard key={mod.id} mod={mod} courseId={courseId} onDelete={deleteModule} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ModuleCard({ mod, courseId, onDelete }: { mod: Module; courseId: string; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 py-3">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{mod.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(mod.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent>
          <div className="space-y-2">
            {mod.lessons.map((lesson) => (
              <div key={lesson.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{lesson.title}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs">{lesson.type ?? 'TEXT'}</Badge>
                  <Button variant="ghost" size="sm" render={<Link href={`/admin/courses/${courseId}/lessons/${lesson.id}`} />}>
                    Edit
                  </Button>
                </div>
              </div>
            ))}
            {mod.lessons.length === 0 && (
              <p className="text-sm text-muted-foreground">No lessons yet.</p>
            )}
            <Button variant="outline" size="sm" className="gap-1" render={<Link href={`/admin/courses/${courseId}/lessons/new?moduleId=${mod.id}`} />}>
              <Plus className="h-3 w-3" /> Add Lesson
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
