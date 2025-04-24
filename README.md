# 📦 Product Stock Search API

**Product Stock Search** is a simple API for managing and searching Stock Keeping Unit (SKU) information. It allows users to search for specific products and retrieve a complete list of all registered items. This API is ideal for integration with inventory management systems, e-commerce platforms, or other logistics solutions.

### ⚠️ Disclaimer

This project is **not** intended to be a full-featured production API.  
It is a **simple demonstration** of how to structure a TypeScript-based Node.js API using:

- MongoDB for persistence  
- Jest for unit testing  
- Docker & Docker Compose for containerization  
- Kubernets

The goal is to showcase clean code organization, basic error handling, and how different technologies can work together in a small backend service.


---

## ✨ Features

- **🔍 Search Product** (`POST /productId`) — Search for a specific product and receive details about stock, orders, and refunds.
- **📋 List All Products** (`GET /productId/all`) — Returns a list of all registered products with their stock and transaction information.

---

## 🛠 Technologies

- Node.js  
- Express.js  
- MongoDB  
- Jest  
- Docker  
- Docker Compose
- Kubernetes

---

## 🚀 Getting Started

### ✅ Using Docker

1. **Clone the repository:**
   ```bash
   git clone https://github.com/luizcurti/api-product-search.git
   cd api-product-search
    ```

### ✅ Running with Docker Compose
2. **Build and start the application using Docker Compose:**
   ```bash
    docker-compose up --build
    ```

This will start the following services:

*MongoDB (for data persistence)
*Node.js application (your Product Stock Search API)
*A seed process to initialize the database

The application will be accessible at http://localhost:3000 and MongoDB will be accessible at localhost:27017.

### ✅ Deploying to Kubernetes
If you want to deploy the application to a Kubernetes cluster, follow the steps below:

1. **Ensure your Kubernetes cluster is up and running (you can use Minikube, Docker Desktop, or Kind).**
* For Minikube, use:
   ```bash
    minikube start
   ```
* For Kind, use:
   ```bash
    kind create cluster
   ```
* For Docker Desktop, make sure Kubernetes is enabled in the Docker Desktop settings.

2. **Apply the Deployment and Service YAML file to Kubernetes:**
Ensure your cluster is configured correctly (check the context with kubectl config current-context).
   ```bash
    kubectl apply -f deployment.yaml
   ```

This will:
* Create a Deployment with 10 replicas of the Node.js application.
* Create a Service of type LoadBalancer to expose your app.   

3. **Check if the pods are running correctly:**
   ```bash
    kubectl get pods
   ```

This will list the pods running for your application. You should see something like this:
   ```bash
    NAME                                  READY   STATUS    RESTARTS   AGE
    productidsearch-deployment-xxxxxxxx   1/1     Running   0          5m
    productidsearch-deployment-xxxxxxxx   1/1     Running   0          5m
   ```
4. **Access your application:**

* If you're using Minikube, run the following command to access your app:
   ```bash
   minikube service productidsearch-service
   ```
This will open a browser window with your app's endpoint.
* Alternatively, you can use kubectl port-forward to forward a port to your local machine:
   ```bash
   kubectl port-forward service/productidsearch-service 8080:80
   ```

### 📈 Load Testing
To run a simple load test using [k6](https://chatgpt.com/c/68096e72-5e60-8003-a7cd-a15f97824598#:~:text=load%20test%20using-,k6,-%3A).
  ```bash
   k6 run test/loadTest.js
   ```
