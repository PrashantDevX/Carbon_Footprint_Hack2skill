# EcoTrack — Carbon Footprint Intelligence

## 🌍 Overview
EcoTrack is a robust, AI-powered carbon footprint tracker and intelligence platform designed to help users understand, measure, and reduce their environmental impact effectively. By integrating **Google Gemini** for intelligent tracking, **Cloud Vision API** for receipt scanning, and **Green Map / Leaderboards** for community engagement, it offers a seamless experience that gamifies and standardizes the user's path toward sustainability.

## 🎯 Chosen Vertical
**Sustainable Tech (Climate Tech / ESG)**
The solution is rooted in equipping individuals to combat climate change, making it directly aligned with Sustainable Technology by targeting behavioral habit shifts through gamification, local insights, and AI-driven coaching.

## 🧠 Approach and Logic
EcoTrack transforms raw data (such as energy bills or food habits) into an actionable and readable carbon profile.
- **Categorization Layer**: The carbon engine calculates emissions across five main vectors: *Transport, Energy, Food, Shopping, and Water*.
- **AI-Powered Recommendations Layer**: Integrating Google Gemini 1.5 allows the platform to move beyond static tips. It analyzes the specific area of highest impact and proposes tailored strategies (e.g. suggesting an EV vs hybrid based on the user's energy grid factors).
- **Gamification Layer**: Achievements, Goals, and Leaderboards (using relative Carbon Scores) provide positive reinforcement. A score threshold system (0-100) translates bulky kgCO₂e values into an intuitive grading methodology.
- **Scanner Subsystem**: Uses Cloud Vision API to analyze physical receipts. The extraction mechanism uses Natural Language Processing to detect unit metrics and item types, calculating carbon estimates per receipt in real-time.

## 🚀 How the Solution Works
1. **Onboarding & Initialization**: Users complete a quick wizard. Firebase Auth registers the user, and an initial `UserProfile` document is saved into Firestore.
2. **Dashboard & Calculator**: The user can log travel distances, food intake, and energy consumption through targeted modules. `useCarbonLogs` (powered by *TanStack Request*) syncs the data efficiently with Cloud Firestore.
3. **Receipt Scanning**: A user uploads a receipt image. The React client passes the image (via Firebase Storage) to a **Cloud Function**, which triggers **Google Cloud Vision API** to extract item text, match items against carbon factors, and return estimated values.
4. **Smart AI Assistant**: A dedicated Gemini chatbot uses *User Context Injection*. We parse the current `kgCO2e` emissions into the system prompt behind-the-scenes so Gemini knows exactly where the user struggles without asking them to prompt it manually.
5. **Real-time Observability**: Performance, user activity events, and Firebase App Checks wrap the application ensuring endpoints are rate-limited, metrics observed effectively, and rules properly followed.

## 📌 Assumptions Made
- Users have roughly average habits absent of explicit input. We default values using generalized local EPA and IPCC emission factors where direct user data may lack granularity.
- Gamification drives continued daily usage. Building a streak system encourages people to log minor behavioral shifts.
- Scanning confidence: The text parsing from OCR relies on common store abbreviations. A heuristic fallback value (0.12) is assigned if an item's description is unidentifiable.
- "EcoPoints" translate to badges based on simple linear growth, meaning every reduction action uniformly benefits the user's gamified profile.

## 🛡️ Architecture & Core Adherence
* **Code Quality**: Built with **React 18, TypeScript, and Vite**. Separation of concerns utilized extensively across Hooks (`/hooks`), Stores (`/store`), UI components (`/components`), and API connectors (`/lib`).
* **Security**: Incorporates **Firebase App Check** to fend off abused endpoints, alongside extensive row-level **Firestore Security Rules** ensuring authorized mutation access and data encapsulation.
* **Efficiency**: TanStack Query invalidation prevents unnecessary document refetching. Lazy loading of heavy components (`import()`) guarantees smooth navigation.
* **Testing**: Set up to execute E2E tests optimally structured via **Playwright** and robust Unit Tests running strictly on **Vitest**.
* **Accessibility**: Fully compatible with WCAG 2.1 AA. Built-in skip-links, ARIA tags, and accessible contrast thresholds guarantee seamless inclusivity across the suite.

## setup locally
Run \`npm install\` to acquire client dependencies.
Proceed with setting up `.env.local` replicating `.env.example`.
Run \`npm run dev\` and explore EcoTrack locally.
