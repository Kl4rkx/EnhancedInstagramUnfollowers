import React, { useCallback, useMemo } from 'react';
import { assertUnreachable, getMaxPage } from '../utils/utils';
import { State } from '../model/state';
import { UserNode } from '../model/user';
import { UNFOLLOWERS_PER_PAGE } from '../constants/constants';
import { TranslationKey } from '../constants/translations';
import { ResultItem } from './ResultItem';


export interface SearchingProps {
  state: State;
  whitelistedResults: readonly UserNode[];
  selectedIds: Set<string>;
  onWhitelistUpdate: (users: readonly UserNode[]) => void;
  setState: (state: State | ((prev: State) => State)) => void;
  scanningPaused: boolean;
  pauseScan: () => void;
  handleScanFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleUser: (checked: boolean, user: UserNode) => void;
  UserCheckIcon: React.FC;
  UserUncheckIcon: React.FC;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string;
}

export const Searching = ({
  state,
  whitelistedResults,
  selectedIds,
  onWhitelistUpdate,
  setState,
  scanningPaused,
  pauseScan,
  handleScanFilter,
  toggleUser,
  UserCheckIcon,
  UserUncheckIcon,
  sidebarOpen,
  setSidebarOpen,
  t,
}: SearchingProps) => {
  // Granular extraction — only re-derive when the specific fields change
  const currentTab = state.status === 'scanning' ? state.currentTab : 'non_whitelisted' as const;
  const searchTerm = state.status === 'scanning' ? state.searchTerm : '';
  const filter = state.status === 'scanning' ? state.filter : null;
  const page = state.status === 'scanning' ? state.page : 1;
  const selectedResults = state.status === 'scanning' ? state.selectedResults : [];

  // Stable reference for results — avoids creating a new [] on every render when not scanning
  const scanningResults = state.status === 'scanning' ? state.results : null;
  const results = useMemo(
    () => scanningResults ?? [],
    [scanningResults],
  );

  const whitelistedIds = useMemo(
    () => new Set(whitelistedResults.map(user => user.id)),
    [whitelistedResults],
  );

  const usersForDisplay = useMemo(() => {
    if (!filter) {
      return [];
    }
    const term = searchTerm.toLowerCase();
    const filtered: UserNode[] = [];
    for (const result of results) {
      const isWhitelisted = whitelistedIds.has(result.id);
      if (currentTab === 'non_whitelisted' && isWhitelisted) {
        continue;
      }
      if (currentTab === 'whitelisted' && !isWhitelisted) {
        continue;
      }
      if (!filter.showPrivate && result.is_private) {
        continue;
      }
      if (!filter.showVerified && result.is_verified) {
        continue;
      }
      if (!filter.showFollowers && result.follows_viewer) {
        continue;
      }
      if (!filter.showNonFollowers && !result.follows_viewer) {
        continue;
      }
      if (!filter.showWithOutProfilePicture && result.profile_pic_url.includes('default_profile_400x400')) {
        continue;
      }
      if (
        searchTerm !== '' &&
        !(result.username.toLowerCase().includes(term) || result.full_name.toLowerCase().includes(term))
      ) {
        continue;
      }
      filtered.push(result);
    }
    return filtered;
  }, [results, whitelistedIds, currentTab, filter, searchTerm]);

  const sortedUsersForDisplay = useMemo(
    () => [...usersForDisplay].sort((a, b) => (a.username > b.username ? 1 : -1)),
    [usersForDisplay],
  );

  const pageUsers = useMemo(() => {
    const start = UNFOLLOWERS_PER_PAGE * (page - 1);
    return sortedUsersForDisplay.slice(start, start + UNFOLLOWERS_PER_PAGE);
  }, [sortedUsersForDisplay, page]);

  const maxPage = useMemo(() => getMaxPage(sortedUsersForDisplay), [sortedUsersForDisplay]);

  // Pre-compute letters for page users
  const pageUsersWithLetters = useMemo(() => {
    let prevLetter = '';
    return pageUsers.map(user => {
      const letter = user.username.substring(0, 1).toUpperCase();
      const showLetter = letter !== prevLetter;
      if (showLetter) {
        prevLetter = letter;
      }
      return { user, showLetter, letter };
    });
  }, [pageUsers]);

  // Callback for whitelist toggle from ResultItem — stable reference
  const onWhitelistToggle = useCallback((user: UserNode) => {
    let updated: readonly UserNode[];
    switch (currentTab) {
      case 'non_whitelisted':
        updated = [...whitelistedResults, user];
        break;
      case 'whitelisted':
        updated = whitelistedResults.filter(r => r.id !== user.id);
        break;
      default:
        assertUnreachable(currentTab);
    }
    onWhitelistUpdate(updated);
  }, [currentTab, whitelistedResults, onWhitelistUpdate]);

  if (state.status !== 'scanning') {
    return null;
  }

  return (
    <section className='flex'>
      {sidebarOpen && (
        <div
          className='sidebar-backdrop'
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside className={`app-sidebar ${sidebarOpen ? 'active' : ''}`}>
        <button
          className='sidebar-close'
          onClick={() => setSidebarOpen(false)}
          aria-label='Close sidebar'
        >
          ✕
        </button>
        <menu className='flex column m-clear p-clear'>
          <p>{t('filter')}</p>
          <label className='badge m-small'>
            <input
              type='checkbox'
              name='showNonFollowers'
              checked={state.filter.showNonFollowers}
              onChange={handleScanFilter}
            />
            &nbsp;{t('nonFollowers')}
          </label>
          <label className='badge m-small'>
            <input
              type='checkbox'
              name='showFollowers'
              checked={state.filter.showFollowers}
              onChange={handleScanFilter}
            />
            &nbsp;{t('followers')}
          </label>
          <label className='badge m-small'>
            <input
              type='checkbox'
              name='showVerified'
              checked={state.filter.showVerified}
              onChange={handleScanFilter}
            />
            &nbsp;{t('verified')}
          </label>
          <label className='badge m-small'>
            <input
              type='checkbox'
              name='showPrivate'
              checked={state.filter.showPrivate}
              onChange={handleScanFilter}
            />
            &nbsp;{t('private')}
          </label>
          <label className='badge m-small'>
            <input
              type='checkbox'
              name='showWithOutProfilePicture'
              checked={state.filter.showWithOutProfilePicture}
              onChange={handleScanFilter}
            />
            &nbsp;{t('withoutProfilePicture')}
          </label>
        </menu>
        <div className='sidebar-stats'>
          <p>{t('displayed')}: {sortedUsersForDisplay.length}</p>
          <p>{t('total')}: {state.results.length}</p>
          <p className='whitelist-counter'>
            <span className='whitelist-badge'>★</span> {t('whitelistedCount')}: {whitelistedResults.length}
          </p>
        </div>
        {/* Scan controls */}
        <div className='controls'>
          <button
            className='button-control button-pause'
            onClick={pauseScan}
          >
            {scanningPaused ? t('resume') : t('pause')}
          </button>
        </div>
        <div className='sidebar-pagination'>
          <p>{t('pages')}</p>
          <div className='pagination-controls'>
            <a
              onClick={() => {
                if (state.page - 1 > 0) {
                  setState({
                    ...state,
                    page: state.page - 1,
                  });
                }
              }}
              className='p-medium'
            >
              ❮
            </a>
            <span>
              {state.page}&nbsp;/&nbsp;{maxPage}
            </span>
            <a
              onClick={() => {
                if (state.page < maxPage) {
                  setState({
                    ...state,
                    page: state.page + 1,
                  });
                }
              }}
              className='p-medium'
            >
              ❯
            </a>
          </div>
        </div>
        <button
          className='unfollow'
          onClick={() => {
            if (!confirm(t('areYouSure'))) {
              return;
            }
            // TODO TEMP until types are properly fixed
            // @ts-ignore
            setState(prevState => {
              if (prevState.status !== 'scanning') {
                return prevState;
              }
              if (prevState.selectedResults.length === 0) {
                alert(t('mustSelectAtLeastOne'));
                return prevState;
              }
              const newState: State = {
                ...prevState,
                status: 'unfollowing',
                percentage: 0,
                unfollowLog: [],
                filter: {
                  showSucceeded: true,
                  showFailed: true,
                },
              };
              return newState;
            });
          }}
        >
          {t('unfollow')} ({selectedResults.length})
        </button>
      </aside>
      <article className='results-container'>
        <nav className='tabs-container'>
          <div
            className={`tab ${state.currentTab === 'non_whitelisted' ? 'tab-active' : ''}`}
            onClick={() => {
              if (state.currentTab === 'non_whitelisted') {
                return;
              }
              setState({
                ...state,
                currentTab: 'non_whitelisted',
                selectedResults: [],
              });
            }}
          >
            {t('nonWhitelisted')}
          </div>
          <div
            className={`tab ${state.currentTab === 'whitelisted' ? 'tab-active' : ''}`}
            onClick={() => {
              if (state.currentTab === 'whitelisted') {
                return;
              }
              setState({
                ...state,
                currentTab: 'whitelisted',
                selectedResults: [],
              });
            }}
          >
            {t('whitelisted')}
          </div>
        </nav>
        <div className='results-list'>
          {pageUsersWithLetters.map(({ user, showLetter, letter }) => (
            <ResultItem
              key={user.id}
              user={user}
              isSelected={selectedIds.has(user.id)}
              currentTab={state.currentTab}
              showLetter={showLetter}
              firstLetter={letter}
              toggleUser={toggleUser}
              onWhitelistToggle={onWhitelistToggle}
              UserCheckIcon={UserCheckIcon}
              UserUncheckIcon={UserUncheckIcon}
            />
          ))}
        </div>
      </article>
    </section>
  );
};
