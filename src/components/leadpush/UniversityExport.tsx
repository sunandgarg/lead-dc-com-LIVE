import { memo, useCallback, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  fetchCompleteUniversitiesForExport,
  universityToExportData,
  UniversityExport,
} from '@/components/universities/UniversityImportExport';

interface UniversityExportProps {
  university: Record<string, unknown> & { id: string; name: string };
  variant?: 'icon' | 'button';
}

function downloadJSON(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function UniversityExportButton({ university, variant = 'icon' }: UniversityExportProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExporting(true);
    try {
      const [completeUniversity] = await fetchCompleteUniversitiesForExport([university]);
      const exportData: UniversityExport = {
        version: '2.0',
        exportedAt: new Date().toISOString(),
        university: universityToExportData(completeUniversity),
      };
      const safeName = university.name.replace(/[^a-z0-9]+/gi, '_').toLowerCase();
      downloadJSON(exportData, `${safeName}_config.json`);
      toast({ title: 'Exported', description: `Complete configuration for ${university.name} downloaded (including secrets)` });
    } catch (error: unknown) {
      toast({
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'Failed to export complete configuration',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  }, [university, toast]);

  if (variant === 'icon') {
    return (
      <Button variant="ghost" size="sm" onClick={handleExport} disabled={isExporting} title="Export Complete Configuration">
        <Download className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting} className="gap-2">
      <Download className="h-4 w-4" />
      {isExporting ? 'Exporting...' : 'Export Config'}
    </Button>
  );
}

export default memo(UniversityExportButton);
