import { Menu, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useRecoilValue } from 'recoil';
import SearchBar from './SearchBar';
import Settings from './Settings';
import { Download } from 'lucide-react';
import NavLink from './NavLink';
import ExportModel from './ExportConversation/ExportModel';
import ClearConvos from './ClearConvos';
import Logout from './Logout';
import { useAuthContext } from '~/hooks/AuthContext';
import { cn } from '~/utils/';
import SubscribeForm from "../Stripe/SubscribeForm.tsx";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import { Button } from '../ui/Button';
import store from '~/store';
import { LinkIcon, DotsIcon, GearIcon, TrashIcon } from '~/components';
import { localize } from '~/localization/Translation';

export default function NavLinks({ clearSearch, isSearchEnabled }) {
  const [showExports, setShowExports] = useState(false);
  const [showClearConvos, setShowClearConvos] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { user } = useAuthContext();
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const lang = useRecoilValue(store.lang);

  const conversation = useRecoilValue(store.conversation) || {};

  const exportable =
    conversation?.conversationId &&
    conversation?.conversationId !== 'new' &&
    conversation?.conversationId !== 'search';

  const clickHandler = () => {
    if (exportable) {
      setShowExports(true);
    }
  };

  console.log(user)
  
  return (
    <>
      <Menu as="div" className="group relative">
        {({ open }) => (
          <>
            {user && user.subscriptionStatus !== 'active' && (
              <Button
                variant="green" 
                className="w-full"
                onClick={() => setShowSubscribeModal(true)}
              >
                Go Pro
              </Button>
              
            )}
            {/* Add the SubscribeForm dialog */}
            {showSubscribeModal && (
              <>
                <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
                <DialogOverlay isOpen={showSubscribeModal} onDismiss={() => setShowSubscribeModal(false)} className="z-50 fixed inset-0 flex items-center justify-center">
                  <DialogContent className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 p-6 bg-white dark:bg-black-500 overflow-auto">
                    <button
                      className="float-right text-xl font-bold"
                      onClick={() => setShowSubscribeModal(false)}
                    >
                      &times;
                    </button>
                    <div className="h-full flex flex-col justify-center items-center">
                      <SubscribeForm />
                    </div>
                  </DialogContent>
                </DialogOverlay>
              </>
            )}


            <Menu.Button
              className={cn(
                'group-ui-open:bg-gray-800 flex w-full items-center gap-2.5 rounded-md px-3 py-3 text-sm transition-colors duration-200 hover:bg-gray-800',
                open ? 'bg-gray-800' : '',
              )}
            >
              <div className="-ml-0.5 h-5 w-5 flex-shrink-0">
                <div className="relative flex">
                  <img
                    className="rounded-sm"
                    src={
                      user?.avatar ||
                      `https://api.dicebear.com/6.x/initials/svg?seed=${
                        user?.name || 'User'
                      }&fontFamily=Verdana&fontSize=36`
                    }
                    alt=""
                  />
                </div>
              </div>
              <div className="grow overflow-hidden text-ellipsis whitespace-nowrap text-left text-white">
                {user?.name || localize(lang, 'com_nav_user')}
              </div>
              <DotsIcon />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute bottom-full left-0 z-20 mb-2 w-full translate-y-0 overflow-hidden rounded-md bg-[#050509] py-1.5 opacity-100 outline-none">
                {isSearchEnabled && (
                  <Menu.Item>
                    <SearchBar clearSearch={clearSearch} />
                  </Menu.Item>
                )}
                <Menu.Item as="div">
                  <NavLink
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-3 rounded-none px-3 py-3 text-sm text-white transition-colors duration-200 hover:bg-gray-700',
                      exportable ? 'cursor-pointer text-white' : 'cursor-not-allowed text-white/50',
                    )}
                    svg={() => <Download size={16} />}
                    text={localize(lang, 'com_nav_export_conversation')}
                    clickHandler={clickHandler}
                  />
                </Menu.Item>
                <div className="my-1.5 h-px bg-white/20" role="none" />
                <Menu.Item as="div">
                  <NavLink
                    className="flex w-full cursor-pointer items-center gap-3 rounded-none px-3 py-3 text-sm text-white transition-colors duration-200 hover:bg-gray-700"
                    svg={() => <TrashIcon />}
                    text={localize(lang, 'com_nav_clear_conversation')}
                    clickHandler={() => setShowClearConvos(true)}
                  />
                </Menu.Item>
                <Menu.Item as="div">
                  <NavLink
                    className="flex w-full cursor-pointer items-center gap-3 rounded-none px-3 py-3 text-sm text-white transition-colors duration-200 hover:bg-gray-700"
                    svg={() => <LinkIcon />}
                    text={localize(lang, 'com_nav_help_faq')}
                    clickHandler={() => window.open('https://docs.librechat.ai/', '_blank')}
                  />
                </Menu.Item>
                <Menu.Item as="div">
                  <NavLink
                    className="flex w-full cursor-pointer items-center gap-3 rounded-none px-3 py-3 text-sm text-white transition-colors duration-200 hover:bg-gray-700"
                    svg={() => <GearIcon />}
                    text={localize(lang, 'com_nav_settings')}
                    clickHandler={() => setShowSettings(true)}
                  />
                </Menu.Item>
                <div className="my-1.5 h-px bg-white/20" role="none" />
                <Menu.Item as="div">
                  <Logout />
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
      {showExports && <ExportModel open={showExports} onOpenChange={setShowExports} />}
      {showClearConvos && <ClearConvos open={showClearConvos} onOpenChange={setShowClearConvos} />}
      {showSettings && <Settings open={showSettings} onOpenChange={setShowSettings} />}
    </>
  );
}
