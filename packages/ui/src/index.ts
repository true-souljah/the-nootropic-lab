export { default as AffiliateDisclosure } from './AffiliateDisclosure';
export { default as CookieBanner } from './CookieBanner';
export { default as ComparisonTable } from './ComparisonTable';
// `EUBadge` is consumed only by `ComparisonTable` internally — kept on disk
// but no longer exported from the public surface.
export { default as SchemaOrg } from './SchemaOrg';
export { default as ScoreTooltip } from './ScoreTooltip';
export { default as SiteHeader } from './SiteHeader';
export { default as StickyCtaBar } from './StickyCtaBar';
export { default as SearchModal } from './SearchModal';
export type { SearchItem } from './SearchModal';
// Back-compat type aliases. The legacy `UseCaseListPage` component was
// deleted (replaced by `Listicle` in `./templates/Listicle.tsx`), but ~36
// app files still import the legacy type names. We re-route them onto the
// identical Listicle types so no app-side change is needed.
export type {
  ListicleFAQ as UseCaseFAQ,
  ListicleIngredientMechanism as IngredientMechanism,
  ListiclePick as UseCasePick,
} from './templates/Listicle';
export { default as SubscriptionCancellationPage } from './SubscriptionCancellationPage';
export type { CancellationStep, CancellationFAQ } from './SubscriptionCancellationPage';
export { default as ImprintPage } from './ImprintPage';
export { default as Sources } from './Sources';
export type { Source } from './Sources';
export { default as EditorialStandardsSection } from './EditorialStandardsSection';
export { trackAffiliateClick } from './trackAffiliateClick';
export type { AffiliateClickContext } from './trackAffiliateClick';
export { default as TrackedAffiliateLink } from './TrackedAffiliateLink';

// Design system primitives (Stack redesign — M1 foundation)
export { Card } from './primitives/Card';
export type { CardProps, CardVariant } from './primitives/Card';
export { Chip } from './primitives/Chip';
export type { ChipProps, ChipTone } from './primitives/Chip';
export { ScorePill } from './primitives/ScorePill';
export type { ScorePillProps } from './primitives/ScorePill';
export { Bar } from './primitives/Bar';
export type { BarProps, BarTone } from './primitives/Bar';
export { SparkBars } from './primitives/SparkBars';
export type { SparkBarsProps } from './primitives/SparkBars';
export { ToggleSwitch } from './primitives/ToggleSwitch';
export type { ToggleSwitchProps } from './primitives/ToggleSwitch';
export { Tabs, TabPanel } from './primitives/Tabs';
export type { TabsProps, TabPanelProps, TabItem } from './primitives/Tabs';
export { BreadcrumbBar } from './primitives/BreadcrumbBar';
export type { BreadcrumbBarProps, BreadcrumbItem } from './primitives/BreadcrumbBar';
export { Sidebar } from './primitives/Sidebar';
export type { SidebarProps, SidebarGroup, SidebarItem } from './primitives/Sidebar';
export { Skeleton } from './primitives/Skeleton';
export type { SkeletonProps } from './primitives/Skeleton';
export { ErrorState } from './primitives/ErrorState';
export type { ErrorStateProps } from './primitives/ErrorState';
export { FaqAccordion } from './primitives/FaqAccordion';
export type { FaqAccordionProps, FaqItem } from './primitives/FaqAccordion';
export { BrandMark } from './primitives/BrandMark';
export type { BrandMarkProps } from './primitives/BrandMark';
export { LiveRegion } from './primitives/LiveRegion';
export type { LiveRegionProps } from './primitives/LiveRegion';

// Public-surface chrome (Stack redesign — M2A foundation)
export { FPDisclosure } from './public-chrome/FPDisclosure';
export type { FPDisclosureProps } from './public-chrome/FPDisclosure';
export { FPByline } from './public-chrome/FPByline';
export type { FPBylineProps } from './public-chrome/FPByline';
export { FPHeader } from './public-chrome/FPHeader';
export type { FPHeaderProps, FPNavLink } from './public-chrome/FPHeader';
export { FPFooter } from './public-chrome/FPFooter';
export type { FPFooterProps, FPFooterColumn, FPFooterLink } from './public-chrome/FPFooter';

// Public templates (Stack redesign — M2B)
export { default as Listicle } from './templates/Listicle';
export type {
  ListicleProps,
  ListicleFAQ,
  ListicleIngredientMechanism,
  ListiclePick,
} from './templates/Listicle';

// Public templates (Stack redesign — M2C)
// HeadToHeadFAQ keeps its bare name for back-compat with apps; the
// HeadToHeadFAQItem alias predated this consolidation.
export { default as HeadToHead } from './templates/HeadToHead';
export type {
  HeadToHeadProps,
  HeadToHeadFAQ,
  HeadToHeadFAQ as HeadToHeadFAQItem,
} from './templates/HeadToHead';

// Public templates (Stack redesign — M2D)
export { default as ThreeWay } from './templates/ThreeWay';
export type {
  ThreeWayProps,
  ThreeWayFAQ,
  ThreeWayFAQ as ThreeWayFAQItem,
} from './templates/ThreeWay';

// Public templates (Stack redesign — M2E)
export { default as IngredientDetail } from './templates/IngredientDetail';
export type { IngredientDetailProps } from './templates/IngredientDetail';

// Public shell (Stack redesign — M2F)
export { default as PublicShell } from './templates/PublicShell';
export type { PublicShellProps } from './templates/PublicShell';

// Shared cookie/privacy policy template (7 regions use this; LATAM has
// its own Spanish-language version that doesn't go through this template).
export { default as PolicyPage } from './templates/PolicyPage';
export type { PolicyPageProps } from './templates/PolicyPage';

// App shell + surfaces (Stack redesign — M3)
export { default as AppShell } from './templates/AppShell';
export type { AppShellProps, AppShellMode } from './templates/AppShell';
export { default as Discover } from './templates/Discover';
export type { DiscoverProps } from './templates/Discover';
export { default as BestOf } from './templates/BestOf';
export type { BestOfProps } from './templates/BestOf';
export { default as ProductDetail } from './templates/ProductDetail';
export type { ProductDetailProps } from './templates/ProductDetail';
export { default as IngredientLibrary } from './templates/IngredientLibrary';
export type { IngredientLibraryProps } from './templates/IngredientLibrary';
export { default as Comparator } from './templates/Comparator';
export type { ComparatorProps } from './templates/Comparator';

// Quiz (Stack redesign — M4A)
export { default as QuizFlow } from './templates/QuizFlow';
export type { QuizFlowProps } from './templates/QuizFlow';
export { default as QuizResults } from './templates/QuizResults';
export type { QuizResultsProps } from './templates/QuizResults';
export {
  scoreQuiz,
  goalsFit,
  caffeineFit,
  budgetFit,
  mbgFit,
} from './templates/quizScoring';
export type {
  QuizAnswers,
  QuizGoal,
  CaffeineSensitivity,
  MBGImportance,
  QuizMatch,
  QuizResult,
} from './templates/quizScoring';

// Shortlist (Stack redesign — M4B)
export { default as Shortlist } from './templates/Shortlist';
export type { ShortlistProps } from './templates/Shortlist';
export { default as ShortlistButton } from './templates/ShortlistButton';
export type { ShortlistButtonProps } from './templates/ShortlistButton';
export { useShortlist, useShortlistNote } from './templates/useShortlist';

// Dose calculator (Stack redesign — M4C)
export { default as DoseCalculator } from './templates/DoseCalculator';
export type { DoseCalculatorProps } from './templates/DoseCalculator';
export {
  parseClinicalDose,
  statusFor,
  defaultDoseFor,
} from './templates/doseRange';
export type { ParsedDose, DoseStatus } from './templates/doseRange';

// Command palette (Stack redesign — M4D, replaces SearchModal in new chrome)
export { default as CommandPalette } from './templates/CommandPalette';
export type { CommandPaletteProps } from './templates/CommandPalette';
export {
  useCaseListPageEnDefaults,
  useCaseListPageEsStrings,
  getUseCaseListStrings,
  headToHeadPageEnDefaults,
  headToHeadPageEsStrings,
  getHeadToHeadStrings,
  tpl,
} from './templateStrings';
export type {
  UseCaseListPageStrings,
  HeadToHeadPageStrings,
  TemplateLocale,
} from './templateStrings';

// SEO foundation — hreflang + canonical + OG + Twitter helpers + robots
export { REGIONS, buildAlternates, buildOpenGraph, buildTwitter } from './seo';
export { buildRobotsConfig } from './robotsConfig';
export type {
  RegionCode,
  BuildAlternatesParams,
  AlternatesOutput,
  BuildOpenGraphParams,
  OpenGraphOutput,
  BuildTwitterParams,
  TwitterOutput,
} from './seo';
