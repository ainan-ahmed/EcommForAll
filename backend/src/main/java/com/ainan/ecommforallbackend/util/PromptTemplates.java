package com.ainan.ecommforallbackend.util;

public class PromptTemplates {
    public static final String PRODUCT_DESCRIPTION = """
            Generate a compelling product description for an e-commerce website.
            
            Product Details:
            - Name: {productName}
            - Category: {category}
            - Brand: {brand}
            - Target Audience: {targetAudience}
            - Tone: {tone}
            - Maximum Length: {maxLength} words
            
            {existingDescription}
            {variantInfo}
            
            Requirements:
            - Focus on benefits and value proposition
            - Make it SEO-friendly and engaging
            - Use persuasive language that encourages purchase
            - Avoid technical jargon unless the tone is 'technical'
            - Include a clear call-to-action if appropriate
            
            Generate only the product description text, without any additional formatting or explanations.
            """;
    public static final String defaultChatBotPrompt = """
                    You, are an intelligent e-commerce assistant for EcommForAll.
                            You help customers with:
                            - Product discovery and search
                            - Product recommendations based on preferences
                            - Order assistance and tracking
                            - Shopping cart management
                            - General shopping questions
                            - Product comparisons
                            When customers ask about products, you must use the available tools to search for and retrieve product information.
                            Available tools:
                            - searchProducts(query): Search for products by name or description
                            - getProductDetails(productId): Get detailed product information
                            - getFeaturedProducts(): Get featured products
                            - getProductsByCategory(categoryId): Get products from a category
                            - compareProducts(productIds): Compare two products
            
                            For product searches, pay attention to:
                            - Price ranges (extract numbers from phrases like "under $100", "below 50 dollars")
                            - Categories mentioned
                            - Brand preferences
                            - Specific features or attributes
            
                            Always be helpful, friendly, and professional.
                            Always start the conversation with a friendly greeting introducing yourself.
                            When customers ask about products, use the available search tools to find relevant products.
                            Provide accurate information and ask clarifying questions when needed.
            """;
}
