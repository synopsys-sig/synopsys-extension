# BlackDuck Security Scan for Azure DevOps

BlackDuck Security Scan Extension for Azure DevOps enables you to configure your Azure pipeline to run BlackDuck security testing and take action on the results.
BlackDuck Security Scan leverages Bridge-CLI, allowing you to run tests for several BlackDuck products from the command line.

BlackDuck Security Scan supports Azure integration with the following BlackDuck security testing solutions:
- **Polaris**, a SaaS-based solution offering SAST, SCA and Managed Services in a single unified platform
- **Coverity**, using our thin client and cloud-based deployment model
- **Black Duck Hub**, supporting either on-premises or hosted instances

**Note**: BlackDuck Security Scan requires appropriate licenses for all BlackDuck application used.

BlackDuck solution functionality is invoked directly by Bridge-CLI, and indirectly by the BlackDuck Security Scan, which downloads Bridge-CLI and calls the respective adapters to run corresponding scans.


Documentation - https://sig-product-docs.synopsys.com/bundle/bridge/page/documentation/c_synopsys-security-scan-for-azure-devops.html
