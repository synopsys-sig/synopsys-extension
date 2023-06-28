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
- Download the Synopsys Bridge and related adapters
- Run corresponding Synopsys security testing solutions (Polaris, Coverity, or Black Duck).

Synopsys solution functionality is invoked directly by Synopsys Bridge, and indirectly by the Synopsys Security Scan, which downloads Synopsys Bridge and calls the respective adapters to run corresponding scans.

## Synopsys Security Scan - Polaris

Before running a pipeline using the Synopsys Security Scan and Polaris, add `azure-pipelines.yml` to your project.

Configure sensitive data like usernames, passwords and URLs using pipeline variables.

Push those changes and agent will pick up the job and initiate the pipeline.

```yaml
trigger:
- main

pool:
  vmImage: ubuntu-latest
  
steps:
- task: SynopsysSecurityScan@1.0.0
  inputs:
    bridge_polaris_serverUrl: $(POLARIS_SERVER_URL)
    bridge_polaris_accessToken: $(POLARIS_ACCESS_TOKEN)
    bridge_polaris_application_name: $(POLARIS_APPLICATION_NAME)
    bridge_polaris_project_name: $(POLARIS_PROJECT_NAME)
    ### Accepts Multiple Values
    bridge_polaris_assessment_types: "SCA,SAST"
```
| Input Parameter            | Description                                                       | Mandatory / Optional | 
|----------------------------|-------------------------------------------------------------------|--------------------|
| `bridge_polaris_serverUrl`        | URL for Polaris Server                                            | Mandatory          |
| `bridge_polaris_accessToken`      | Access token for Polaris                                          | Mandatory          |
| `bridge_polaris_application_name` | Application name in Polaris                                       | Mandatory          |
| `bridge_polaris_project_name`     | Project name in Polaris                                           | Mandatory          |
| `bridge_polaris_assessment_types` | Polaris assessment types. Example: SCA,SAST                       | Mandatory          |

# Synopsys Security Scan - Coverity Cloud Deployment with Thin Client

At this time, Synopsys Security Scan only supports the Coverity thin client/cloud deployment model, which removes the need for a large footprint installation in your agent.

Before running Coverity using the Synopsys Security Scan, ensure the appropriate `project` and `stream` are set in your Coverity Connect server environment.

Configure sensitive data like usernames, passwords and URLs using pipeline variables.

```yaml
trigger:
- main

pool:
  vmImage: ubuntu-latest
  
steps:
- task: SynopsysSecurityScan@1.0.0
  inputs:
    bridge_coverity_connect_url: $(COVERITY_URL)
    bridge_coverity_connect_user_name: $(COVERITY_USER)
    bridge_coverity_connect_user_password: $(COVERITY_PASSPHRASE)
    bridge_coverity_connect_project_name: $(COVERITY_PROJECT_NAME)
    bridge_coverity_connect_stream_name: $(COVERITY_STREAM_NAME)
```
| Input Parameter   | Description                                                                                                                                                                                                                                                                                    | Mandatory / Optional |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| `bridge_coverity_connect_url` | URL for Coverity server                                                                                                                                                                                                                                                                        | Mandatory     |
| `bridge_coverity_connect_user_name`        | Username for Coverity                                                                                                                                                                                                                                                                          | Mandatory     |
| `bridge_coverity_connect_user_password`        | Password for Coverity                                                                                                                                                                                                                                                                          | Mandatory     |
| `bridge_coverity_connect_project_name`        | Project name in Coverity                                                                                                                                                                                                                                                                       | Mandatory     |
| `bridge_coverity_connect_stream_name`        | Stream name in Coverity                                                                                                                                                                                                                                                                        | Mandatory     |
| `bridge_coverity_install_directory`        | Directory path to install Coverity                                                                                                                                                                                                                                                             | Optional    |
| `bridge_coverity_connect_policy_view`        | The policy view  of Coverity. <br/> Name/ID number of a saved view to apply as a “break the build” policy. <br/> If any defects are found within this view when applied to the project, the build will be broken with an exit code. <br/> Example: bridge_coverity_connect_policy_view: 100001 | Optional    |
| `bridge_coverity_automation_prcomment`        | To enable feedback from Coverity security testing as pull request comment. <br> Supported values: true or false </br> **Note** - Feature is supported only through yaml configuration                                                                                                              | Optional     |
| `azure_token` | It is mandatory to pass azure_token parameter with required permissions. <br> Example:  azure_token: $(System.AccessToken)  </br>                                                                                                                                                              | Mandatory if  bridge_coverity_automation_prcomment is set true. |
          
## Synopsys Security Scan - Black Duck

Synopsys Security Scan supports both self-hosted (e.g. on-prem) and Synopsys-hosted Black Duck Hub instances.

In the default Black Duck Hub permission model, projects and project versions are created on the fly as needed.

Configure sensitive data like usernames, passwords and URLs using pipeline variables.

```yaml

trigger:
- main

pool:
  vmImage: ubuntu-latest
  
steps:
- task: SynopsysSecurityScan@1.0.0
  inputs:
    bridge_blackduck_url: $(BLACKDUCK_URL)
    bridge_blackduck_token: $(BLACKDUCK_TOKEN)
```

| Input Parameter | Description                                                                                                                                                                                            |  Mandatory / Optional |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------|
|`bridge_blackduck_url`  | URL for Black Duck server                                                                                                                                                                              | Mandatory     |
| `bridge_blackduck_token` | API token for Black Duck                                                                                                                                                                               | Mandatory     |
| `bridge_blackduck_install_directory` | Directory path to install Black Duck                                                                                                                                                                   | Optional     |
| `bridge_blackduck_scan_full` | Specifies whether full scan is required or not.<br/> By default, pushes will initiate a full "intelligent" scan and pull requests will initiate a rapid scan.<br/> Supported values: true or false     | Optional     |
| `bridge_blackduck_scan_failure_severities`      | The scan failure severities of Black Duck <br /> Example: <br />blackduck_scan_failure_severities: "ALL,NONE,BLOCKER,CRITICAL,MAJOR,MINOR,OK,TRIVIAL,UNSPECIFIED"                                      | Optional |
| `bridge_blackduck_automation_prcomment`    | Flag to enable automatic pull request comment based on Black Duck scan result. <br> Supported values: true or false </br> **Note** - Feature is supported only through yaml configuration              | Optional    |
| `bridge_blackduck_automation_fixpr`      | Flag to enable automatic creation for fix pull request when Black Duck vunerabilities reported. <br> By default fix pull request creation will be disabled <br> Supported values: true or false </br> **Note** - Feature is supported only through yaml configuration  | Optional    |
| `azure_token` | It is mandatory to pass azure_token parameter with required permissions. <br> Example:  azure_token: $(System.AccessToken)  </br>                                                                      | Mandatory if  bridge_blackduck_automation_prcomment or bridge_blackduck_automation_fixpr is set true. |

- **Note about Detect command line parameters**: Any command line parameters needed to pass to Detect can be passed through variables. For example, to only report newly found policy violations on rapid scans, you would normally use the command `--detect.blackduck.rapid.compare.mode=BOM_COMPARE_STRICT`. You can replace this by setting the `DETECT_BLACKDUCK_RAPID_COMPARE_MODE` variable to `BOM_COMPARE_STRICT`.

## Additional Parameters

Pass the following additional parameters as necessary. 

| Input Parameter | Description                              |  Mandatory / Optional | 
|-----------------|------------------------------------------|-----------------------|
|`synopsys_bridge_path`| Provide a path, where you want to configure or already configured Synopsys Bridge.<br/> [Note - If you don't provide any path, then by default configuration path will be considered as - $HOME/synopsys-bridge].<br/> If the configured Synopsys Bridge is not the latest one, latest Synopsys Bridge version will be downloaded          | Optional     |
| `bridge_download_url`      | Provide URL to bridge zip file.<br/> If provided, Synopsys Bridge will be automatically downloaded and configured in the provided bridge- or default- path.<br/> [Note - As per current behavior, when this value is provided, the bridge_path or default path will be cleaned first then download and configured all the time]               | Optional     |
|`bridge_download_version`| Provide bridge version.<br/> If provided, the specified version of Synopsys Bridge is downloaded and configured.              | Optional     |
| `include_diagnostics`      | All diagnostics files are available to download when `true` passed.<br/> Azure DevOps no longer supports per-pipeline retention rules. The only way to configure retention policies for YAML and classic pipelines is through the project settings.<br/> Refer the given documentation for more details: <br/> https://learn.microsoft.com/en-us/azure/devops/pipelines/policies/retention?view=azure-devops&tabs=yaml#set-run-retention-policies               | Optional     |

Note - If `bridge_download_version` or `bridge_download_url` is not provided, Synopsys Security Scan downloads and configure the latest version of Bridge.
 
# Synopsys Bridge Setup

- The latest version of Synopsys Bridge is available at: [Synopsys-Bridge](https://sig-repo.synopsys.com/artifactory/bds-integrations-release/com/synopsys/integration/synopsys-bridge/) 
- The most common way to set up Synopsys Bridge is to configure the agent to download the small CLI utility automatically run at the right stage of your pipeline.
- The latest version of Synopsys Bridge is downloaded by default.

## Manual Synopsys Bridge

If you are unable to download the Synopsys Bridge from our internet-hosted repository, or have been directed by support or services to use a custom version of the Synopsys Bridge, you can either specify a custom URL or pre-configure your agent to include the Synopsys Bridge. In this latter case, you would specify the `synopsys_bridge_path` parameter to specify the location of the directory in which the Synopsys Bridge is pre-installed.

# Azure Agent Setup

- Agents can be installed and used on GNU/Linux, macOS, Windows and Docker. See this documentation for details:
https://learn.microsoft.com/en-us/azure/devops/pipelines/agents/agents?view=azure-devops&tabs=browser
- You can use Microsoft-hosted agents as well to scan your code using Azure Pipelines.
- If you are passing `bridge_coverity_automation_prcomment` to pass comments, you must enable this in the Azure interface. Go to **Project --> Project Settings --> Repository –-> Security –-> Build Service** and set **Contribute to pull requests** to **Allow**.



