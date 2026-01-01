# Design Guidelines: French Hypnotherapy Web Application

## Design Approach & Philosophy

**Selected Approach**: Reference-Based (Wellness & Healthcare)
Drawing inspiration from modern wellness platforms (Calm, Headspace) combined with professional healthcare aesthetics. The design must convey trust, serenity, and professionalism while being warm and approachable for French-speaking clients.

**Core Principles**:
- Calming, therapeutic visual language
- Professional credibility with warmth
- Clear separation between public marketing and client portal
- French typography and language conventions respected

---

## Color Palette

**Primary Colors**:
- Deep Teal: 180 45% 35% (trust, calm, professionalism)
- Soft Sage: 145 25% 65% (healing, nature, wellness)

**Dark Mode**:
- Background: 220 15% 12%
- Surface: 220 12% 18%
- Primary: 180 50% 55%
- Sage accent: 145 30% 50%

**Light Mode**:
- Background: 40 20% 98%
- Surface: 0 0% 100%
- Text primary: 220 20% 20%
- Text secondary: 220 15% 45%

**Accent Colors**:
- Warm Amber (sparingly): 35 85% 65% - for CTAs and important actions
- Lavender (very subtle): 260 35% 75% - for secondary highlights

---

## Typography

**Font Families** (via Google Fonts):
- **Headlines**: "Playfair Display" - serif, elegant, trustworthy
- **Body/UI**: "Inter" - clean, modern, highly readable
- **Accent/Quotes**: "Crimson Text" - italic for testimonials

**Type Scale**:
- Hero headline: text-5xl md:text-6xl lg:text-7xl, font-bold
- Section titles: text-3xl md:text-4xl, font-semibold
- Card/component titles: text-xl md:text-2xl, font-medium
- Body text: text-base md:text-lg, leading-relaxed
- Small text: text-sm, tracking-wide

---

## Layout System

**Spacing Primitives**: Tailwind units of **4, 6, 8, 12, 16, 20** for consistent rhythm
- Component padding: p-6 to p-8
- Section spacing: py-16 md:py-20 lg:py-24
- Card gaps: gap-6 md:gap-8
- Container max-width: max-w-7xl for content sections

**Grid Patterns**:
- Services/Benefits: 3-column grid (lg:grid-cols-3 md:grid-cols-2)
- Blog articles: 2-column masonry style (md:grid-cols-2)
- Testimonials: 2-column staggered cards

---

## Component Library

**Navigation**:
- Sticky header with glass morphism effect (backdrop-blur-md, bg-opacity-90)
- Logo left, navigation center, "Réserver" CTA button right
- Mobile: Hamburger menu with smooth slide-in drawer

**Hero Section** (Homepage):
- Full-width, 85vh height with calming gradient overlay
- Large hero image: serene nature scene or peaceful therapy room
- Centered headline + subheadline + dual CTAs ("Réserver une séance" primary, "En savoir plus" outline)
- Floating trust indicators below hero (certifications, years experience)

**Service Cards**:
- Rounded-2xl cards with subtle shadow
- Icon top-left, title, description, "Découvrir" link
- Hover: slight lift (translate-y-1) and increased shadow

**Booking Interface**:
- Calendar component: custom styled with primary color highlights
- Time slot selection: pill-style buttons in grid
- Multi-step form with progress indicator
- Confirmation modal with calming animation

**Client Portal**:
- Dashboard with cards for: upcoming sessions, resources, session notes
- Side navigation (desktop), bottom tab bar (mobile)
- Document viewer for session notes (PDF-style interface)
- Resource library with search and category filters

**Blog/Articles**:
- Featured article hero card at top
- Grid of article cards with image, category tag, title, excerpt, read time
- Category filter pills
- Pagination or infinite scroll

**Contact Form**:
- Split layout: form left (60%), contact info + office hours right (40%)
- Floating labels for inputs
- Success state with calming checkmark animation

**Testimonials**:
- Large quote cards with client photo (or initials in circle)
- Star rating display
- Staggered heights for visual interest

**Footer**:
- 4-column layout: About, Services, Resources, Contact
- Newsletter signup with inline form
- Social links, certifications, legal links
- Warm gradient background transitioning from page

---

## Images

**Hero Image**: 
- Large, calming nature scene (forest path, peaceful water, soft sunrise) with subtle gradient overlay (teal to transparent)
- Alternative: Professional therapy room with warm lighting and comfortable seating

**Service Section Images**:
- Abstract, soft-focus imagery representing calm, focus, transformation
- Use sparingly - icon-led cards with occasional accent images

**About Section**:
- Professional headshot of the hypnotherapist in warm, natural lighting
- Office/therapy space photos showing welcoming environment

**Blog Thumbnails**:
- Each article needs relevant imagery - brain science, nature, wellness themes
- Consistent aspect ratio (16:9), subtle filters for cohesion

**Client Portal**:
- Minimal imagery - focus on clarity and functionality
- Use illustrations for empty states and onboarding

---

## Animations

**Use Very Sparingly**:
- Page transitions: subtle fade-in for route changes
- Booking confirmation: gentle checkmark animation
- Form interactions: input focus glow (ring-2 with primary color)
- Card hover: minimal lift and shadow increase
- NO scroll-triggered animations except gentle fade-ins for first viewport

---

## Key Interactions

**Booking Flow**:
1. Service selection → 2. Date/time picker → 3. Client info → 4. Confirmation
- Progress bar at top showing 4 steps
- "Retour" and "Continuer" buttons consistently placed

**Portal Navigation**:
- Clear visual distinction between public site and authenticated portal
- Dashboard as default landing after login
- Quick access to "Réserver" from anywhere in portal

**Accessibility**:
- WCAG AA compliant contrast ratios
- Full keyboard navigation support
- ARIA labels in French for screen readers
- Focus indicators visible and consistent

---

## French Language Conventions

- Use formal "vous" in all copy
- Accent marks rendered correctly in all fonts
- Date formats: DD/MM/YYYY
- Time formats: 24-hour (14h30)
- Phone numbers: +33 format with proper spacing

This design creates a professional, calming digital presence that builds trust while providing robust functionality for both marketing and client management.