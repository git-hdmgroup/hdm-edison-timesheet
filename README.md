# Edison-TS

## Purpose of this document.
## Technical overview.
Edison-TS is deployed on Kubernetes through a Rancher server. All the technologies involved are open-source.

## Architecture of the app.

## Rancher setup.
### Rancher installation.
### Adding clusters and nodes.
### Installing nfs-client-provisioner.
`nfs-client-provisioner`can be installed through the following command:

`$ helm install --name nfs-client --set nfs.server=x.x.x.x --set nfs.path=/exported/path stable/nfs-client-provisioner`

## Deployment
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