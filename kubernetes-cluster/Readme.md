# How to deploy the stack on GCP?

> <strong>*NOTE:*</strong> If you haven't already please setup [GCP account](https://cloud.google.com/). You'll use this 'gloud' login for this deployment.

#### Install Google Cloud CLI

Once you have the CLI follow the steps as follow to deploy the stack on google cloud platform.

Login into gcloud account using the following command.
```
gcloud auth login
```
Create your project on GCP and set it as active project.
```
gcloud projects create <project-id>

gcloud config set project <project-id>

```
Create cluster in the active GCP project directory.
````
gcloud container clusters create <project-id>    --num-nodes 1    --enable-basic-auth    --issue-client-certificate    --zone us-east1
````
### How to build and push any microservice image on GCP

`cd` into the respective microservice directory and submit the image to google container registry. 

````
gcloud builds submit --tag gcr.io/<project-id>/<image-name>:<version-number> .
````
Make sure you have <strong>kubectl</strong> installed on your system.
Also, make sure you have `Google Container Registry API` enabled. Refer: https://semaphoreci.com/docs/docker/continuous-delivery-google-container-registry.html

> <strong>__NOTE__</strong>: `deployment.yaml` and `service.yaml` file in each microservice folder were originally meant to be a very basic deployment configuration. This should be replaced by a single `deployment.yaml` and `service.yaml` config for all microservices in future.

Next, replace the image name in `deployment.yaml` and run the following commands.
```
kubectl apply -f deployment.yaml

kubectl apply -f service.yaml
```

Once you have the image running get all clusters external ip for communication with each deployed microservice using the following command.
````
kubectl get svc
````
Health Check: 
````
1. Hit `http://<external-ip>/documentation` on browser. 
2. You should be able to see swagger documentation.
````

Update the service dependency ip in the respective `.<microservice-name>rc` files to establish communication.

Example: `.inventory-managementrc` file and replace the connection details
````
example:

"connection": {
        "host": "35.196.186.41", // This is the external ip of the postgres microservice cluster
        "user": "postgres",
        "database": "postgres",
        "port": 80 // Exposed public port
      },
````
To upgrade/downgrade cluster on the go (with zero-downtime):
1. Run `kubectl edit deployments`
2. Update the image version for the target cluster
3. Save and close the file.
4. Run `kubectl get pods` and you'll see the pods updating one after another.


Some helpful debugging commands.

````
kubectl get deployments

kubectl edit deployments

kubectl get pods
````

## References:

1. https://kubernetes.io/docs/tasks/tools/install-kubectl/

2. https://cloud.google.com/sdk/docs/quickstarts



