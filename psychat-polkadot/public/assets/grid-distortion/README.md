# Grid Distortion Images

This folder contains images for the GridDistortion component. The component works best with high-resolution images that have good contrast and interesting visual elements.

## Recommended Image Specifications

- **Resolution**: 1920x1080 or higher (the component handles scaling)
- **Format**: JPG for photos, PNG for graphics with transparency
- **File Size**: 200-500KB for optimal web performance
- **Aspect Ratio**: 16:9 works best for most screens

## Suggested Image Types

### For PsyChat Theme:
- Abstract geometric patterns
- Neural network visualizations
- Holographic/cyberpunk textures
- Gradient backgrounds that match your color scheme
- Circuit board patterns
- Digital art with high contrast

### Sample Images to Add:
1. `default-bg.jpg` - A fallback image (required)
2. `neural-network.jpg` - Neural network visualization
3. `holographic-pattern.jpg` - Holographic/cyberpunk texture
4. `cyber-grid.jpg` - Circuit board or grid pattern
5. `gradient-bg.jpg` - Gradient background matching your theme

## Usage

```tsx
import PsyGridDistortion from '@/components/ui/PsyGridDistortion';

// Basic usage
<PsyGridDistortion 
  imageSrc="/assets/grid-distortion/neural-network.jpg"
  variant="background"
  intensity="medium"
/>

// Hero section
<PsyGridDistortion 
  imageSrc="/assets/grid-distortion/holographic-pattern.jpg"
  variant="hero"
  intensity="strong"
/>

// Card component
<PsyGridDistortion 
  imageSrc="/assets/grid-distortion/cyber-grid.jpg"
  variant="card"
  intensity="subtle"
/>
```

## Performance Tips

- Optimize images before adding them
- Use WebP format when possible for better compression
- Consider using different images for different screen sizes
- Test the distortion effect with your chosen images

## Error Handling

The component includes automatic fallback to `default-bg.jpg` if the primary image fails to load. Make sure to always have a fallback image in this folder.

