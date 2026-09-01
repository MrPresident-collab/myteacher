import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import { RootLayout } from "./routes/__root";
import { HomePage } from "./routes/index";
import { LoginPage } from "./routes/auth/login";
import { RegisterPage } from "./routes/auth/register";
import { TeachersPage } from "./routes/professores";
import { TeacherProfilePage } from "./routes/professores.$teacherId";
import { ContactTeacherPage } from "./routes/contactar";
import { OnboardingPage } from "./routes/onboarding";
import { TeacherRegistrationPage } from "./routes/tornar-se-professor";
import { BusinessPage } from "./routes/business";
import { HowItWorksPage } from "./routes/como-funciona";
import { AboutPage } from "./routes/sobre";
import { PrivacyPolicyPage } from "./routes/privacidade";
import { CookiesPolicyPage } from "./routes/cookies";
import { LevelTestPage } from "./routes/teste-de-nivel";
import { DailyChallengePage } from "./routes/desafio-diario";
import { QuizPage } from "./routes/quiz";
import { LearnerDashboardPage } from "./routes/dashboard/aluno";
import { TeacherDashboardPage } from "./routes/dashboard/professor";
import { AdminDashboardPage } from "./routes/admin/index";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/register",
  component: RegisterPage,
});

const teachersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/professores",
  component: TeachersPage,
});

const teacherProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/professores/$teacherId",
  component: TeacherProfilePage,
});

const contactTeacherRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/professores/$teacherId/contactar",
  component: ContactTeacherPage,
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding",
  component: OnboardingPage,
});

const becomeTeacherRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tornar-se-professor",
  component: TeacherRegistrationPage,
});

const businessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/business",
  component: BusinessPage,
});

const howItWorksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/como-funciona",
  component: HowItWorksPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sobre",
  component: AboutPage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacidade",
  component: PrivacyPolicyPage,
});

const cookiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cookies",
  component: CookiesPolicyPage,
});

const levelTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teste-de-nivel",
  component: LevelTestPage,
});

const dailyChallengeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/desafio-diario",
  component: DailyChallengePage,
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quiz",
  component: QuizPage,
});

const learnerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/aluno",
  component: LearnerDashboardPage,
});

const teacherDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/professor",
  component: TeacherDashboardPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  teachersRoute,
  teacherProfileRoute,
  contactTeacherRoute,
  onboardingRoute,
  becomeTeacherRoute,
  businessRoute,
  howItWorksRoute,
  aboutRoute,
  privacyRoute,
  cookiesRoute,
  levelTestRoute,
  dailyChallengeRoute,
  quizRoute,
  learnerDashboardRoute,
  teacherDashboardRoute,
  adminDashboardRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
