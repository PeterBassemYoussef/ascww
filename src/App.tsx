import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import ScrollToTop from './components/ScrollToTop';
import PageTitle from './components/PageTitle';
import { LEGACY_ROUTE_REDIRECTS, ROUTES } from './constants/routes';
import { useSiteLanguage } from './context/SiteLanguageContext';

const News = lazy(() => import('./pages/News'));
const NewsDetails = lazy(() => import('./pages/NewsDetails'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const AboutCompanyPage = lazy(() => import('./pages/About'));
const BranchesPage = lazy(() => import('./pages/Branches'));
const VisionAndMessagePage = lazy(() => import('./pages/AboutVisionMission'));
const OrganizationStructurePage = lazy(() => import('./pages/AboutStructure'));
const ContractsRegulationPage = lazy(() => import('./pages/AboutRegulations'));
const CompanyAchievementsPage = lazy(() => import('./pages/AboutAchievements'));
const AdviceAndContactPage = lazy(() => import('./pages/AwarenessContact'));
const CyberSecurityGuidelinesPage = lazy(() => import('./pages/AwarenessCyberSecurity'));
const ForKidsAndWomenPage = lazy(() => import('./pages/AwarenessCommunityOutreach'));
const WaterQualityPage = lazy(() => import('./pages/WaterQuality'));
const RefiningWaterPage = lazy(() => import('./pages/WaterQualityPurification'));
const LabOfCompanyWaterPage = lazy(() => import('./pages/WaterQualityCentralLab'));
const LabOfCompanyPage = lazy(() => import('./pages/LabOfCompany'));
const WasteOfCompanyPage = lazy(() => import('./pages/WasteOfCompany'));
const TrainingOfCompanyPage = lazy(() => import('./pages/TrainingOfCompany'));
const InformationTechnologyOfCompanyPage = lazy(() => import('./pages/ItManagement'));
const SchoolSubmissionDataPage = lazy(() => import('./pages/SchoolSubmissionData'));
const SchoolOfCompanyPage = lazy(() => import('./pages/SchoolOfCompany'));
const SportOfCompanyPage = lazy(() => import('./pages/SportOfCompany'));
const SewageTreatmentPage = lazy(() => import('./pages/SanitationTreatment'));
const SafeSewageDisposalPage = lazy(() => import('./pages/SanitationSafeDisposal'));
const SaveSewageNetworkPage = lazy(() => import('./pages/SanitationNetworkPreservation'));
const IndustrialWastePage = lazy(() => import('./pages/SanitationIndustrialWaste'));
const IndustrialWasteRolePage = lazy(() => import('./pages/SanitationIndustrialWasteManagement'));
const CustomerCharterPage = lazy(() => import('./pages/ServicesCustomerCharter'));
const Tenders = lazy(() => import('./pages/Tenders'));
const TenderDetails = lazy(() => import('./pages/TenderDetails'));
const GeneralAdminTrainingPage = lazy(() => import('./pages/TrainingAdministrative'));
const CallCenterPage = lazy(() => import('./pages/ServicesCustomerCare'));
const ProvideRequestPage = lazy(() => import('./pages/ServicesInquiries'));
const ProvideComplainePage = lazy(() => import('./pages/ServicesComplaints'));
const HotlineAppPage = lazy(() => import('./pages/ServicesHotlineApp'));
const MyReadingAppPage = lazy(() => import('./pages/ServicesMeterReading'));
const IntegritySupportOverviewPage = lazy(() => import('./pages/AboutIntegrity'));
const IntegritySupportHighlightsPage = lazy(() => import('./pages/AboutIntegrityActivities'));
const ProfessionalConductPage = lazy(() => import('./pages/AboutCodeOfConduct'));
const BossTripsPage = lazy(() => import('./pages/TripsTheBoss'));
const JobsAndCompetitionPage = lazy(() => import('./pages/CareersVacancies'));
const ResultOfWorkerPage = lazy(() => import('./pages/CareersResults'));
const ServicesEvidancePage = lazy(() => import('./pages/ServicesGuide'));
const ContractOnServicePage = lazy(() => import('./pages/ServicesContractProcedures'));
const SearchPage = lazy(() => import('./pages/ServicesSearch'));

function App() {
  const { language } = useSiteLanguage();
  const isEnglish = language === 'en';

  return (
    <>
      <ScrollToTop />
      <PageTitle />
      <Suspense
        fallback={
          <div className="mx-auto flex min-h-[50vh] max-w-6xl items-center justify-center px-4 text-sm font-semibold text-slate-500">
            {isEnglish ? 'Loading page...' : 'جاري تحميل الصفحة...'}
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
          <Route path={ROUTES.awareness} element={<AdviceAndContactPage />} />
          <Route path={ROUTES.adviceAndContact} element={<AdviceAndContactPage />} />
          <Route path={ROUTES.cyberSecurityGuidelines} element={<CyberSecurityGuidelinesPage />} />
          <Route path={ROUTES.forKidsAndWomen} element={<ForKidsAndWomenPage />} />
          <Route path={ROUTES.waterQuality} element={<WaterQualityPage />} />
          <Route path={ROUTES.refiningWater} element={<RefiningWaterPage />} />
          <Route path={ROUTES.labOfCompanyWater} element={<LabOfCompanyWaterPage />} />
          <Route path={ROUTES.labOfCompany} element={<LabOfCompanyPage />} />
          <Route path={ROUTES.wasteOfCompany} element={<WasteOfCompanyPage />} />
          <Route path={ROUTES.trainingOfCompany} element={<TrainingOfCompanyPage />} />
          <Route
            path={ROUTES.informationTechnologyOfCompany}
            element={<InformationTechnologyOfCompanyPage />}
          />
          <Route path={ROUTES.schoolSubmissionData} element={<SchoolSubmissionDataPage />} />
          <Route path={ROUTES.schoolGallery} element={<SchoolOfCompanyPage />} />
          <Route path={ROUTES.sportOfCompany} element={<SportOfCompanyPage />} />
          <Route path={ROUTES.sanitation} element={<SewageTreatmentPage />} />
          <Route path={ROUTES.sewageTreatment} element={<SewageTreatmentPage />} />
          <Route path={ROUTES.safeSewageDisposal} element={<SafeSewageDisposalPage />} />
          <Route path={ROUTES.saveSewageNetwork} element={<SaveSewageNetworkPage />} />
          <Route path={ROUTES.industrialWaste} element={<IndustrialWastePage />} />
          <Route path={ROUTES.industrialWasteRole} element={<IndustrialWasteRolePage />} />
          <Route path={ROUTES.customerCharter} element={<CustomerCharterPage />} />
          <Route path={ROUTES.newsArchive} element={<News />} />
          <Route path={ROUTES.newsDetails} element={<NewsDetails />} />
          <Route path={ROUTES.projectsArchive} element={<Projects />} />
          <Route path={ROUTES.projectDetails} element={<ProjectDetails />} />
          <Route path={ROUTES.tendersArchive} element={<Tenders />} />
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
