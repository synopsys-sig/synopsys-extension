# Synopsys Security Scan for Azure DevOps

Synopsys Security Scan Extension for Azure DevOps enables you to configure your Azure pipeline to run Synopsys security testing and take action on the results. 
Synopsys Security Scan leverages Synopsys Bridge, allowing you to run tests for several Synopsys products from the command line.

# Quick Start for the Synopsys Security Scan

Synopsys Security Scan supports Azure integration with the following Synopsys security testing solutions:
- **Polaris**, a SaaS-based solution offering SAST, SCA and Managed Services in a single unified platform
- **Coverity**, using our thin client and cloud-based deployment model
- **Black Duck Hub**, supporting either on-premises or hosted instances

**Note**: Synopsys Security Scan requires appropriate licenses for all Synopsys application used.

**To run Synopsys Security Scan:**

- Validate Scanning platform-related parameters like `project` and `stream`.
- Run corresponding Synopsys security testing solutions (Polaris, Coverity, or Black Duck).

Synopsys solution functionality is invoked directly by Synopsys Bridge, and indirectly by the Synopsys Security Scan, which downloads Synopsys Bridge and calls the respective adapters to run corresponding scans.

# Prerequisites

Before configuring Synopsys Action into your azure pipeline, note the following prerequisites:

- **AZURE_TOKEN** is required as input when running Black Duck Fix PR, Black Duck/Coverity PR Comment. There 2 different types of tokens that can be passed to **AZURE_TOKEN**
  1. When using `AZURE_TOKEN: $(System.AccessToken)`, you must enable this in the Azure interface. Go to **Project --> Project Settings --> Repository –-> Security –-> Build Service** and set **Contribute to pull requests** to **Allow**
  2. When using `AZURE_TOKEN: $(PAT_TOKEN)`, PAT token should have minimum permissions `Code - Full` and `Pull Request Threads - Read & write`. Refer [Use personal access tokens](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=Windows) for more details.  
- Sensitive data such as access tokens, user names, passwords and even URLs must be configured using variable groups **(ADO → Project → Pipelines → Library → New Variable Group)**
- Enable Build validation policy to trigger the pipeline on raising PR or any push event to existing branch (usually it will be done on main or master branch). Refer [Build Validation](https://learn.microsoft.com/en-us/azure/devops/repos/git/branch-policies?view=azure-devops&tabs=browser#build-validation) for more details.

## Synopsys Security Scan - Polaris

Synopsys Security Scan Extension found in the Azure DevOps Marketplace is the recommended solution for integrating Polaris into an ADO pipeline.

Before running a pipeline using the Synopsys Security Scan and Polaris, add `azure-pipelines.yml` to your project and configure required fields. Push those changes and agent will pick up the job and initiate the pipeline.

Here's an example piepline for Polaris scan using the Synopsys Synopsys Security Scan:

```yaml
trigger:
- main

pool:
  vmImage: ubuntu-latest

variables:
  - group: polaris
  
steps:
- task: SynopsysSecurityScan@1.0.0
  displayName: 'Polaris Scan'
  inputs:
    BRIDGE_POLARIS_SERVERURL: $(POLARIS_SERVER_URL)
    BRIDGE_POLARIS_ACCESSTOKEN: $(POLARIS_ACCESS_TOKEN)
    BRIDGE_POLARIS_APPLICATION_NAME: $(POLARIS_APPLICATION_NAME)
    BRIDGE_POLARIS_PROJECT_NAME: $(POLARIS_PROJECT_NAME)
    ### Accepts Multiple Values
    BRIDGE_POLARIS_ASSESSMENT_TYPES: "SCA,SAST"
    ### Uncomment below configuration if Synopsys Bridge diagnostic files needs to be uploaded
    # INCLUDE_DIAGNOSTICS: true
```

**Please find the following mandatory and optional paramters for Polaris below:**

| Input Parameter            | Description                                                       | Mandatory / Optional | 
|----------------------------|-------------------------------------------------------------------|--------------------|
| `BRIDGE_POLARIS_SERVERURL`        | URL for Polaris Server                                            | Mandatory          |
| `BRIDGE_POLARIS_ACCESSTOKEN`      | Access token for Polaris                                          | Mandatory          |
| `BRIDGE_POLARIS_APPLICATION_NAME` | Application name in Polaris                                       | Mandatory          |
| `BRIDGE_POLARIS_PROJECT_NAME`     | Project name in Polaris                                           | Mandatory          |
| `BRIDGE_POLARIS_ASSESSMENT_TYPES` | Polaris assessment types. Example: SCA,SAST                       | Mandatory          |

# Synopsys Security Scan - Coverity Cloud Deployment with Thin Client

At this time, Synopsys Security Scan only supports the Coverity thin client/cloud deployment model, which removes the need for a large footprint installation in your agent.

Before running Coverity using the Synopsys Security Scan, ensure the appropriate `project` and `stream` are set in your Coverity Connect server environment.

Configure sensitive data like usernames, passwords and URLs using pipeline variables.

```yaml
trigger:
- main

pool:
  vmImage: ubuntu-latest

variables:
  - group: coverity
  
steps:
- task: SynopsysSecurityScan@1.0.0
  displayName: 'Coverity Full Scan'
  condition: not(eq(variables['Build.Reason'], 'PullRequest'))
  inputs:
    BRIDGE_COVERITY_CONNECT_URL: $(COVERITY_URL)
    BRIDGE_COVERITY_CONNECT_USER_NAME: $(COVERITY_USER)
    BRIDGE_COVERITY_CONNECT_USER_PASSWORD: $(COVERITY_PASSPHRASE)
    BRIDGE_COVERITY_CONNECT_PROJECT_NAME: '$(Build.Repository.Name)'
    BRIDGE_COVERITY_CONNECT_STREAM_NAME: '$(Build.Repository.Name)-$(Build.SourceBranchName)'
    ### Uncomment below configuration if Synopsys Bridge diagnostic files needs to be uploaded
    # include_diagnostics: true

- task: SynopsysSecurityScan@1.0.0
  displayName: 'Coverity PR Scan'
  condition: eq(variables['Build.Reason'], 'PullRequest')
  inputs:
    BRIDGE_COVERITY_CONNECT_URL: $(COVERITY_URL)
    BRIDGE_COVERITY_CONNECT_USER_NAME: $(COVERITY_USER)
    BRIDGE_COVERITY_CONNECT_USER_PASSWORD: $(COVERITY_PASSPHRASE)
    BRIDGE_COVERITY_CONNECT_PROJECT_NAME: '$(Build.Repository.Name)'
    BRIDGE_COVERITY_CONNECT_STREAM_NAME: '$(Build.Repository.Name)-$(Build.SourceBranchName)'
    ### Below configuration is used to enable feedback from Coverity security testing as pull request comment
    coverity_automation_prcomment: true
    AZURE_TOKEN: $(System.AccessToken) # Mandatory when blackduck_automation_fixpr is set to 'true'
    ### Uncomment below configuration if Synopsys Bridge diagnostic files needs to be uploaded
    # include_diagnostics: true
```

**Please find the following mandatory and optional paramters for Coverity below:**

| Input Parameter   | Description                                                                                                                                                                                                                                                                                   | Mandatory / Optional |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| `BRIDGE_COVERITY_CONNECT_URL` | URL for Coverity server                                                                                                                                                                                                                                                                       | Mandatory     |
| `BRIDGE_COVERITY_CONNECT_USER_NAME`        | Username for Coverity                                                                                                                                                                                                                                                                         | Mandatory     |
| `BRIDGE_COVERITY_CONNECT_USER_PASSWORD`        | Password for Coverity                                                                                                                                                                                                                                                                         | Mandatory     |
| `BRIDGE_COVERITY_CONNECT_PROJECT_NAME`        | Project name in Coverity                                                                                                                                                                                                                                                                      | Mandatory     |
| `BRIDGE_COVERITY_CONNECT_STREAM_NAME`        | Stream name in Coverity                                                                                                                                                                                                                                                                       | Mandatory     |
| `BRIDGE_COVERITY_INSTALL_DIRECTORY`        | Directory path to install Coverity                                                                                                                                                                                                                                                            | Optional    |
| `BRIDGE_COVERITY_CONNECT_POLICY_VIEW`        | The policy view  of Coverity. <br/> Name/ID number of a saved view to apply as a “break the build” policy. <br/> If any defects are found within this view when applied to the project, the build will be broken with an exit code. <br/> Example: bridge_coverity_connect_policy_view: 100001 | Optional    |
| `BRIDGE_COVERITY_AUTOMATION_PRCOMMENT`        | To enable feedback from Coverity security testing as pull request comment. <br> Supported values: true or false </br> **Note** - Feature is supported only through yaml configuration                                                                                                         | Optional     |
| `AZURE_TOKEN` | It is mandatory to pass AZURE_TOKEN parameter with required permissions. <br> Example:  AZURE_TOKEN: $(System.AccessToken) or AZURE_TOKEN: $(PAT_TOKEN) </br>                                                                                                                                                 | Mandatory if  BRIDGE_COVERITY_AUTOMATION_PRCOMMENT is set true. |

**Note on coverity PR comments:**
- **Build Validation Policy** - Enable Build validation policy to trigger the pipeline on raising PR or any push event to existing branch (usually it will be done on main or master branch). Reference - https://learn.microsoft.com/en-us/azure/devops/repos/git/branch-policies?view=azure-devops&tabs=browser#build-validation.  

## Synopsys Security Scan - Black Duck

Synopsys Security Scan supports both self-hosted (e.g. on-prem) and Synopsys-hosted Black Duck Hub instances.

In the default Black Duck Hub permission model, projects and project versions are created on the fly as needed.

 Synopsys Security Scan Extension found in the Azure DevOps Marketplace is the recommended solution for integrating Black Duck into an ADO pipeline. Here's an example workflow for Black Duck scan using the Synopsys Synopsys Security Scan:

```yaml

trigger:
- main

pool:
  vmImage: ubuntu-latest

variables:
  - group: blackduck
    
steps:
- task: JavaToolInstaller@0
  displayName: 'Use Java 17'
  inputs:
    versionSpec: 17
    jdkArchitectureOption: x64
    jdkSourceOption: PreInstalled

- task: SynopsysSecurityScan@1.0.0
  displayName: 'Black Duck Full Scan'
  condition: not(eq(variables['Build.Reason'], 'PullRequest'))
  env:
    DETECT_PROJECT_NAME: $(Build.Repository.Name)
    DETECT_PROJECT_VERSION_NAME: $(Build.SourceBranchName)
    DETECT_CODE_LOCATION_NAME: $(Build.Repository.Name)-$(Build.SourceBranchName)
  inputs:
    BRIDGE_BLACKDUCK_URL: $(BLACKDUCK_URL)
    BRIDGE_BLACKDUCK_TOKEN: $(BLACKDUCK_TOKEN)
    BRIDGE_BLACKDUCK_SCAN_FULL: true
    ### Accepts Multiple Values
    BRIDGE_BLACKDUCK_SCAN_FAILURE_SEVERITIES: 'BLOCKER,CRITICAL'
    ### Uncomment below configuration to enable autoamtic fix pull request creation if vulnerabilities are reported
    # blackduck_automation_fixpr: true 
    # AZURE_TOKEN: $(System.AccessToken) # Mandatory when blackduck_automation_fixpr is set to 'true'
    ### Uncomment below configuration if Synopsys Bridge diagnostic files needs to be uploaded
    # INCLUDE_DIAGNOSTICS: true      

- task: SynopsysSecurityScan@1
  displayName: 'Black Duck PR Scan'
  condition: eq(variables['Build.Reason'], 'PullRequest')
  env:
    DETECT_PROJECT_NAME: $(Build.Repository.Name)
    DETECT_PROJECT_VERSION_NAME: $(System.PullRequest.targetBranchName)
    DETECT_CODE_LOCATION_NAME: $(Build.Repository.Name)-$(System.PullRequest.targetBranchName)
  inputs:
    BRIDGE_BLACKDUCK_URL: '$(BLACKDUCK_URL)'
    BRIDGE_BLACKDUCK_TOKEN: '$(BLACKDUCK_API_TOKEN)'
    BRIDGE_BLACKDUCK_SCAN_FULL: false
    ### Accepts Multiple Values
    BRIDGE_BLACKDUCK_SCAN_FAILURE_SEVERITIES: 'BLOCKER,CRITICAL'
    ### Below configuration is used to enable automatic pull request comment based on Black Duck scan result
    BRIDGE_BLACKDUCK_AUTOMATION_PRCOMMENT: true
    AZURE_TOKEN: $(System.AccessToken) # Mandatory when blackduck_automation_fixpr is set to 'true'
    ### Uncomment below configuration if Synopsys Bridge diagnostic files needs to be uploaded
    # INCLUDE_DIAGNOSTICS: true    
```
**Please find the following mandatory and optional paramters for Black Duck below:**
| Input Parameter | Description                                                                                                                                                                                                                                                           |  Mandatory / Optional |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------|
|`BRIDGE_BLACKDUCK_URL`  | URL for Black Duck server                                                                                                                                                                                                                                             | Mandatory     |
| `BRIDGE_BLACKDUCK_TOKEN` | API token for Black Duck                                                                                                                                                                                                                                              | Mandatory     |
| `BRIDGE_BLACKDUCK_INSTALL_DIRECTORY` | Directory path to install Black Duck                                                                                                                                                                                                                                  | Optional     |
| `BRIDGE_BLACKDUCK_SCAN_FULL` | Specifies whether full scan is required or not.<br/> By default, pushes will initiate a full "intelligent" scan and pull requests will initiate a rapid scan.<br/> Supported values: true or false                                                                    | Optional     |
| `BRIDGE_BLACKDUCK_SCAN_FAILURE_SEVERITIES`      | The scan failure severities of Black Duck <br /> Example: <br />blackduck_scan_failure_severities: "ALL,NONE,BLOCKER,CRITICAL,MAJOR,MINOR,OK,TRIVIAL,UNSPECIFIED"                                                                                                     | Optional |
| `BRIDGE_BLACKDUCK_AUTOMATION_PRCOMMENT`    | Flag to enable automatic pull request comment based on Black Duck scan result. <br> Supported values: true or false </br> **Note** - Feature is supported only through yaml configuration                                                                             | Optional    |
| `BRIDGE_BLACKDUCK_AUTOMATION_FIXPR`      | Flag to enable automatic creation for fix pull request when Black Duck vunerabilities reported. <br> Black Duck automation fix pull request is currently supported for npm projects only and by default it will be disabled. <br>Supported values: true or false </br> **Note** - Feature is supported only through yaml configuration | Optional    |
| `AZURE_TOKEN` | It is mandatory to pass AZURE_TOKEN parameter with required permissions. <br> Example:  AZURE_TOKEN: $(System.AccessToken) or AZURE_TOKEN: $(PAT_TOKEN) </br>                                                                                                            | Mandatory if  BRIDGE_BLACKDUCK_AUTOMATION_PRCOMMENT or BRIDGE_BLACKDUCK_AUTOMATION_FIXPR is set true. |

- **Note about Detect command line parameters**: Any command line parameters needed to pass to Detect can be passed through variables. For example, to only report newly found policy violations on rapid scans, you would normally use the command `--detect.blackduck.rapid.compare.mode=BOM_COMPARE_STRICT`. You can replace this by setting the `DETECT_BLACKDUCK_RAPID_COMPARE_MODE` variable to `BOM_COMPARE_STRICT`.

-  **Note on blackduck PR comments:** Enable **Build Validation Policy** to trigger the pipeline on raising PR or any push event to existing branch (usually it will be done on main or master branch). Reference - https://learn.microsoft.com/en-us/azure/devops/repos/git/branch-policies?view=azure-devops&tabs=browser#build-validation.


Pass the following additional parameters as necessary. 

| Input Parameter | Description                              |  Mandatory / Optional | 
|-----------------|------------------------------------------|-----------------------|
|`synopsys_bridge_path`| Provide a path, where you want to configure or already configured Synopsys Bridge.<br/> [Note - If you don't provide any path, then by default configuration path will be considered as - $HOME/synopsys-bridge].<br/> If the configured Synopsys Bridge is not the latest one, latest Synopsys Bridge version will be downloaded          | Optional     |
| `bridge_download_url`      | Provide URL to bridge zip file.<br/> If provided, Synopsys Bridge will be automatically downloaded and configured in the provided bridge- or default- path.<br/> [Note - As per current behavior, when this value is provided, the bridge_path or default path will be cleaned first then download and configured all the time]               | Optional     |
|`bridge_download_version`| Provide bridge version.<br/> If provided, the specified version of Synopsys Bridge is downloaded and configured.              | Optional     |
| `INCLUDE_DIAGNOSTICS`      | All diagnostics files are available to download when `true` passed.<br/> Azure DevOps no longer supports per-pipeline retention rules. The only way to configure retention policies for YAML and classic pipelines is through the project settings.<br/> Refer the given documentation for more details: <br/> https://learn.microsoft.com/en-us/azure/devops/pipelines/policies/retention?view=azure-devops&tabs=yaml#set-run-retention-policies               | Optional     |

Note - If `bridge_download_version` or `bridge_download_url` is not provided, Synopsys Security Scan downloads and configure the latest version of Bridge.
 
# Synopsys Bridge Setup

- The latest version of Synopsys Bridge is available at: [Synopsys-Bridge](https://sig-repo.synopsys.com/artifactory/bds-integrations-release/com/synopsys/integration/synopsys-bridge/) 
- The most common way to set up Synopsys Bridge is to configure the agent to download the small CLI utility automatically run at the right stage of your pipeline.
- The latest version of Synopsys Bridge is downloaded by default.

## Manual Synopsys Bridge

If you are unable to download the Synopsys Bridge from our internet-hosted repository, or have been directed by support or services to use a custom version of the Synopsys Bridge, you can either specify a custom URL or pre-configure your agent to include the Synopsys Bridge. In this latter case, you would specify the `synopsys_bridge_path` parameter to specify the location of the directory in which the Synopsys Bridge is pre-installed.

# Azure Agent Setup

- Agents can be installed and used on GNU/Linux, macOS, Windows and Docker. Refer [Azure Pipelines agents](https://learn.microsoft.com/en-us/azure/devops/pipelines/agents/agents?view=azure-devops&tabs=browser) for more details.
- You can use Microsoft-hosted agents as well to scan your code using Azure Pipelines.
