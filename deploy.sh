#/bin/bash
#upload files
aws s3 cp ./dist s3://web-app-user --recursive --acl public-read