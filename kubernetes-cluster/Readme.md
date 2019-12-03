# How to deploy the stack on GCP?

### Install Google Cloud CLI

Once you have the CLI follow the steps as follow to deploy the stack on google cloud platform.

```
gcloud auth login

gcloud project create cloud-ecommerce

gcloud config set project cloud-ecommerce

gcloud container clusters create cloud-ecommerce    --num-nodes 1    --enable-basic-auth    --issue-client-certificate    --zone us-east1

gcloud builds submit --tag gcr.io/cloud-ecommerce/postgres-gke:v1.1 .

```



