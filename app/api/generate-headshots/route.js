import Replicate from 'replicate';
import { NextResponse } from 'next/server';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    // Parse the form data
    const formData = await request.formData();
    const imageFile = formData.get('image');
    
    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Convert file to base64 data URL
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = imageFile.type;
    const dataUrl = `data:${mimeType};base64,${base64}`;

    console.log('Starting AI generation...');

    // Generate multiple headshot styles using different prompts
    const styles = [
      {
        name: 'Professional',
        prompt: 'professional corporate headshot, business attire, neutral background, high quality, professional lighting'
      },
      {
        name: 'Corporate',
        prompt: 'executive corporate portrait, formal business suit, clean background, professional studio lighting'
      },
      {
        name: 'Casual',
        prompt: 'casual professional headshot, smart casual attire, soft lighting, approachable and friendly'
      },
      {
        name: 'Executive',
        prompt: 'executive leadership portrait, formal attire, sophisticated background, confident and authoritative'
      }
    ];

    // Generate all headshots in parallel
    const generationPromises = styles.map(async (style) => {
      try {
        const output = await replicate.run(
          "tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4",
          {
            input: {
              prompt: `${style.prompt}, photorealistic, high resolution`,
              input_image: dataUrl,
              negative_prompt: "blurry, low quality, distorted, cartoon, anime, painting, sketch",
              num_outputs: 1,
              guidance_scale: 5,
              num_inference_steps: 20,
              seed: Math.floor(Math.random() * 1000000)
            }
          }
        );

        return {
          id: Math.random().toString(36).substr(2, 9),
          style: style.name,
          url: Array.isArray(output) ? output[0] : output,
          generated_at: new Date().toISOString()
        };
      } catch (error) {
        console.error(`Error generating ${style.name} style:`, error);
        // Return a fallback or skip this style
        return null;
      }
    });

    // Wait for all generations to complete
    const results = await Promise.all(generationPromises);
    
    // Filter out any failed generations
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
      message: `Generated ${successfulResults.length} professional headshots`
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate headshots. Please try again.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
