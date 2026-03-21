# Design System: Modern Luxury with a Story

## 1. Overview & Creative North Star: "The Digital Concierge"
This design system is built to evoke the tactile experience of a high-end boutique hotel and curated retail space. Our Creative North Star is **The Digital Concierge**—an interface that feels less like a website and more like a private invitation. 

To achieve "Modern Luxury," we move away from the rigid, boxed-in layouts of standard e-commerce. Instead, we utilize **Intentional Asymmetry** and **Editorial Layering**. By overlapping high-quality photography with typography and using varying surface heights, we create a sense of architectural depth. We treat the screen as a physical space: elements don't just sit on a grid; they are curated on a canvas.

---

## 2. Colors & Tonal Depth
The palette is rooted in a "Living Neutral" base of soft creams and charcoals, allowing the thematic "Floor Colors" to act as sophisticated anchors for different sections of the experience.

### Thematic Anchors
- **Primary (`#18281e`):** The "Nature Retreat." Use for deep, forest-inspired immersion.
- **Secondary (`#715a3e`):** The "Urban Elegance." A slate-gold hybrid for refined retail moments.
- **Tertiary (`#4b0c0f`):** The "Vintage Charm." A burgundy wine tone for heritage and storytelling.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. Luxury is seamless. Boundaries must be defined solely through:
1. **Background Shifts:** Moving from `surface` (`#fbf9f4`) to `surface-container-low` (`#f5f3ee`).
2. **Implicit Negative Space:** Utilizing the larger increments of our Spacing Scale (e.g., `12` or `16`) to create a psychological "stop" for the eye.

### Glass & Gradient Polish
To prevent a "flat" appearance, use `surface-variant` with a 60% opacity and a `20px` backdrop-blur for floating navigation or overlay cards. For primary CTAs, apply a subtle linear gradient from `primary` (`#18281e`) to `primary_container` (`#2d3e33`) at a 135-degree angle to give buttons a weighted, metallic luster.

---

## 3. Typography: The Editorial Contrast
We use a high-contrast pairing to balance heritage with modern functionality.

*   **The Voice (Noto Serif):** Used for `display` and `headline` levels. This font conveys the "Story." Use `display-lg` (3.5rem) with tighter letter-spacing (-0.02em) for hero moments to create an authoritative, editorial feel.
*   **The Engine (Manrope):** Used for `title`, `body`, and `labels`. This sans-serif is engineered for legibility. 
    *   **Action items:** Use `label-md` in All Caps with `0.1rem` letter-spacing for buttons and navigation to distinguish "utility" from "narrative."

---

## 4. Elevation & Depth: Tonal Layering
In this system, elevation is not about "rising off the page," but about "stacking fine materials."

*   **The Layering Principle:** Achieve hierarchy by nesting containers. A `surface-container-lowest` (`#ffffff`) card should sit atop a `surface-container` (`#f0eee9`) section. This creates a "soft lift" that feels organic.
*   **Ambient Shadows:** If a component must float (e.g., a booking modal), use a shadow tinted with `on-surface`: `box-shadow: 0 20px 40px rgba(27, 28, 25, 0.06)`. Avoid pure black or grey shadows.
*   **The Ghost Border:** If accessibility requires a stroke, use `outline-variant` (`#c3c8c2`) at **15% opacity**. It should be felt, not seen.
*   **Glassmorphism:** Use for persistent elements like the "Book Now" bar. Apply `surface_lowest` at 80% opacity with a heavy backdrop-blur to allow the rich floor colors to bleed through beautifully.

---

## 5. Components

### Buttons: The Tactile Interaction
*   **Primary:** Background gradient (Primary to Primary Container), `on-primary` text. Shape: `xl` (0.75rem) roundedness. 
*   **Secondary:** `surface-container-high` background with a "Ghost Border." 
*   **States:** On hover, primary buttons should shift +5% in brightness, never use a heavy drop shadow.

### Cards: The Gallery View
*   **Rule:** Forbid divider lines within cards.
*   **Structure:** Use `spacing-6` padding. Use `surface-container-low` as the base. Images must use `md` (0.375rem) corner radius. Use `notoSerif` for the product/room name and `manrope` for the price/details.

### Inputs: The Refined Form
*   **Style:** Minimalist. Only a bottom-stroke using `outline` (`#737873`) that thickens to 2px on focus using `primary`.
*   **Floating Labels:** Use `label-sm` in `on-surface-variant` that transitions to a smaller scale on focus.

### The Room-Switcher (Niche Component)
A horizontal scroll component using large-format photography. As the user scrolls, the background of the entire page transitions subtly between the thematic floor tones (`primary`, `secondary`, `tertiary`) using a 0.8s CSS transition for a "floor-to-floor" travel effect.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical margins. If an image is flush left, offset the text to the right using `spacing-20` to create a "magazine" layout.
*   **Do** prioritize "Breathing Room." If in doubt, increase the vertical padding using `spacing-16`.
*   **Do** use `primary-fixed-dim` for subtle icons to ensure they don't distract from the serif headlines.

### Don’t:
*   **Don’t** use 100% black. Always use `on-surface` (`#1b1c19`) for text to maintain a premium, softened contrast.
*   **Don’t** use standard "Drop Shadows" (0, 2, 4). They look cheap. Use the Ambient Shadow spec mentioned in Section 4.
*   **Don’t** use icons without context. Icons must support the text, never replace it in primary navigation.