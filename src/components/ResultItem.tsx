import React, { memo } from 'react';
import { UserNode } from '../model/user';
import { ScanningTab } from '../model/scanning-tab';

interface ResultItemProps {
  user: UserNode;
  isSelected: boolean;
  currentTab: ScanningTab;
  showLetter: boolean;
  firstLetter: string;
  toggleUser: (checked: boolean, user: UserNode) => void;
  onWhitelistToggle: (user: UserNode) => void;
  UserCheckIcon: React.FC;
  UserUncheckIcon: React.FC;
}

// Using a named function for better debugging in Preact DevTools
const ResultItemComponent = ({
  user,
  isSelected,
  currentTab,
  showLetter,
  firstLetter,
  toggleUser,
  onWhitelistToggle,
  UserCheckIcon,
  UserUncheckIcon,
}: ResultItemProps) => (
  <React.Fragment>
    {showLetter && <div className='alphabet-character'>{firstLetter}</div>}
    <label className='result-item'>
      <div className='flex grow align-center'>
        <div
          className='avatar-container'
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            onWhitelistToggle(user);
          }}
        >
          <img
            className='avatar'
            alt={user.username}
            src={user.profile_pic_url}
            loading='lazy'
            decoding='async'
          />
          <span className='avatar-icon-overlay-container'>
            {currentTab === 'non_whitelisted' ? (
              <UserCheckIcon />
            ) : (
              <UserUncheckIcon />
            )}
          </span>
        </div>
        <div className='flex column m-medium'>
          <a
            className='fs-xlarge'
            target='_blank'
            href={`/${user.username}`}
            rel='noreferrer'
          >
            {user.username}
          </a>
          <span className='fs-medium'>{user.full_name}</span>
        </div>
        {user.is_verified && <div className='verified-badge'>✔</div>}
        {user.is_private && (
          <div className='flex justify-center w-100'>
            <span className='private-indicator'>Private</span>
          </div>
        )}
      </div>
      <input
        className='account-checkbox'
        type='checkbox'
        checked={isSelected}
        onChange={e => toggleUser(e.currentTarget.checked, user)}
      />
    </label>
  </React.Fragment>
);

export const ResultItem = memo(ResultItemComponent);
