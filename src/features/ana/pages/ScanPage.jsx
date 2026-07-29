import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, FileText, Upload } from 'lucide-react';
import { PageHeader, Card, Button, Badge, Banner } from '../../../shared/components';
import { anaApi } from '../../../shared/api';
import { useAsync } from '../../../shared/hooks/useAsync';
import { formatRelative } from '../../../shared/utils/formatters';

// Tracks the selected file and, when it's an image, an object URL to preview it.
// Revokes the previous URL whenever the file changes or the component unmounts.
const useFilePreview = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!file?.type?.startsWith('image/')) {
      setPreviewUrl(null);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return { file, previewUrl, setFile };
};

// Loads the last few persisted scans of a given type so past results stay visible.
const useScanHistory = (type) => {
  const [scans, setScans] = useState([]);

  const reload = useCallback(() => {
    anaApi
      .getScans(type, 5, 0)
      .then((res) => setScans(res.data || []))
      .catch(() => {});
  }, [type]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { scans, reload };
};

export const ScanPage = () => {
  const visionInputRef = useRef(null);
  const docInputRef = useRef(null);
  const visionPreview = useFilePreview();
  const docPreview = useFilePreview();
  const [visionResult, setVisionResult] = useState(null);
  const [docResult, setDocResult] = useState(null);
  const vision = useAsync();
  const docs = useAsync();
  const visionHistory = useScanHistory('vision');
  const docHistory = useScanHistory('document');

  const handleVisionFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    visionPreview.setFile(file);
    setVisionResult(null);
    try {
      const res = await vision.run(() => anaApi.detectObjects(file));
      setVisionResult(res.data);
      visionHistory.reload();
    } catch {
      // el error ya queda reflejado por useAsync
    }
  };

  const handleDocFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    docPreview.setFile(file);
    setDocResult(null);
    try {
      const res = await docs.run(() => anaApi.readDocument(file));
      setDocResult(res.data);
      docHistory.reload();
    } catch {
      // el error ya queda reflejado por useAsync
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Herramientas de ANA"
        title="Escanear"
        description="Sube una foto de tu entorno para detectar riesgos, o una receta/documento para que ANA te lo lea."
      />

      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Camera size={22} style={{ color: 'var(--color-primary)' }} />
            <h3 className="font-bold text-[16px]">Detectar objetos y riesgos</h3>
          </div>
          <p className="text-[13px] mb-4" style={{ color: 'var(--color-ink-soft)' }}>
            Sube una foto de la habitación para identificar objetos, riesgo de caídas, medicación visible o si estás solo.
          </p>
          <Banner tone="error">{vision.error}</Banner>
          <input
            ref={visionInputRef}
            type="file"
            accept="image/jpeg,image/png,image/tiff,image/bmp,image/gif"
            hidden
            onChange={handleVisionFile}
          />
          <Button onClick={() => visionInputRef.current?.click()} loading={vision.loading}>
            <Upload size={16} /> Subir foto
          </Button>

          {visionPreview.previewUrl && (
            <img
              src={visionPreview.previewUrl}
              alt="Vista previa de la foto subida"
              className="mt-4 rounded-xl w-full max-h-64 object-cover"
            />
          )}

          {visionResult && (
            <div className="mt-5 flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {visionResult.fall_risk_detected && <Badge colorVar="--risk-alto">Riesgo de caída</Badge>}
                {visionResult.is_alone && <Badge colorVar="--risk-medio">Está solo</Badge>}
                {visionResult.medication_detected && <Badge tone="soft">Medicación visible</Badge>}
              </div>
              <p className="text-[13px]" style={{ color: 'var(--color-ink)' }}>{visionResult.summary}</p>
              {visionResult.objects?.length > 0 && (
                <ul className="flex flex-col gap-1">
                  {visionResult.objects.map((obj, i) => (
                    <li key={i} className="text-[12px] flex justify-between" style={{ color: 'var(--color-ink-soft)' }}>
                      <span>{obj.description || obj.label}</span>
                      <span>{Math.round(obj.confidence * 100)}%</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {visionHistory.scans.length > 0 && (
            <div className="mt-5 pt-4 border-t" style={{ borderColor: 'var(--color-outline-variant)' }}>
              <p className="text-[12px] font-bold mb-2" style={{ color: 'var(--color-ink-soft)' }}>Historial reciente</p>
              <ul className="flex flex-col gap-2">
                {visionHistory.scans.map((scan) => (
                  <li key={scan._id} className="text-[12px]" style={{ color: 'var(--color-ink-soft)' }}>
                    <span>{formatRelative(scan.createdAt)}: </span>
                    <span>{scan.result?.summary}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-3">
            <FileText size={22} style={{ color: 'var(--color-secondary)' }} />
            <h3 className="font-bold text-[16px]">Leer un documento</h3>
          </div>
          <p className="text-[13px] mb-4" style={{ color: 'var(--color-ink-soft)' }}>
            Sube una foto o PDF de una receta o informe médico y ANA extrae el texto y los datos importantes.
          </p>
          <Banner tone="error">{docs.error}</Banner>
          <input
            ref={docInputRef}
            type="file"
            accept="application/pdf,image/png,image/jpeg,image/tiff,image/bmp"
            hidden
            onChange={handleDocFile}
          />
          <Button onClick={() => docInputRef.current?.click()} loading={docs.loading}>
            <Upload size={16} /> Subir documento
          </Button>

          {docPreview.file && (
            docPreview.previewUrl ? (
              <img
                src={docPreview.previewUrl}
                alt="Vista previa del documento subido"
                className="mt-4 rounded-xl w-full max-h-64 object-cover"
              />
            ) : (
              <div className="mt-4 flex items-center gap-2 text-[13px]" style={{ color: 'var(--color-ink-soft)' }}>
                <FileText size={16} /> {docPreview.file.name}
              </div>
            )
          )}

          {docResult && (
            <div className="mt-5 flex flex-col gap-3">
              <p className="text-[13px]" style={{ color: 'var(--color-ink)' }}>{docResult.summary}</p>
              {docResult.entities?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {docResult.entities.map((entity, i) => (
                    <Badge key={i} tone="soft">{entity}</Badge>
                  ))}
                </div>
              )}
              <details>
                <summary className="text-[12px] font-bold cursor-pointer" style={{ color: 'var(--color-ink-soft)' }}>
                  Ver texto completo ({docResult.pages} página{docResult.pages === 1 ? '' : 's'})
                </summary>
                <p className="text-[12px] whitespace-pre-wrap mt-2" style={{ color: 'var(--color-ink-soft)' }}>
                  {docResult.text}
                </p>
              </details>
            </div>
          )}

          {docHistory.scans.length > 0 && (
            <div className="mt-5 pt-4 border-t" style={{ borderColor: 'var(--color-outline-variant)' }}>
              <p className="text-[12px] font-bold mb-2" style={{ color: 'var(--color-ink-soft)' }}>Historial reciente</p>
              <ul className="flex flex-col gap-2">
                {docHistory.scans.map((scan) => (
                  <li key={scan._id} className="text-[12px]" style={{ color: 'var(--color-ink-soft)' }}>
                    <span>{formatRelative(scan.createdAt)}: </span>
                    <span>{scan.result?.summary}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
