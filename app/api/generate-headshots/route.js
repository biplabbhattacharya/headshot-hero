import Replicate from 'replicate';
import { NextResponse } from 'next/server';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    console.log('API endpoint called - better headshot model');
    
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

    console.log('Starting generation with face-preserving model...');

    // Define headshot styles with better prompts
    const styles = [
      {
        name: 'Professional',
        prompt: 'professional corporate headshot, wearing business suit, clean white background, studio lighting, high quality photography, LinkedIn profile photo'
      },
      {
        name: 'Corporate',
        prompt: 'executive corporate portrait, formal business attire, neutral gray background, professional lighting, confident expression, corporate photography'
      },
      {
        name: 'Casual',
        prompt: 'professional casual headshot, smart casual clothing, soft natural lighting, clean background, approachable friendly expression'
      },
      {
        name: 'Executive',
        prompt: 'senior executive portrait, premium business suit, sophisticated dark background, dramatic lighting, authoritative confident pose'
      }
    ];

    // Generate all 4 styles using a better face-preserving model
    const generationPromises = styles.map(async (style, index) => {
      try {
        console.log(`Generating ${style.name} style...`);
        
        const output = await replicate.run(
          // Better model that preserves faces (~$0.03 per image)
          "tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4",
          {
            input: {
              prompt: `${style.prompt}, photorealistic, detailed face, preserve facial features, professional photography, high resolution`,
              input_image: dataUrl,
              negative_prompt: "blurry, low quality, distorted face, different person, cartoon, anime, painting, sketch, bad anatomy, deformed face",
              num_outputs: 1,
              guidance_scale: 5,
              num_inference_steps: 30,
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

    console.log(`Successfully generated ${successfulResults.length} face-preserving headshots`);

    return NextResponse.json({
      success: true,
      images: successfulResults,
      message: `Generated ${successfulResults.length} professional headshots with face preservation`,
      cost_estimate: `~$${(successfulResults.length * 0.03).toFixed(2)} USD`
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
