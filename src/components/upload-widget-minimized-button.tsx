import { Trigger } from '@radix-ui/react-collapsible';
import { Maximize2 } from 'lucide-react';
import { UploadWIdgetTitle } from './upload-widget-title';

export const UploadWidgetMinimizedButton = () => {
  const x = 1;
  console.log(x);
  return (
    <Trigger className="group flex w-full items-center justify-between bg-white/2 px-5 py-3">
      <UploadWIdgetTitle />

      <Maximize2
        className="size-4 text-zinc-400 group-hover:text-zinc-100"
        strokeWidth={1.8}
      />
    </Trigger>
  );
};
