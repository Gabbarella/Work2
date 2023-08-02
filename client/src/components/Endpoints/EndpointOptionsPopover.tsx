import React from 'react';
import { useRecoilValue } from 'recoil';
import { CrossIcon, Button } from '~/components';
import { localize } from '~/localization/Translation';
import PopoverButtons from './PopoverButtons';
import { EndpointOptionsPopoverProps } from 'librechat-data-provider';
import { Save } from 'lucide-react';
import store from '~/store';

export default function EndpointOptionsPopover({
  children,
  endpoint,
  visible,
  saveAsPreset,
  closePopover,
}: EndpointOptionsPopoverProps) {
  const lang = useRecoilValue(store.lang);
  const cardStyle =
    'shadow-xl rounded-md min-w-[75px] font-normal bg-white border-black/10 border dark:bg-gray-700 text-black dark:text-white';

  return (
    <>
      <div
        className={
          ' endpointOptionsPopover-container absolute bottom-[-10px] z-0 flex w-full flex-col items-center md:px-4' +
          (visible ? ' show' : '')
        }
      >
        <div
          className={
            cardStyle +
            ' border-d-0 flex w-full flex-col overflow-hidden rounded-none border-s-0 border-t bg-slate-200 px-0 pb-[10px] dark:border-white/10 md:rounded-md md:border lg:w-[736px]'
          }
        >
          <div className="flex w-full items-center bg-slate-100 px-2 py-2 dark:bg-gray-800/60">
            {/* <span className="text-xs font-medium font-normal">Advanced settings for OpenAI endpoint</span> */}
            <Button
              type="button"
              className="h-auto justify-start bg-transparent px-2 py-1 text-xs font-medium font-normal text-black hover:bg-slate-200 hover:text-black focus:ring-0 dark:bg-transparent dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:outline-none dark:focus:ring-offset-0"
              onClick={saveAsPreset}
            >
              <Save className="mr-1 w-[14px]" />
              {localize(lang, 'com_endpoint_save_as_preset')}
            </Button>
            <PopoverButtons endpoint={endpoint} />
            <Button
              type="button"
              className="ml-auto h-auto bg-transparent px-2 py-1 text-xs font-medium font-normal text-black hover:bg-slate-200 hover:text-black focus:ring-offset-0 dark:bg-transparent dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={closePopover}
            >
              <CrossIcon className="mr-1" />
              {/* Switch to simple mode */}
            </Button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
