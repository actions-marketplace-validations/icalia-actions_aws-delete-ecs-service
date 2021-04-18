# AWS Delete ECS Service

Deletes a specified service within a cluster

## Usage

```yaml
      - name: Delete AWS ECS Service
        uses: icalia-actions/aws-delete-ecs-service@v0.0.1
        with:
          name: my-service-name
          cluster: my-ecs-cluster
```
