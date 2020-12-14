# Edison-TS

## Purpose of this document.
## Technical overview.
Edison-TS is deployed on Kubernetes through a Rancher server. All the technologies involved are open-source.

## Architecture of the app.

## Rancher setup.
### Installing nfs-client-provisioner.
`nfs-client-provisioner`can be installed through the following command:

`$ helm install --name nfs-client --set nfs.server=x.x.x.x --set nfs.path=/exported/path stable/nfs-client-provisioner`

## Deployment
### Pre-container build.
To correctly build frontend you must change the environment configurations contained in the `environment.*.ts` in the Angular frontend project.
To correctly build node-red you must change the Hasura endpoint in the `flows.json` file in the node-red folder.

### Deploymen on Kubernetes.
Deploy first the Persistent Volume Claims:
`kubectl apply -f postgres-pvc.yaml`
`kubectl apply -f node-red-pvc.yaml`

Verify with `kubectl get pvc --namespace=edison-ts`

Then deploy the components:
`kubectl apply -f postgres-deployment.yaml`
`kubectl apply -f hasura-deployment.yaml`
`kubectl apply -f node-red-deployment.yaml`

Components deploy also include services.
You can verify both with `kubectl get pod --namespace=edison-ts` and `kubectl get svc --namespace=edison-ts`

## Docker-compose setup.
### Building required images.
Build the images for nodered and frontend services with these commands. These images will have to be stored on your internal Docker registry. Change `docker_repository` according to your environment.
To build node-red:
```
cd /node-red
docker build -t docker_repository/edison-node-red .
```
To build frontend:
```
cd /frontend
docker build -t docker_repository/edison-fe .
```

### Launching the stack.
Launch the stack with from the root of the project with
`docker-compose up -d`