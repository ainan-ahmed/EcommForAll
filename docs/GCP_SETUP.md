# Google Cloud Setup Guide

This guide provides detailed instructions for setting up Google Vertex AI for the EcommForAll project.

## Prerequisites

-   A Google Cloud Project
-   [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) installed and configured

## Setup Steps

### 1. Authenticate and Set Project

```bash
# Login to your Google account
gcloud auth login

# Set your project ID
gcloud config set project YOUR_PROJECT_ID
```

### 2. Enable Required APIs

```bash
# Enable Vertex AI and Compute Engine APIs
gcloud services enable aiplatform.googleapis.com
gcloud services enable compute.googleapis.com
```

### 3. Create Service Account and Key

```bash
# Create a service account for the application
gcloud iam service-accounts create ecommforall-ai

# Assign Vertex AI User role to the service account
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:ecommforall-ai@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

# Generate and download the JSON key file
gcloud iam service-accounts keys create ecommforall-ai-key.json \
    --iam-account=ecommforall-ai@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### 4. Configure Environment

Place the generated `ecommforall-ai-key.json` in the `backend/` directory and set the following environment variables:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="./ecommforall-ai-key.json"
export GCLOUD_PROJECT="your-project-id"
```

## Troubleshooting

-   Ensure the `VERTEX_AI_LOCATION` in your environment (default `europe-west1`) matches the region where you want to run the services.
-   Verify the service account has sufficient permissions if you encounter 403 errors.
