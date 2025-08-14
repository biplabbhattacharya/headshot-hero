import Replicate from 'replicate';
import { NextResponse } from 'next/server';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    console.log('API endpoint called');
    
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

    console.log('Starting generation with cheapest models...');

    // Define 4 different cheap headshot prompts
    const styles = [
      {
        name: 'Professional',
        prompt: 'professional business headshot, corporate attire, clean background, studio lighting, high quality portrait photography'
      },
      {
        name: 'Corporate', 
        prompt: 'executive corporate portrait, formal business suit, neutral background, professional photographer, sharp focus'
      },
      {
        name: 'Casual',
        prompt: 'professional casual headshot, smart casual clothing, soft lighting, approachable expression, clean background'
      },
      {
        name: 'Executive',
        prompt: 'senior executive portrait, formal attire, confident expression, professional studio setup, high-end photography'
      }
    ];

    // Generate all 4 styles using the cheapest model
    const generationPromises = styles.map(async (style, index) => {
      try {
        console.log(`Generating ${style.name} style...`);
        
        const output = await replicate.run(
          // This is one of the cheapest models (~$0.0023 per image)
          "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
          {
            input: {
              prompt: `${style.prompt}, photorealistic, detailed, professional photography`,
              image: dataUrl,
              strength: 0.7, // How much to change the original image
              guidance_scale: 7.5,
              num_inference_steps: 20, // Lower steps = cheaper
              seed: Math.floor(Math.random() * 1000000)
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

    console.log(`Successfully generated ${successfulResults.length} headshots`);

    return NextResponse.json({
      success: true,
      images: successfulResults,
      message: `Generated ${successfulResults.length} professional headshots`,
      cost_estimate: `~$${(successfulResults.length * 0.0023).toFixed(3)} USD`
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
