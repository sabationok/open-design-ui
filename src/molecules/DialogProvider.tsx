import type { JSX } from 'react';
import { createContext, type ReactNode, useContext, useState } from 'react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

// TODO rename request-dialog and create folders for ctx, components for him inside
interface AlertOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
}

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
  confirmText?: string;
}

interface PromptOptions {
  title: string;
  description?: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

type PendingRequest =
  | { kind: 'alert'; options: AlertOptions; resolve: (value: void) => void }
  | { kind: 'confirm'; options: ConfirmOptions; resolve: (value: boolean) => void }
  | { kind: 'prompt'; options: PromptOptions; resolve: (value: string | null) => void }
  | null;

interface DialogsContextValue {
  alert: (options: AlertOptions) => Promise<void>;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  prompt: (options: PromptOptions) => Promise<string | null>;
}

const DialogsContext = createContext<DialogsContextValue | null>(null);

function useDialogs(): DialogsContextValue {
  const ctx = useContext(DialogsContext);
  if (!ctx) throw new Error('useDialogs must be used within a DialogProvider');
  return ctx;
}

type ActiveRequest = NonNullable<PendingRequest>;

interface DialogRequestContextValue {
  request: PendingRequest;
  close: () => void;
}

const DialogRequestContext = createContext<DialogRequestContextValue | null>(null);

function useAlertDialogInternalCtx<K extends ActiveRequest['kind']>(kind: K) {
  const ctx = useContext(DialogRequestContext);
  if (!ctx || ctx.request?.kind !== kind) {
    throw new Error(`useAlertDialogInternalCtx: no active "${kind}" request`);
  }
  return ctx as { request: Extract<ActiveRequest, { kind: K }>; close: () => void };
}
// move to request-dialog/components
function AlertDialogContent() {
  const { request, close } = useAlertDialogInternalCtx('alert');
  const { options } = request;

  const onDismiss = () => {
    request.resolve(undefined);
    close();
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{options.title}</DialogTitle>
        {options.description ? <DialogDescription>{options.description}</DialogDescription> : null}
      </DialogHeader>
      <DialogFooter>
        <Button onClick={onDismiss}>{options.confirmLabel ?? 'OK'}</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function ConfirmDialogContent() {
  const { request, close } = useAlertDialogInternalCtx('confirm');
  const { options } = request;
  const [typedText, setTypedText] = useState('');

  const requiresTypedConfirmation = options.variant === 'destructive' && !!options.confirmText;
  const confirmDisabled = requiresTypedConfirmation && typedText !== options.confirmText;

  const onCancel = () => {
    request.resolve(false);
    close();
  };

  const onConfirm = () => {
    request.resolve(true);
    close();
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{options.title}</DialogTitle>
        {options.description ? <DialogDescription>{options.description}</DialogDescription> : null}
      </DialogHeader>
      {requiresTypedConfirmation ? (
        <DialogBody>
          <div className="flex flex-col gap-1.5">
            <Label>Type &quot;{options.confirmText}&quot; to confirm</Label>
            <Input value={typedText} onChange={(e) => setTypedText(e.target.value)} />
          </div>
        </DialogBody>
      ) : null}
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          {options.cancelLabel ?? 'Cancel'}
        </Button>
        <Button
          variant={options.variant ?? 'default'}
          disabled={confirmDisabled}
          onClick={onConfirm}
        >
          {options.confirmLabel ?? 'Confirm'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function PromptDialogContent() {
  const { request, close } = useAlertDialogInternalCtx('prompt');
  const { options } = request;
  const [value, setValue] = useState(options.defaultValue ?? '');

  const onCancel = () => {
    request.resolve(null);
    close();
  };

  const onConfirm = () => {
    request.resolve(value);
    close();
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{options.title}</DialogTitle>
        {options.description ? <DialogDescription>{options.description}</DialogDescription> : null}
      </DialogHeader>
      <DialogBody>
        <div className="flex flex-col gap-1.5">
          {options.label ? <Label>{options.label}</Label> : null}
          <Input
            value={value}
            placeholder={options.placeholder}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          {options.cancelLabel ?? 'Cancel'}
        </Button>
        <Button onClick={onConfirm}>{options.confirmLabel ?? 'OK'}</Button>
      </DialogFooter>
    </DialogContent>
  );
}

const DIALOG_RENDERERS: Record<ActiveRequest['kind'], (key: string) => JSX.Element> = {
  alert: (key) => <AlertDialogContent key={key} />,
  confirm: (key) => <ConfirmDialogContent key={key} />,
  prompt: (key) => <PromptDialogContent key={key} />,
};

function DialogProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<PendingRequest>(null);

  const alert = (options: AlertOptions) =>
    new Promise<void>((resolve) => setRequest({ kind: 'alert', options, resolve }));

  const confirm = (options: ConfirmOptions) =>
    new Promise<boolean>((resolve) => setRequest({ kind: 'confirm', options, resolve }));

  const prompt = (options: PromptOptions) =>
    new Promise<string | null>((resolve) => setRequest({ kind: 'prompt', options, resolve }));

  const handleOpenChange = (open: boolean) => {
    if (open || !request) return;
    if (request.kind === 'alert') request.resolve(undefined);
    if (request.kind === 'confirm') request.resolve(false);
    if (request.kind === 'prompt') request.resolve(null);
    setRequest(null);
  };

  const close = () => setRequest(null);

  return (
    <DialogsContext.Provider value={{ alert, confirm, prompt }}>
      {children}
      <Dialog open={request !== null} onOpenChange={handleOpenChange}>
        <DialogRequestContext.Provider value={{ request, close }}>
          {request ? DIALOG_RENDERERS[request.kind](request.options.title) : null}
        </DialogRequestContext.Provider>
      </Dialog>
    </DialogsContext.Provider>
  );
}

export { DialogProvider, useDialogs, type AlertOptions, type ConfirmOptions, type PromptOptions };
