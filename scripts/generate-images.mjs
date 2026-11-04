/**
 * Generates the static product imagery in public/img via Netlify AI Gateway
 * (Gemini image model). Run once; the output is committed and served through
 * the Netlify Image CDN. Re-run only when the art direction changes.
 *
 *   npm run generate:images
 */
import { writeFile } from 'node:fs/promises'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({
  apiKey: process.env.NETLIFY_AI_GATEWAY_KEY,
  httpOptions: {
    baseUrl: process.env.NETLIFY_AI_GATEWAY_BASE_URL?.replace(/\/$/, ''),
  },
})

const PALETTE =
  'Palette strictly limited to deep desaturated teal-black (#0B1418), slate teal (#16292F), ' +
  'soft bone white (#E8F0EE) and a single muted mint accent (#74C7AE). No other hues, no neon, no purple.'

const IMAGES = [
  {
    file: 'earbuds-hero.png',
    prompt:
      'Editorial product photograph of a pair of small matte bone-white wireless earbuds, ' +
      'rounded organic pebble shapes with a soft silicone ear tip and a thin mint-coloured light seam. ' +
      'Floating at a slight angle against a deep teal-black studio void, lit by one large soft top-left ' +
      'source with gentle falloff and a faint mint rim light on the lower edge. Shallow depth of field, ' +
      'fine matte texture visible, subtle contact shadow, lots of empty negative space around the product. ' +
      'Calm, clinical, quiet-luxury medical-device aesthetic. No text, no logos, no hands, no people. ' +
      PALETTE,
  },
  {
    file: 'earbuds-case.png',
    prompt:
      'Editorial product photograph of a small matte charging case for wireless earbuds, a soft rounded ' +
      'squircle in slate teal with a bone-white lid and a single thin mint indicator line, shown open at ' +
      'a three-quarter angle on a seamless deep teal-black surface. One soft diffused light from the right, ' +
      'long gentle shadow, fine sandblasted texture. Minimal, restrained, quiet-luxury medical-device ' +
      'aesthetic. No text, no logos, no hands, no people. ' +
      PALETTE,
  },
]

for (const { file, prompt } of IMAGES) {
  process.stdout.write(`generating ${file} ... `)
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image',
    contents: prompt,
  })

  const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)
  if (!part?.inlineData?.data) {
    console.log('no image returned')
    continue
  }

  await writeFile(`public/img/${file}`, Buffer.from(part.inlineData.data, 'base64'))
  console.log('done')
}
