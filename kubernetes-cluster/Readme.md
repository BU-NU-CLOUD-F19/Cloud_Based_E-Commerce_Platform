# How to deploy the stack on GCP?

#### Install Google Cloud CLI

Once you have the CLI follow the steps as follow to deploy the stack on google cloud platform.

Login into gcloud account using the following command.
```
gcloud auth login
```
Create your project on GCP and set it as active project.
```
gcloud project create <project-id>

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
Make sure you have <strong>kubectl</strong> installed on your system. Also, While submitting a new image on GCP make sure you have to enable the google container image registry API.

Now simply replace the image name in `deployment.yaml` and run the following commands.
```
kubectl apply -f deployment.yaml

kubectl apply -f service.yaml
```

Once you have the image running get all clusters external ip for communication with each deployed microservice using the following command.
````
kubectl get svc
````
Use the external ip to verify if the cluster is up hit `http://<external-ip>/documentation` on browser. You should be able to see swagger documentation.

Update the service dependency ip in the respective .<microservice-name>rc's to establish communication.

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

Some important debugging commands.

````
kubectl get deployments

kubectl edit deployments

kubectl get pods
````

