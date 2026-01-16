const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Helper function to safely extract and parse JSON from Gemini response
 */
function extractAndParseJSON(content) {
  if (!content || typeof content !== 'string') {
    throw new Error('Empty or invalid response from AI');
  }

  let cleaned = content.trim();

  // Remove markdown code blocks if present
  cleaned = cleaned.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
  
  // Try to find JSON object/array in the text
  // Look for first { or [ and last } or ]
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  const lastBrace = cleaned.lastIndexOf('}');
  const lastBracket = cleaned.lastIndexOf(']');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    // Extract JSON object
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  } else if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    // Extract JSON array
    cleaned = cleaned.substring(firstBracket, lastBracket + 1);
  }

  // Try to parse the cleaned content
  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    // Log the actual content for debugging
    console.error('JSON Parse Error - Content received:', cleaned.substring(0, 500));
    console.error('Parse error:', parseError.message);
    throw new Error(`Failed to parse JSON response: ${parseError.message}`);
  }
}

/**
 * Convert natural language procurement description to structured RFP
 */
async function createRFPFromText(description) {
  const prompt = `You are an AI assistant that helps convert natural language procurement requests into structured RFPs.

Given the following procurement description, extract and structure the information into a JSON format with the following fields:
- title: A concise title for the RFP
- description: The full description
- budget: Numeric budget amount (extract from text, return null if not specified)
- deadline: ISO date string (extract delivery deadline, return null if not specified)
- requirements: Array of requirement objects, each with:
  - item: Item name (e.g., "laptops", "monitors")
  - quantity: Number (extract from text)
  - specifications: Object with key-value pairs of specs (e.g., {"RAM": "16GB", "screenSize": "27-inch"})
- paymentTerms: Payment terms if mentioned (e.g., "net 30")
- warranty: Warranty requirements if mentioned

Procurement Description:
${description}

Return ONLY valid JSON, no markdown formatting, no code blocks, no explanations, no text before or after the JSON. The response must be valid JSON that can be parsed directly.`;

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3-flash-preview',
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json',
      }
    });

    const fullPrompt = `You are a helpful assistant that extracts structured data from procurement descriptions. You must return ONLY valid JSON with no additional text, markdown, or formatting. The response must start with { and end with }.\n\n${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    
    // Try multiple ways to get the text content
    let content = '';
    try {
      content = response.text();
    } catch (textError) {
      // Fallback: try to get text from candidates
      if (result.response && result.response.candidates && result.response.candidates[0]) {
        const candidate = result.response.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
          content = candidate.content.parts[0].text || '';
        }
      }
      if (!content) {
        throw new Error(`Unable to extract text from response: ${textError.message}`);
      }
    }
    
    if (!content || content.trim().length === 0) {
      throw new Error('Empty response received from AI');
    }
    
    const structuredData = extractAndParseJSON(content);
    return structuredData;
  } catch (error) {
    console.error('Error creating RFP from text:', error);
    console.error('Error stack:', error.stack);
    // Provide more helpful error message
    if (error.message.includes('JSON') || error.message.includes('parse')) {
      throw new Error('Failed to parse AI response. The AI may have returned invalid JSON. Please try again.');
    }
    throw new Error('Failed to parse procurement description. Please try again with more details.');
  }
}

/**
 * Parse vendor response email and extract structured data
 */
async function parseVendorResponse(emailBody, rfpData) {
  const prompt = `You are an AI assistant that extracts structured proposal data from vendor response emails.

Given an RFP and a vendor's email response, extract the following information:
- pricing: Object with itemized pricing (e.g., {"laptops": {"quantity": 20, "unitPrice": 1200, "total": 24000}, "monitors": {...}})
- totalPrice: Total proposal price
- deliveryTime: Delivery timeline
- paymentTerms: Payment terms offered
- warranty: Warranty offered
- additionalTerms: Any other important terms or conditions
- completeness: Percentage (0-100) of how well the proposal addresses the RFP requirements

RFP Details:
Title: ${rfpData.title}
Budget: ${rfpData.budget || 'Not specified'}
Requirements: ${JSON.stringify(rfpData.requirements, null, 2)}

Vendor Email Response:
${emailBody}

Return ONLY valid JSON with the structure above, no markdown formatting, no code blocks, no explanations, no text before or after the JSON. The response must be valid JSON that can be parsed directly.`;

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3-flash-preview',
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json',
      }
    });

    const fullPrompt = `You are a helpful assistant that extracts structured proposal data from vendor emails. You must return ONLY valid JSON with no additional text, markdown, or formatting. The response must start with { and end with }.\n\n${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    
    // Try multiple ways to get the text content
    let content = '';
    try {
      content = response.text();
    } catch (textError) {
      // Fallback: try to get text from candidates
      if (result.response && result.response.candidates && result.response.candidates[0]) {
        const candidate = result.response.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
          content = candidate.content.parts[0].text || '';
        }
      }
      if (!content) {
        throw new Error(`Unable to extract text from response: ${textError.message}`);
      }
    }
    
    if (!content || content.trim().length === 0) {
      throw new Error('Empty response received from AI');
    }
    
    const extractedData = extractAndParseJSON(content);
    return extractedData;
  } catch (error) {
    console.error('Error parsing vendor response:', error);
    console.error('Error stack:', error.stack);
    // Provide more helpful error message
    if (error.message.includes('JSON') || error.message.includes('parse')) {
      throw new Error('Failed to parse AI response. The AI may have returned invalid JSON. Please try again or review manually.');
    }
    throw new Error('Failed to parse vendor response. Please review manually.');
  }
}

/**
 * Compare proposals and generate recommendations
 */
async function compareProposals(proposals) {
  const prompt = `You are an AI assistant that compares vendor proposals and provides recommendations.

Given multiple vendor proposals for the same RFP, analyze them and provide:
- summary: A brief summary comparing all proposals
- scores: Object with vendor names as keys and scores (0-100) as values
- recommendation: The recommended vendor name and detailed reasoning (2-3 sentences)
- strengths: Object with vendor names as keys and arrays of their strengths
- weaknesses: Object with vendor names as keys and arrays of their weaknesses

Proposals Data:
${JSON.stringify(proposals, null, 2)}

Return ONLY valid JSON with the structure above, no markdown formatting, no code blocks, no explanations, no text before or after the JSON. The response must be valid JSON that can be parsed directly.`;

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3-flash-preview',
      generationConfig: {
        temperature: 0.5,
        responseMimeType: 'application/json',
      }
    });

    const fullPrompt = `You are a helpful assistant that compares vendor proposals. You must return ONLY valid JSON with no additional text, markdown, or formatting. The response must start with { and end with }.\n\n${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    
    // Try multiple ways to get the text content
    let content = '';
    try {
      content = response.text();
    } catch (textError) {
      // Fallback: try to get text from candidates
      if (result.response && result.response.candidates && result.response.candidates[0]) {
        const candidate = result.response.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
          content = candidate.content.parts[0].text || '';
        }
      }
      if (!content) {
        throw new Error(`Unable to extract text from response: ${textError.message}`);
      }
    }
    
    if (!content || content.trim().length === 0) {
      throw new Error('Empty response received from AI');
    }
    
    const comparison = extractAndParseJSON(content);
    return comparison;
  } catch (error) {
    console.error('Error comparing proposals:', error);
    console.error('Error stack:', error.stack);
    // Provide more helpful error message
    if (error.message.includes('JSON') || error.message.includes('parse')) {
      throw new Error('Failed to parse AI response. The AI may have returned invalid JSON. Please try again or review proposals manually.');
    }
    throw new Error('Failed to generate comparison. Please review proposals manually.');
  }
}

module.exports = {
  createRFPFromText,
  parseVendorResponse,
  compareProposals,
};
