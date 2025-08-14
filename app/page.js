import Replicate from 'replicate';
import { NextResponse } from 'next/server';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    console.log('API endpoint called - InstantID model');
    
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'Server configuration error: API token not found' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get('image');
    
    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    console.log('Processing image:', imageFile.name);

    // Convert to base64
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = imageFile.type;
    const dataUrl = `data:${mimeType};base64,${base64}`;

    console.log('Starting generation with InstantID model...');

    // Define professional headshot styles for InstantID
    const styles = [
      {
        name: 'Professional',
        prompt: 'professional business headshot, wearing dark blue business suit, white dress shirt, professional tie, clean white background, studio lighting, corporate photography, high quality, sharp focus, professional expression'
      },
      {
        name: 'Corporate',
        prompt: 'executive corporate portrait, wearing charcoal gray business suit, crisp white shirt, sitting at executive desk, neutral office background, professional lighting, confident expression, business photography'
      },
      {
        name: 'Casual',
        prompt: 'professional casual headshot, wearing smart casual blazer over collared shirt, soft natural lighting, clean minimalist background, approachable friendly expression, modern professional photography'
      },
      {
        name: 'Executive',
        prompt: 'senior executive portrait, wearing premium navy business suit, silk tie, sophisticated dark background with subtle lighting, authoritative confident expression, luxury business photography'
      }
    ];

    // Generate all 4 styles using InstantID
    const generationPromises = styles.map(async (style, index) => {
      try {
        console.log(`Generating ${style.name} style with InstantID...`);
        
        const output = await replicate.run(
          "zsxkib/instant-id:1101d3d9f25d0959c80c67bee72af3c9bbc5e2e8e9b5e1ed4f8fd71b4a3b1bb7",
          {
            input: {
              image: dataUrl,
              prompt: `${style.prompt}, photorealistic, detailed facial features, high resolution, professional photography`,
              negative_prompt: "blurry, low quality, cartoon, anime, painting, sketch, bad anatomy, deformed face, ugly, distorted features, multiple people, child, bad lighting",
              num_outputs: 1,
              guidance_scale: 5,
              num_inference_steps: 30,
              seed: Math.floor(Math.random() * 1000000),
              ip_adapter_scale: 0.8,
              controlnet_conditioning_scale: 0.8
            }
          }
        );

        return {
          id: `${index + 1}`,
          style: style.name,
          url: Array.isArray(output) ? output[0] : output,
          generated_at: new Date().toISOString()
        };
      } catch (error) {
        console.error(`Error generating ${style.name}:`, error.message);
        return null;
      }
    });

    // Wait for all generations
    const results = await Promise.all(generationPromises);
    const successfulResults = results.filter(result => result !== null);

    if (successfulResults.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate any headshots. Please try again.' },
        { status: 500 }
      );
    }

    console.log(`Successfully generated ${successfulResults.length} InstantID headshots`);

    return NextResponse.json({
      success: true,
      images: successfulResults,
      message: `Generated ${successfulResults.length} professional headshots with InstantID`,
      cost_estimate: `~$${(successfulResults.length * 0.05).toFixed(2)} USD`
    });

  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { 
        error: 'Generation failed',
        details: error.message
      },
      { status: 500 }
    );
  }
}
