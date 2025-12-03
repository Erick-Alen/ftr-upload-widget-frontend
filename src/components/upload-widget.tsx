import { Content, Root } from '@radix-ui/react-collapsible';
import { useState } from 'react';
import { UploadWidgetDropZone } from './upload-widget-dropzone';
import { UploadWidgetHeader } from './upload-widget-header';
import { UploadWidgetMinimizedButton } from './upload-widget-minimized-button';
import { UploadWidgetUploadList } from './upload-widget-upload-list';

export const UploadWidget = () => {
  const [isWidgetOpen, setIsWidgetOpen] = useState<boolean>(false);

  return (
    <Root
      // defaultOpen={true}
      onOpenChange={setIsWidgetOpen}
    >
      <div className="w-[360px] overflow-hidden rounded-xl bg-zinc-900 shadow-shape">
      {!isWidgetOpen && <UploadWidgetMinimizedButton />}
        <Content>
        <UploadWidgetHeader />
          <div className="flex flex-col gap-4 py-3">
            <UploadWidgetDropZone />

            <div className="box-content h-px border-black/50 border-t bg-zinc-800" />
            <UploadWidgetUploadList />
          </div>
        </Content>
      </div>
    </Root>
  );
};
