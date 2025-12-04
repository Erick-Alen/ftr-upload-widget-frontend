import { motion, useCycle } from 'motion/react';
import { UploadWidgetDropzone } from './upload-widget-dropzone';
import { UploadWidgetHeader } from './upload-widget-header';
import { UploadWidgetMinimizedButton } from './upload-widget-minimized-button';
import { UploadWidgetUploadList } from './upload-widget-upload-list';
import { Content, Root } from '@radix-ui/react-collapsible';

export function UploadWidget() {
  const isThereAnyPendindUploads = true;

  const [isWidgetOpen, toggleWidgetOpen] = useCycle(false, true);

  return (
    <Root asChild onOpenChange={() => toggleWidgetOpen()}>
      <motion.div
        animate={isWidgetOpen ? 'open' : 'closed'}
        className="w-[360px] animate-border overflow-hidden rounded-xl border border-transparent bg-zinc-900 data-[state=closed]:data-[progress=false]:shadow-shape data-[state=closed]:rounded-3xl data-[state=open]:shadow-shape data-[state=closed]:data-[progress=true]:[background:linear-gradient(45deg,#09090B,theme(colors.zinc.900)_50%,#09090B)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.zinc.700/.48)_80%,_theme(colors.indigo.500)_86%,_theme(colors.indigo.300)_90%,_theme(colors.indigo.500)_94%,_theme(colors.zinc.600/.48))_border-box]"
        data-progress={isThereAnyPendindUploads}
        variants={{
          closed: {
            width: 'max-content',
            height: 44,
            transition: {
              type: 'inertia',
            },
          },
          open: {
            width: 360,
            height: 'auto',
            transition: {
              duration: 0.1,
            },
          },
        }}
      >
        {!isWidgetOpen && <UploadWidgetMinimizedButton />}

        <Content>
          <UploadWidgetHeader />

          <div className="flex flex-col gap-4 py-3">
            <UploadWidgetDropzone />

            <div className="box-content h-px border-black/50 border-t bg-zinc-800" />

            <UploadWidgetUploadList />
          </div>
        </Content>
      </motion.div>
    </Root>
  );
}
