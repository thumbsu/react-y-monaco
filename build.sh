#!/bin/bash

AWSCLI=aws
JQCLI=jq
DOCKERCLI="docker"

SCRIPTNAME=$(basename $0)

PUSH_FLAG=false
VERSION=
VERSION_BASE=
VERSION_POSTFIX=

SCRIPTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
PROJECT_ROOT=$SCRIPT_DIR
echo $PROJECT_ROOT
cd "${PROJECT_ROOT}"

IMAGE_NAME='glob/poc-collab-editor'
IMAGE_TAG="latest"
AWS_REGION="ap-northeast-2"
AWS_PROFILE="brgg-dev"

help() {
    echo "${SCRIPTNAME} [OPTIONS]"
            echo "Build Docker image."
            echo "-h           This help screen."
            echo "-p / --push  Push image to ECR."
            echo "--postfix    Set VERSION Postfix."
            echo "--version    Set VERSION"
            exit 0
}

########################## long 옵션 처리 부분 #############################

SHORT_ARGS=""
while true; do
    [ $# -eq 0 ] && break
    case $1 in
        --version) 
            shift
            case $1 in (-*|"") err_msg_l; usage; esac
	    VERSION_BASE=$1
            shift; continue
            ;;
        --postfix) 
            shift
            case $1 in (-*|"") err_msg_l; usage; esac
	    VERSION_POSTFIX=$1
            shift; continue
            ;;
        --push) 
	    PUSH_FLAG=true
            shift; continue
            ;;
        --)
            IFS=$(echo -e "\a")
            SHORT_ARGS=$SHORT_ARGS$([ -n "$SHORT_ARGS" ] && echo -e "\a")$*
            break
            ;;
        --*) 
            err_msg "Invalid option: $1"
            usage;
            ;;
    esac

    SHORT_ARGS=$SHORT_ARGS$([ -n "$SHORT_ARGS" ] && echo -e "\a")$1
    shift
done

IFS=$(echo -e "\a"); set -f; set -- $SHORT_ARGS; set +f; IFS=$(echo -e " \n\t")

########################## short 옵션 처리 부분 #############################

while getopts "p" opt; do
    case $opt in
        p)
	    PUSH_FLAG=true
            ;;
        :)
            ;;
        \?)
            err_msg "Invalid option: -$OPTARG"
            usage
            ;;
    esac
done

shift $(( OPTIND - 1 ))

########################## short ######################################

set -e
command -v ${JQCLI} >/dev/null 2>&1 || { echo >&2 "I require jq but it's not installed. Please run 'brew install jq'."; exit 1; }
command -v ${AWSCLI} >/dev/null 2>&1 || { echo >&2 "I require aws but it's not installed. Please run 'pip install --user --upgrade awscli'."; exit 1; }
command -v ${DOCKERCLI} >/dev/null 2>&1 || { echo >&2 "I require docker but it's not installed. Please download 'https://download.docker.com/mac/stable/Docker.dmg'."; exit 1; }

if [[ -z "${VERSION_BASE}" ]]; then
    VERSION_BASE=$($JQCLI -r .version package.json)
fi 

if [[ ! -z "${VERSION_POSTFIX}" ]]; then
    VERSION="${VERSION_BASE}-${VERSION_POSTFIX}"
else
    VERSION="${VERSION_BASE}"
fi

AWS_ACCOUNT_ID=$(${AWSCLI} sts get-caller-identity --profile $AWS_PROFILE | ${JQCLI} -r .Account)

echo IMAGE_NAME=$IMAGE_NAME
echo VERSION=$VERSION

${DOCKERCLI} build -t ${IMAGE_NAME} . -f ./contrib/docker/Dockerfile
${DOCKERCLI} tag "${IMAGE_NAME}:${IMAGE_TAG}" "${IMAGE_NAME}:${VERSION}"

set +e
aws ecr describe-repositories --repository-names $IMAGE_NAME --profile $AWS_PROFILE 2>&1 > /dev/null
STATUS=$?
if [[ ! "${STATUS}" -eq 0 ]]; then
aws ecr create-repository --repository-name $IMAGE_NAME --profile $AWS_PROFILE 
fi
set -e

REPO_URI=$(${AWSCLI} ecr describe-repositories --profile $AWS_PROFILE | ${JQCLI} -r ".repositories[] | select(.repositoryName | contains(\"$IMAGE_NAME\")) | .repositoryUri")
${DOCKERCLI} tag "${IMAGE_NAME}:${IMAGE_TAG}" "${REPO_URI}:${IMAGE_TAG}"
${DOCKERCLI} tag "${IMAGE_NAME}:${IMAGE_TAG}" "${REPO_URI}:${VERSION}"

echo '---------------------------------------'
echo "${IMAGE_NAME}:${IMAGE_TAG}"
echo "${IMAGE_NAME}:${VERSION}"
echo "${REPO_URI}:${IMAGE_TAG}"
echo "${REPO_URI}:${VERSION}"
echo '---------------------------------------'

if [[ $PUSH_FLAG == 'true' ]]; then
    aws ecr get-login-password --region $AWS_REGION --profile $AWS_PROFILE | \
        docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

    ${DOCKERCLI} push "${REPO_URI}:${IMAGE_TAG}"
    ${DOCKERCLI} push "${REPO_URI}:${VERSION}"
fi

