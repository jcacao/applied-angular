import { createFeature, createReducer, createSelector } from '@ngrx/store';

export type TagPrefsState = {
  numberOfWatchedTags: number;
  numberOfIgnoredTags: number;
};

type NavBarState = {} & TagPrefsState;

const initialState: NavBarState = {
  numberOfWatchedTags: 0,
  numberOfIgnoredTags: 0,
};

export const navBarFeature = createFeature({
  name: 'app nav-bar',
  reducer: createReducer(initialState),
  extraSelectors: ({
    selectNumberOfIgnoredTags,
    selectNumberOfWatchedTags,
  }) => ({
    selectLinksNavbar: createSelector(
      selectNumberOfIgnoredTags,
      selectNumberOfWatchedTags,
      (ignored, watched) => ({
        numberOfIgnoredTags: ignored,
        numberOfWatchedTags: watched,
      }),
    ),
  }),
});

export const { selectLinksNavbar } = navBarFeature;
