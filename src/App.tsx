import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ScrollToTop from './components/ScrollToTop';
import PageTitle from './components/PageTitle';
import { LEGACY_ROUTE_REDIRECTS, ROUTES } from './constants/routes';

const NewsArchive = lazy(() => import('./pages/NewsArchive'));
const NewsDetails = lazy(() => import('./pages/NewsDetails'));
const ProjectsArchive = lazy(() => import('./pages/ProjectsArchive'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const AboutCompanyPage = lazy(() => import('./pages/AboutCompanyPage'));
const BranchesPage = lazy(() => import('./pages/BranchesPage'));
const VisionAndMessagePage = lazy(() => import('./pages/VisionAndMessagePage'));
const OrganizationStructurePage = lazy(() => import('./pages/OrganizationStructurePage'));
const ContractsRegulationPage = lazy(() => import('./pages/ContractsRegulationPage'));
const CompanyAchievementsPage = lazy(() => import('./pages/CompanyAchievementsPage'));
const AdviceAndContactPage = lazy(() => import('./pages/AdviceAndContactPage'));
const CyberSecurityGuidelinesPage = lazy(() => import('./pages/CyberSecurityGuidelinesPage'));
const ForKidsAndWomenPage = lazy(() => import('./pages/ForKidsAndWomenPage'));
const WaterQualityPage = lazy(() => import('./pages/WaterQualityPage'));
const RefiningWaterPage = lazy(() => import('./pages/RefiningWaterPage'));
const LabOfCompanyWaterPage = lazy(() => import('./pages/LabOfCompanyWaterPage'));
const LabCompanyPage = lazy(() => import('./pages/LabCompanyPage'));
const WasteStationsPage = lazy(() => import('./pages/WasteStationsPage'));
const TrainingCenterPage = lazy(() => import('./pages/TrainingCenterPage'));
const TechCenterPage = lazy(() => import('./pages/TechCenterPage'));
const SchoolSubmissionDataPage = lazy(() => import('./pages/SchoolSubmissionDataPage'));
const SchoolGalleryPage = lazy(() => import('./pages/SchoolGalleryPage'));
const SportActivityPage = lazy(() => import('./pages/SportActivityPage'));
const SewageTreatmentPage = lazy(() => import('./pages/SewageTreatmentPage'));
const SafeSewageDisposalPage = lazy(() => import('./pages/SafeSewageDisposalPage'));
const SaveSewageNetworkPage = lazy(() => import('./pages/SaveSewageNetworkPage'));
const IndustrialWastePage = lazy(() => import('./pages/IndustrialWastePage'));
const IndustrialWasteRolePage = lazy(() => import('./pages/IndustrialWasteRolePage'));
const CustomerCharterPage = lazy(() => import('./pages/CustomerCharterPage'));
const TendersArchive = lazy(() => import('./pages/TendersArchive'));
const TenderDetails = lazy(() => import('./pages/TenderDetails'));
const GeneralAdminTrainingPage = lazy(() => import('./pages/GeneralAdminTrainingPage'));
const CallCenterPage = lazy(() => import('./pages/CallCenterPage'));
const ProvideRequestPage = lazy(() => import('./pages/ProvideRequestPage'));
const ProvideComplainePage = lazy(() => import('./pages/ProvideComplainePage'));
const HotlineAppPage = lazy(() => import('./pages/HotlineAppPage'));
const MyReadingAppPage = lazy(() => import('./pages/MyReadingAppPage'));
const IntegritySupportOverviewPage = lazy(() => import('./pages/IntegritySupportOverviewPage'));
const IntegritySupportHighlightsPage = lazy(() => import('./pages/IntegritySupportHighlightsPage'));
const ProfessionalConductPage = lazy(() => import('./pages/ProfessionalConductPage'));
const BossTripsPage = lazy(() => import('./pages/BossTripsPage'));
const JobsAndCompetitionPage = lazy(() => import('./pages/JobsAndCompetitionPage'));
const ResultOfWorkerPage = lazy(() => import('./pages/ResultOfWorkerPage'));
const ServicesEvidancePage = lazy(() => import('./pages/ServicesEvidancePage'));
const ContractOnServicePage = lazy(() => import('./pages/ContractOnServicePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));

function App() {
  return (
    <>
      <ScrollToTop />
      <PageTitle />
      <Suspense
        fallback={
          <div className="mx-auto flex min-h-[50vh] max-w-6xl items-center justify-center px-4 text-sm font-semibold text-slate-500">
            جاري تحميل الصفحة...
          </div>
        }
      >
        <Routes>
          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path={ROUTES.aboutCompany} element={<AboutCompanyPage />} />
          <Route path={ROUTES.branches} element={<BranchesPage />} />
          <Route path={ROUTES.visionAndMessage} element={<VisionAndMessagePage />} />
          <Route path={ROUTES.organizationStructure} element={<OrganizationStructurePage />} />
          <Route path={ROUTES.contractsRegulation} element={<ContractsRegulationPage />} />
          <Route path={ROUTES.companyAchievements} element={<CompanyAchievementsPage />} />
          <Route path={ROUTES.adviceAndContact} element={<AdviceAndContactPage />} />
          <Route path={ROUTES.cyberSecurityGuidelines} element={<CyberSecurityGuidelinesPage />} />
          <Route path={ROUTES.forKidsAndWomen} element={<ForKidsAndWomenPage />} />
          <Route path={ROUTES.waterQuality} element={<WaterQualityPage />} />
          <Route path={ROUTES.refiningWater} element={<RefiningWaterPage />} />
          <Route path={ROUTES.labOfCompanyWater} element={<LabOfCompanyWaterPage />} />
          <Route path={ROUTES.labOfCompany} element={<LabCompanyPage />} />
          <Route path={ROUTES.wasteOfCompany} element={<WasteStationsPage />} />
          <Route path={ROUTES.trainingOfCompany} element={<TrainingCenterPage />} />
          <Route
            path={ROUTES.informationTechnologyOfCompany}
            element={<TechCenterPage />}
          />
          <Route path={ROUTES.schoolSubmissionData} element={<SchoolSubmissionDataPage />} />
          <Route path={ROUTES.schoolGallery} element={<SchoolGalleryPage />} />
          <Route path={ROUTES.sportOfCompany} element={<SportActivityPage />} />
          <Route path={ROUTES.sewageTreatment} element={<SewageTreatmentPage />} />
          <Route path={ROUTES.safeSewageDisposal} element={<SafeSewageDisposalPage />} />
          <Route path={ROUTES.saveSewageNetwork} element={<SaveSewageNetworkPage />} />
          <Route path={ROUTES.industrialWaste} element={<IndustrialWastePage />} />
          <Route path={ROUTES.industrialWasteRole} element={<IndustrialWasteRolePage />} />
          <Route path={ROUTES.customerCharter} element={<CustomerCharterPage />} />
          <Route path={ROUTES.newsArchive} element={<NewsArchive />} />
          <Route path={ROUTES.newsDetails} element={<NewsDetails />} />
          <Route path={ROUTES.projectsArchive} element={<ProjectsArchive />} />
          <Route path={ROUTES.projectDetails} element={<ProjectDetails />} />
          <Route path={ROUTES.tendersArchive} element={<TendersArchive />} />
          <Route path={ROUTES.tenderDetails} element={<TenderDetails />} />
          <Route path={ROUTES.generalAdminTraining} element={<GeneralAdminTrainingPage />} />
          <Route path={ROUTES.callCenter} element={<CallCenterPage />} />
          <Route path={ROUTES.provideRequest} element={<ProvideRequestPage />} />
          <Route path={ROUTES.provideComplaine} element={<ProvideComplainePage />} />
          <Route path={ROUTES.hotlineApp} element={<HotlineAppPage />} />
          <Route path={ROUTES.myReadingApp} element={<MyReadingAppPage />} />
          <Route
            path={ROUTES.integritySupportOverview}
            element={<IntegritySupportOverviewPage />}
          />
          <Route
            path={ROUTES.integritySupportHighlights}
            element={<IntegritySupportHighlightsPage />}
          />
          <Route
            path={ROUTES.professionalConduct}
            element={<ProfessionalConductPage />}
          />
          <Route path={ROUTES.bossTrips} element={<BossTripsPage />} />
          <Route path={ROUTES.jobsAndCompetition} element={<JobsAndCompetitionPage />} />
          <Route path={ROUTES.resultOfWorker} element={<ResultOfWorkerPage />} />
          <Route path={ROUTES.servicesEvidance} element={<ServicesEvidancePage />} />
          <Route path={ROUTES.contractOnService} element={<ContractOnServicePage />} />
          <Route path={ROUTES.search} element={<SearchPage />} />
          <Route path="/news-company/:id" element={<NewsDetails />} />
          <Route path="/projects-company/:id" element={<ProjectDetails />} />
          <Route path="/allTenders/:id" element={<TenderDetails />} />
          <Route path="/alltenders/:id" element={<TenderDetails />} />
          {LEGACY_ROUTE_REDIRECTS.map((legacyRoute) => (
            <Route
              key={legacyRoute.from}
              path={legacyRoute.from}
              element={<Navigate to={legacyRoute.to} replace />}
            />
          ))}
          <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;

