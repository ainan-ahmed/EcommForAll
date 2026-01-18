# AI Service Documentation

## Overview

The AI Service provides intelligent product description generation capabilities using Spring AI and Google Vertex AI's Gemini models.
This service helps e-commerce sellers create compelling, SEO-friendly product descriptions automatically.

## Features

- **Generate Product Descriptions**: Create new descriptions from scratch using product details
- **Improve Existing Descriptions**: Enhance existing product descriptions with AI
- **Auto-Populate Product Details**: Generate descriptions for existing products by providing productId
- **Multiple Tone Options**: Support for professional, casual, technical, and marketing tones
- **SEO Optimization**: Generate content optimized for search engines
- **Customizable Length**: Control the maximum word count for descriptions
- **Product Variant Support**: Handle multiple product variants in description generation
- **Brand and Category Integration**: Automatically include brand and category details

## Configuration

### 1. Environment Variables

Set your Google Cloud credentials as environment variables:

```bash
export GOOGLE_CLOUD_PROJECT_ID=ecommforall-ai
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/ecommforall-ai-key.json
export GOOGLE_CLOUD_LOCATION=europe-west4
```

### 2. Application Configuration

The service is configured in `application.yml`:

```yaml
spring:
    ai:
        vertex:
            ai:
                gemini:
                    project-id: ${GOOGLE_CLOUD_PROJECT_ID}
                    location: ${GOOGLE_CLOUD_LOCATION}
```

## API Endpoints

### 1. Generate Product Description

**POST** `/api/ai/generate-description`

Generate a new product description from provided details.

**Request Body:**

```json
{
    "productName": "Wireless Bluetooth Headphones",
    "category": "Electronics",
    "brand": "TechBrand",
    "existingDescription": "Optional existing description to improve",
    "attributes": {
        "Battery Life": "30 hours",
        "Connectivity": "Bluetooth 5.0",
        "Weight": "250g"
    },
    "hasVariants": true,
    "variants": [
        {
            "attributeValues": {
                "Color": "Black",
                "Style": "Over-ear"
            },
            "price": 99.99,
            "stock": 10
        },
        {
            "attributeValues": {
                "Color": "White",
                "Style": "On-ear"
            },
            "price": 89.99,
            "stock": 5
        }
    ],
    "targetAudience": "Music enthusiasts and professionals",
    "tone": "professional",
    "maxLength": 150
}
```

**Response:**

```json
{
    "generatedDescription": "Experience premium audio quality with these Wireless Bluetooth Headphones...",
    "originalDescription": "Optional existing description to improve",
    "tone": "professional",
    "wordCount": 142,
    "generatedAt": "2025-07-01T14:30:00",
    "success": true
}
```

### 2. Generate Description for Existing Product

**POST** `/api/ai/generate-description?productId={productId}`

Generate a description for an existing product using its stored details.

**Parameters:**

- `productId` (query): UUID of the product to auto-populate product details
- `tone` (request body, optional): Tone of description (default: "professional")
- `maxLength` (request body, optional): Maximum words (default: 150)

**Example:**

```bash
POST /api/ai/generate-description?productId=123e4567-e89b-12d3-a456-426614174000

{
  "tone": "marketing",
  "maxLength": 200
}
```

### 3. Improve Existing Description

**POST** `/api/ai/generate-description`

Enhance an existing product description by including the existingDescription field.

**Request Body:**

```json
{
    "productName": "Wireless Bluetooth Headphones",
    "existingDescription": "Basic headphones with good sound quality. Wireless connection.",
    "tone": "marketing",
    "maxLength": 150
}
```

**Response:**

```json
{
    "generatedDescription": "Experience premium audio quality with these Wireless Bluetooth Headphones...",
    "originalDescription": "Basic headphones with good sound quality. Wireless connection.",
    "tone": "marketing",
    "wordCount": 142,
    "generatedAt": "2025-07-01T14:30:00",
    "success": true
}
```

### 4. Health Check

**GET** `/api/ai/health`

Check if the AI service is operational.

**Response:**

```
AI Service is operational
```

## Available Tones

- **professional**: Formal, business-oriented language
- **casual**: Friendly, conversational tone
- **technical**: Detailed, specification-focused
- **marketing**: Persuasive, sales-oriented

## Security

All AI endpoints require authentication with `SELLER` or `ADMIN` roles:

- Users must be logged in
- Only sellers can generate descriptions for their products
- Admins have full access to all AI features

## Error Handling

The service provides comprehensive error handling:

**Success Response:**

```json
{
    "success": true,
    "generatedDescription": "...",
    "originalDescription": "...",
    "tone": "professional",
    "wordCount": 142,
    "generatedAt": "2025-07-01T14:30:00"
}
```

**Error Response:**

```json
{
    "success": false,
    "errorMessage": "Failed to generate product description: Unable to connect to Google Vertex AI",
    "generatedAt": "2025-07-01T14:30:00"
}
```

## Usage Examples

### Example 1: Generate Description for Electronics

```bash
curl -X POST "http://localhost:8080/api/ai/generate-description" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productName": "Gaming Mechanical Keyboard",
    "category": "Electronics",
    "brand": "GameTech",
    "attributes": {
      "Switch Type": "Blue Mechanical",
      "Backlighting": "RGB",
      "Layout": "Full-size with Numpad"
    },
    "tone": "technical",
    "maxLength": 200
  }'
```

### Example 2: Improve Existing Description

```bash
curl -X POST "http://localhost:8080/api/ai/generate-description" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "productName": "Gaming Mechanical Keyboard",
    "existingDescription": "Basic keyboard for gaming with lights",
    "tone": "marketing",
    "maxLength": 200
  }'
```

### Example 3: Generate for Existing Product

```bash
curl -X POST "http://localhost:8080/api/ai/generate-description?productId=123e4567-e89b-12d3-a456-426614174000" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "tone": "casual",
    "maxLength": 150
  }'
```

## Best Practices

1. **Provide Detailed Input**: The more details you provide, the better the generated description
2. **Include Product Variants**: For products with variants, include them for more comprehensive descriptions
3. **Choose Appropriate Tone**: Match the tone to your target audience
4. **Review Generated Content**: Always review AI-generated content before publishing
5. **Use Attributes Effectively**: Provide detailed attributes to highlight key features
6. **Set Reasonable Length**: Keep descriptions concise but informative (100-200 words)
7. **Specify Target Audience**: Include target audience information for more focused content

## Troubleshooting

### Common Issues

1. **"Invalid host or port"**: Check that GOOGLE_CLOUD_LOCATION is correctly set
2. **"Failed to generate content"**: Verify Google Cloud credentials are properly configured
3. **"PERMISSION_DENIED"**: Ensure service account has proper IAM permissions
4. **"JSON parse error"**: Check for malformed JSON in your request (e.g., trailing commas)
5. **"Access denied"**: Ensure user has SELLER or ADMIN role

### Environment Variables

```bash
# Required environment variables
export GOOGLE_CLOUD_PROJECT_ID=ecommforall-ai
export GOOGLE_APPLICATION_CREDENTIALS=./backend/ecommforall-ai-key.json
export GOOGLE_CLOUD_LOCATION=europe-west4
```

## Implementation Details

The AI service is built using:

- Spring AI Framework
- Google Vertex AI Gemini model
- Spring Security for endpoint protection
- Automatic product detail enhancement for better descriptions

## Future Enhancements

- Multi-language description generation
- Bulk description generation for multiple products
- A/B testing for different description styles
- Integration with product analytics for performance tracking
- SEO keyword suggestion based on generated content
- Customized AI models for specific product categories
