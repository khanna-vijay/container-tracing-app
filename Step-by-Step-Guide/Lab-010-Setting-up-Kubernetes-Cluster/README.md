# Lab # 1 : Installing the Kubernetes Cluster
We will be using AWS EKS for this demo. Login with an Administrator equivalent user to AWS console.

### Deploy Cloud9 IDE:
This lab documentation is made for N.Virginia region (us-east-1). Please make note of this, and change accordingly for your deployment.
Login to the AWS EC2 Console, go to Cloud9 Services. <br/>
Create a **new environment** e.g. "Tracing Containerized Nodejs application" <br/>
>#Select Environment type : "Create a new instance for environment (EC2)<br/>
>#Instance type : t2.micro (1 GiB RAM + 1 vCPU)  <br/>
>#Platform : Amazon Linux <br/>
>#Cost-saving setting: after 30 minutes <br/>
>#Network settings : Select an existing vpc and subnet, or create a new one . Select a Public Subnet, connected to Internet Gateway for Preview-URL Testing <br/>
>#Review, click Create <br/>

* **IAM AdministratorAccess Role for Cloud9 Instance :**
>#Go to IAM Service, create a role <br/>
>#Type of trusted entity : **AWS Service** <br/>
>#Choose the service that will use this role : **EC2**, 'Click Next:permissions' <br/>
>#Select from existing policies: **AdministratorAccess**, 'Next:Tags'  <br/>
>#Add-tags (optional) <br/>
>#Role Name: **Admin-Role_for_Cloud9_Instance** <br/>
>#Open EC2 Service console, select the Cloud9 Instance <br/>
>#Actions => Instance Settings => Attach/Replace IAM Role => Select **Admin-Role_for_Cloud9_Instance** => Apply<br/>

>#**In Cloud9 console => Preferences(Gear Icon on Upper Right Corner) => AWS Settings => Disable "AWS Managed Temporary Credentials. Slide the Grey button to cover Green area. Green area should not be visible** :relaxed:  <br/>


* **Capture Cluster Unique Name. This Name will be used to create a ssh key pair as well:**
```
read -p "Enter a unique EKS cluster Name : " EKS_CLUSTER_NAME ; echo "EKS Cluster Name to be used is "$EKS_CLUSTER_NAME
```
Saving the Cluster Name to bash-profile. In case the Cloud9 Instance Reboots, these variables will be saved and exported automatically
```
echo "export EKS_CLUSTER_NAME=${EKS_CLUSTER_NAME}" >> ~/.bash_profile
```


* **Install kubectl and ancilliary tools:**
Inside the cloud9 console, 
```
sudo curl --silent --location -o /usr/local/bin/kubectl https://storage.googleapis.com/kubernetes-release/release/v1.13.7/bin/linux/amd64/kubectl

sudo chmod +x /usr/local/bin/kubectl

sudo yum -y install jq gettext

```
Verify the binaries are in path. you should see the three "in path"
</br>
>kubectl in path</br>
>jq in path</br>
>envsubst in path</br>
```
for command in kubectl jq envsubst
  do
    which $command &>/dev/null && echo "$command in path" || echo "$command NOT FOUND"
  done

```
Remove temporary credendials, and setup environment variables.

```
rm -vf ${HOME}/.aws/credentials

export ACCOUNT_ID=$(aws sts get-caller-identity --output text --query Account)
export AWS_REGION=$(curl -s 169.254.169.254/latest/dynamic/instance-identity/document | jq -r '.region')

echo "export ACCOUNT_ID=${ACCOUNT_ID}" >> ~/.bash_profile
echo "export AWS_REGION=${AWS_REGION}" >> ~/.bash_profile
aws configure set default.region ${AWS_REGION}
aws configure get default.region

EKS_WORKER_NODE_KEY=${EKS_CLUSTER_NAME}_WORKER_NODE_KEY
echo $EKS_WORKER_NODE_KEY
echo "export EKS_WORKER_NODE_KEY=${EKS_WORKER_NODE_KEY}" >> ~/.bash_profile
cat ~/.bash_profile

```
Validate the IAM role. the Output Arn should contain the IAM role created and attached to instance, and the Instance ID
e.g.  "Arn": "arn:aws:sts::1122334455:assumed-role/Admin-Role_for_Cloud9_Instance/i-0abcd1122334455<br/>
```
aws sts get-caller-identity
```

* **Generating ssh key to login to the kubernetes worker node:**
</br>

**Press enter three times to accept defaults. In case you are using existing key, you can choose to overwrite the same name**
</br>
```
ssh-keygen
```
Delete old-key-pair in case if existing with same name. The Delete Command is optional. You can use your own keypair name. 
This keypair can be used to ssh to the Worker Nodes.
```
echo "The Key Name to be created is "$EKS_WORKER_NODE_KEY

aws ec2 delete-key-pair --key-name $EKS_WORKER_NODE_KEY        // Take care while using this command, as it will delete the old keypair
aws ec2 import-key-pair --key-name $EKS_WORKER_NODE_KEY --public-key-material file://~/.ssh/id_rsa.pub
```


* **Download eksctl and deploy EKS Cluster:**
```
curl --silent --location "https://github.com/weaveworks/eksctl/releases/download/latest_release/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp

sudo mv -v /tmp/eksctl /usr/local/bin
```
Confirm the eksctl command works:  You should get output similar to below </br>
version.Info{BuiltAt:"", GitCommit:"", GitTag:"0.3.1"}</br>
```
eksctl version
```
Modify the parameters if required to change the Region, Zone, Worker Node Instance Type, Max/Min Nodes, Public key to ssh to Nodes.
</br>

**Deploying the EKS Cluster**
This will take about 10 minutes. 
```
eksctl create cluster --version=1.13 --name=$EKS_CLUSTER_NAME --nodes=2 --node-ami=auto --region=${AWS_REGION} --zones=${AWS_REGION}a,${AWS_REGION}b  --ssh-public-key $EKS_WORKER_NODE_KEY --nodes-min 2 --nodes-max 3 --node-type m5.large --node-volume-size 50
```

* **Test the cluster:**
```
kubectl get nodes
```
Export the Worker Role Name for use throughout
```
STACK_NAME=$(eksctl get nodegroup --cluster nodejs-istio-cluster -o json | jq -r '.[].StackName')
INSTANCE_PROFILE_ARN=$(aws cloudformation describe-stacks --stack-name $STACK_NAME | jq -r '.Stacks[].Outputs[] | select(.OutputKey=="InstanceProfileARN") | .OutputValue')
ROLE_NAME=$(aws cloudformation describe-stacks --stack-name $STACK_NAME | jq -r '.Stacks[].Outputs[] | select(.OutputKey=="InstanceRoleARN") | .OutputValue' | cut -f2 -d/)
echo "export ROLE_NAME=${ROLE_NAME}" >> ~/.bash_profile
echo "export INSTANCE_PROFILE_ARN=${INSTANCE_PROFILE_ARN}" >> ~/.bash_profile
```

