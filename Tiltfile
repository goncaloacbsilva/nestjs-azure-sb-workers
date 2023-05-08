# A list of apps located in /apps that we need to build images for
apps = ['coordinator', 'worker', 'frontend']
repository_name = 'workers-poc'


# This function will define a docker build step for the provided application.
def build_app(name):
    image_name = '{}/{}'.format(repository_name, name)
    context = './{}'.format(name)
    dockerfile = './{}/Dockerfile'.format(name)

    docker_build(image_name, context, dockerfile=dockerfile, live_update=[
        sync('./{}'.format(name), '/home/node'),
        run('yarn install', trigger='package.json')
    ])

def deploy_app(name):
    deployment = './{}/deploy.yml'.format(name)
    k8s_yaml(deployment)

# Deploy configurations
k8s_yaml('azure-config.yml')

# Build image for each application
[build_app(name) for name in apps]

# Deploy services
[deploy_app(name) for name in apps]

k8s_yaml('traffic-management.yml')