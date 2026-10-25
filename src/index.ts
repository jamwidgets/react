/**
 * @jamwidgets/react - React hooks for Jamwidgets
 *
 * @example Subscribe form
 * ```tsx
 * import { useSubscribe } from '@jamwidgets/react';
 *
 * function Newsletter() {
 *   const { subscribe, status, error } = useSubscribe({
 *     siteKey: 'your-site-key',
 *   });
 *
 *   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
 *     e.preventDefault();
 *     const email = new FormData(e.currentTarget).get('email') as string;
 *     subscribe(email);
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input type="email" name="email" required />
 *       <button disabled={status === 'loading'}>
 *         {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
 *       </button>
 *       {status === 'success' && <p>Thanks for subscribing!</p>}
 *       {status === 'error' && <p>Error: {error?.message}</p>}
 *     </form>
 *   );
 * }
 * ```
 */

// No "use client" here: the core fetchers stay callable from Server Components,
// while the hooks and components below carry their own client boundary.

// Re-export types from core
export type {
  JamwidgetsConfig,
  SubscribeState,
  FormState,
  ReactionsState,
  CommentsState,
  WaitlistState,
  ViewCountsState,
  FeedbackState,
  PollState,
  AnnouncementsState,
  Comment,
  Announcement,
  PollWithResults,
  FeedbackType,
  ReactionCounts,
  JamwidgetsPost,
  SeriphPost, // deprecated alias
  FetchPostsOptions,
  FetchPostOptions,
  JamwidgetsGallery,
  GalleryPhoto,
  GallerySummary,
  GalleryPage,
  FetchGalleriesOptions,
  FetchGalleryOptions,
  FetchRandomPhotoOptions,
  ControllerStatus,
} from "@jamwidgets/core";

// Re-export API functions and helpers from core
export {
  fetchPosts,
  fetchPost,
  fetchGalleries,
  fetchGallery,
  fetchRandomPhoto,
  fetchSiteConfig,
  type SiteConfig,
  POWERED_BY_URL,
  POWERED_BY_LABEL,
  getConfigFromMeta,
  resolveConfig,
  DEFAULT_ENDPOINT,
  API_PATH,
  trackPageview,
  initAnalytics,
  type TrackPageviewOptions,
  JamwidgetsApiError,
  isNotFound,
} from "@jamwidgets/core";

export { Gallery, GalleryIndex, RandomPhoto } from "./Galleries.js";
export type { GalleryProps, GalleryIndexProps, RandomPhotoProps } from "./Galleries.js";
export { PoweredBy, usePoweredBy } from "./PoweredBy.js";
export type { PoweredByProps } from "./PoweredBy.js";
export {
  useSubscribe,
  useForm,
  useReactions,
  useComments,
  useWaitlist,
  useViews,
  useFeedback,
  usePoll,
  useAnnouncements,
} from "./hooks.js";
export type {
  UseSubscribeOptions,
  UseSubscribeReturn,
  UseFormOptions,
  UseFormReturn,
  UseReactionsOptions,
  UseReactionsReturn,
  UseCommentsOptions,
  UseCommentsReturn,
  UseWaitlistOptions,
  UseWaitlistReturn,
  UseViewsOptions,
  UseViewsReturn,
  UseFeedbackOptions,
  UseFeedbackReturn,
  UsePollOptions,
  UsePollReturn,
  UseAnnouncementsOptions,
  UseAnnouncementsReturn,
} from "./hooks.js";
