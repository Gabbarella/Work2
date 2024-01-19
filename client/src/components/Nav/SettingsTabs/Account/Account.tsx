import * as Tabs from '@radix-ui/react-tabs';
import Avatar from './Avatar';
import React from 'react';
import { useRecoilState } from 'recoil';
import { Switch } from '~/components/ui';
import { useLocalize } from '~/hooks';
import store from '~/store';

function Account() {
  const [UsernameDisplay, setUsernameDisplay] = useRecoilState<boolean>(store.UsernameDisplay);
  const localize = useLocalize();

  const handleCheckedChange = (value: boolean) => {
    setUsernameDisplay(value);
    localStorage.setItem('UsernameDisplay', value.toString());
  };

  return (
    <Tabs.Content value="account" role="tabpanel" className="w-full md:min-h-[300px]">
      <div className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-300">
        <div className="border-b pb-3 last-of-type:border-b-0 dark:border-gray-700">
          <Avatar />
        </div>
        <div className="flex items-center justify-between">
          <div> {localize('com_nav_user_name_display')} </div>
          <Switch
            id="UsernameDisplay"
            checked={UsernameDisplay}
            onCheckedChange={handleCheckedChange}
            className="ml-4 mt-2"
            data-testid="UsernameDisplay"
          />
        </div>
      </div>
      <div className="border-b pb-3 last-of-type:border-b-0 dark:border-gray-700"></div>
    </Tabs.Content>
  );
}

export default React.memo(Account);
