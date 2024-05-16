import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogButton,
  Input,
} from '~/components/ui';
import { useDeleteUserMutation } from 'librechat-data-provider/react-query';
import { useLocalize } from '~/hooks';
import { cn, defaultTextProps, removeFocusOutlines } from '~/utils';
import { Spinner, LockIcon } from '~/components/svg';
import { useAuthContext } from '~/hooks/AuthContext';

const DeleteAccount = ({ disabled = false }: { title?: string; disabled?: boolean }) => {
  const localize = useLocalize();
  const { user } = useAuthContext();
  const userEmail = user?.email;
  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const { mutate: deleteUser, isLoading: isDeleting } = useDeleteUserMutation();
  const [emailInput, setEmailInput] = useState('');
  const [deleteInput, setDeleteInput] = useState('');
  const [isLocked, setIsLocked] = useState(true);

  const onClick = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleDeleteUser = () => {
    if (!isLocked) {
      deleteUser({});
    }
  };

  const handleInputChange = useCallback(
    (newEmailInput: string, newDeleteInput: string) => {
      const isEmailCorrect = newEmailInput.trim().toLowerCase() === userEmail?.trim().toLowerCase();
      const isDeleteInputCorrect = newDeleteInput === 'DELETE';
      setIsLocked(!(isEmailCorrect && isDeleteInputCorrect));
    },
    [userEmail],
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <span>{localize('com_nav_delete_account')}</span>
        <label>
          <DialogButton
            id={'delete-user-account'}
            disabled={disabled}
            onClick={onClick}
            className={cn(
              'btn btn-danger relative border-none bg-red-700 text-white hover:bg-red-800 dark:hover:bg-red-800',
            )}
          >
            {localize('com_ui_delete')}
          </DialogButton>
        </label>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={() => setDialogOpen(false)}>
        <DialogContent
          className={cn('shadow-2xl md:h-[500px] md:w-[450px]')}
          style={{ borderRadius: '12px', padding: '20px' }}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-medium leading-6">
              {localize('com_nav_delete_account_confirm')}
            </DialogTitle>
          </DialogHeader>
          <div className="mb-20 text-sm text-black dark:text-white">
            <ul>
              <li>{localize('com_dialog_delete_warning')}</li>
              <li>{localize('com_dialog_delete_data_info')}</li>
              <li>{localize('com_dialog_delete_help_center')}</li>
            </ul>
          </div>
          <div className="flex-col items-center justify-center">
            <div className="mb-4">
              {renderInput(
                localize('com_nav_delete_account_email_placeholder'),
                'email-confirm-input',
                userEmail || '',
                (e) => {
                  setEmailInput(e.target.value);
                  handleInputChange(e.target.value, deleteInput);
                },
              )}
            </div>
            <div className="mb-4">
              {renderInput(
                localize('com_nav_delete_account_confirm_placeholder'),
                'delete-confirm-input',
                '',
                (e) => {
                  setDeleteInput(e.target.value);
                  handleInputChange(emailInput, e.target.value);
                },
              )}
            </div>
            {renderDeleteButton(handleDeleteUser, isDeleting, isLocked, localize)}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const renderInput = (
  label: string,
  id: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
) => (
  <div className="mb-4">
    <label className="mb-1 block text-sm font-medium text-black dark:text-white">{label}</label>
    <Input
      id={id}
      onChange={onChange}
      placeholder={value}
      className={cn(
        defaultTextProps,
        'h-10 max-h-10 w-full max-w-full rounded-md bg-white px-3 py-2',
        removeFocusOutlines,
      )}
    />
  </div>
);

const renderDeleteButton = (
  handleDeleteUser: () => void,
  isDeleting: boolean,
  isLocked: boolean,
  localize: (key: string) => string,
) => (
  <button
    className={cn(
      'mt-4 flex w-full items-center justify-center rounded-lg px-4 py-2 transition-colors duration-200',
      isLocked
        ? 'cursor-not-allowed bg-gray-200 text-gray-300 dark:bg-gray-500 dark:text-gray-600'
        : isDeleting
          ? 'cursor-not-allowed bg-gray-100 text-gray-700 dark:bg-gray-400 dark:text-gray-700'
          : 'bg-red-700 text-white hover:bg-red-800 ',
    )}
    onClick={handleDeleteUser}
    disabled={isDeleting || isLocked}
  >
    {isDeleting ? (
      <div className="flex h-6 justify-center">
        <Spinner className="icon-sm m-auto" />
      </div>
    ) : (
      <>
        {isLocked ? (
          <>
            <LockIcon />
            <span className="ml-2">{localize('com_ui_locked')}</span>
          </>
        ) : (
          <>
            <LockIcon />
            <span className="ml-2">{localize('com_nav_delete_account_button')}</span>
          </>
        )}
      </>
    )}
  </button>
);

export default DeleteAccount;
