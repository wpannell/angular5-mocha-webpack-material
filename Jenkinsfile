#!groovy
import groovy.transform.Field

//default branch name
@Field branchName = 'master'

@Field jenkinsStage      // holds the current jenkins stage being run, set in each stage

// stage names
@Field dev = "dev"
@Field test = "test"
@Field ITDev = "Dev Integration Test"
@Field ITStage = "Stage Integration Test"
@Field staging = "stage"
@Field production = "prod"

@Field slackChannel = '#custhub_devops'

@Field artifactId
@Field version

@Field httpProxy = 'http://nonprod.inetgw.aa.com:9093'
@Field cfRootAppName = 'privacy-portal-ui-dpo'
@Field cfApiUrl = 'https://api.ng.bluemix.net'
@Field cfOrg = 'AA-CustTech-GDPR'
@Field cfAppDomain = 'mybluemix.net'

//constants for slack notifications
@Field success = "SUCCESS"
@Field failure = "FAILURE"


node('Builder') {
    currentBuild.result = 'SUCCESS'

    try {
        stage('Checkout') {
            jenkinsStage = 'Checkout'

            deleteDir()

            checkout scm

            // get branch name
            branchName = env.BRANCH_NAME
            echo "Current branch is ${branchName}"

            if (branchName == 'master')
                branchName = ''
            else
                branchName = '-' + branchName

            // replace spaces and underscores with '-' in branch name
            branchName = branchName.replaceAll(' ', '-')
            branchName = branchName.replaceAll('_', '-')
            echo 'build status = ' + currentBuild.result
        }

        stage('NPM Install') {
            jenkinsStage = 'Build'

            sh 'npm install'
        }

        stage('Unit Test') {
            sh 'npm run test'
        }

        stage('Publish Contract') {
            // sh 'npm run test:consumer'
            //TODO
            echo 'how to publish?'
        }

        stage('Build') {
            sh 'npm run lint'
            sh 'npm run build'
        }

        stage("Deploy: ${dev}") {
            jenkinsStage = dev

            sh 'cp src/static/nginx-dev.conf dist/nginx.conf'

            deploy(jenkinsStage)
            echo "build status = " + currentBuild.result
        }

        stage("Deploy: ${test}") {
            jenkinsStage = test

            sh 'cp src/static/nginx-test.conf dist/nginx.conf'

            deploy(jenkinsStage)
            sendNotification(slackChannel, jenkinsStage, success, "#00FF00")
            echo "build status = " + currentBuild.result
        }

        stage('Stage Promotion') {
                timeout(time: 5, unit: 'MINUTES') {
                    input 'Deploy to Stage?'
                }
            }

         stage("Deploy: ${staging}") {
            jenkinsStage = staging

            sh 'cp src/static/nginx-stage.conf dist/nginx.conf'

            deploy(jenkinsStage)
            sendNotification(slackChannel, jenkinsStage, success, "#00FF00")
            echo "build status = " + currentBuild.result
        }

        stage('Prod Promotion') {
                timeout(time: 5, unit: 'MINUTES') {
                    input 'Deploy to Prod?'
                }
            }

        stage("Deploy: ${production}") {
            jenkinsStage = production

            sh 'cp src/static/nginx-prod.conf dist/nginx.conf'

            deploy(jenkinsStage)
            sendNotification(slackChannel, jenkinsStage, success, "#00FF00")
            echo "build status = " + currentBuild.result
        }

    } catch (err) {
        sendNotification(slackChannel, jenkinsStage, failure + ' - ' + err, '#FF0000')
        currentBuild.result = 'FAILURE'
        throw err
    }
}

def deploy(jenkinsStage) {

    echo "Deploying version ${version}"

    // deploy arguments
    cfSpace = "${jenkinsStage}"
    cfAppName = "${cfRootAppName}"

    if (jenkinsStage != 'prod') {
        cfAppName = cfAppName + "-${jenkinsStage}"
    }

    cfManifestPath = "./devops/ibm-cloud/manifest.yml"
    cfKeepRollback = 0

    // get IBM Cloud API credentials from Jenkins "Credentials" store
    withCredentials([
        string(credentialsId: 'IBMCLOUD_API_KEY', variable: 'CF_API_KEY'),
        string(credentialsId: 'NEW_RELIC_LICENSE_KEY', variable: 'NEW_RELIC_LICENSE_KEY')]) {

        // make CF deploy script executable
        sh 'chmod u+x ./devops/ibm-cloud/deploy.sh'

        sh "./devops/ibm-cloud/deploy.sh \"${cfApiUrl}\" \"${CF_API_KEY}\" \"${cfOrg}\" \"${cfSpace}\" \"${cfAppDomain}\" \"${cfAppName}\" \"${cfManifestPath}\" \"${NEW_RELIC_LICENSE_KEY}\" \"${cfKeepRollback}\" \"${httpProxy}\""
    }

    def subject = "${currentBuild.result}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"
    def summary = "${subject} (<${env.BUILD_URL}|Open>)\n\n(<https://${cfAppName}.${cfAppDomain}/health|Health Check>)"
    //slackSend channel: slackChannel, message: summary, color: '#00FF00', token: "${SLACK_TOKEN}", baseUrl: "${slackHook}"
    sendNotification(slackChannel, jenkinsStage, success, "#00FF00")
}

//sends communication on slack
def sendNotification(slackChannel, String stage, String status, slackColor) {
    def message = "Phase [" + stage + "] - " + status
    def subject = "Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'" + message
    def summary = "${subject} (${env.BUILD_URL}consoleFull)\n"
    def details = """<p>Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' - $stage - $status</p>
      <p>Check console output at &QUOT;<a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a>&QUOT;</p>"""
    def baseUrl = 'https://americanairlines.slack.com/services/hooks/jenkins-ci/'
    //send status message to slack
    withCredentials([
        string(credentialsId: 'SLACK_TOKEN', variable: 'SLACK_TOKEN')]) {

        slackSend channel: slackChannel, message: summary, color: slackColor, token: "${SLACK_TOKEN}", baseUrl: baseUrl
    }
}
