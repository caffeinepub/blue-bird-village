# Specification

## Summary
**Goal:** Improve the visual prominence and visibility of all interactive buttons in the Blue Bird Village game UI to make them clearly legible and easier to interact with.

**Planned changes:**
- Update the mute/unmute button in `GameHUD.tsx` with a distinct border, background color, and sufficient padding
- Enhance the yellow (jump), green (music), and pink (hints) action buttons in `TouchControls.tsx` with stronger contrast and clearly distinguishable icons
- Update `BlockHotbar.tsx` hotbar slot buttons to have visible borders, with the active slot highlighted by a bright distinct border
- Add hover state (brightness increase) and active/pressed state (slight scale down or darker shade) to all buttons
- Ensure all button styles remain consistent with the Minecraft pixel-art theme (blocky, flat, Press Start 2P font)

**User-visible outcome:** All game UI buttons are clearly visible, prominently styled, and provide visual feedback on hover and press, while maintaining the existing Minecraft pixel-art aesthetic.
