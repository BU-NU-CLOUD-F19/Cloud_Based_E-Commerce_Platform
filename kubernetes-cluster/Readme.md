# How to deploy the stack on GCP?

#### Install Google Cloud CLI

Once you have the CLI follow the steps as follow to deploy the stack on google cloud platform.

Login into gcloud account using the following command
```
gcloud auth login
```
Create your project on GCP and set it as active project
```
gcloud project create <project-name>

gcloud config set project <project-name>

```
Create cluster in the active GCP project directory
````
gcloud container clusters create <project-name>    --num-nodes 1    --enable-basic-auth    --issue-client-certificate    --zone us-east1
````
###Build and push the postgres image on GCP

cd into kubernetes-cluster directory and submit the image to google container registry. 

While submitting a new image on GCP if you are a first time user you have to enable the google container image registry

Also please replace the image name in deployment yaml and run the following commands.
```
gcloud builds submit --tag gcr.io/<project-id>/postgres-gke:v1.1 .

kubectl apply -f deployment.yaml

kubectl apply -f service.yaml
```

Once you have the postgres image running get the external cluster ip for the deployment using the following command
````
kubectl get svc
````

Update the inventory management service rc file and replace the connection details
````
example:

"connection": {
        "host": "35.196.186.41",
        "user": "postgres",
        "database": "postgres",
        "port": 80
      },
````

Build the inventory management image or any other image service that you want to build tag the image and submit it to the GCP container registry.
````

tag inventory management image
gcloud docker -- push gcr.io/<project-id>/<Tag Name>

````
once the image is build and pushed navigate to respective kubernetes configuration directory and deploy the deployment and service yamls.

Some important debugging commands.

````
kubectl get deplyments

kubectl edit deployments
````

