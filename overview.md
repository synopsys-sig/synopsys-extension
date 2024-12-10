# DEPRECATED: Synopsys Security Scan for Azure DevOps

**NOTE:** This extension has been deprecated and will not work after February 14, 2025. It is recommended that you migrate to our new <a href="">Black Duck Security Scan</a>. Instructions can be found <a href="<community url>">here</a>

Synopsys Security Scan Extension for Azure DevOps enables you to configure your Azure pipeline to run Synopsys security testing and take action on the results. 
Synopsys Security Scan leverages Synopsys Bridge, allowing you to run tests for several Synopsys products from the command line.

Synopsys Security Scan supports Azure integration with the following Synopsys security testing solutions:
- **Polaris**, a SaaS-based solution offering SAST, SCA and Managed Services in a single unified platform
- **Coverity**, using our thin client and cloud-based deployment model
- **Black Duck Hub**, supporting either on-premises or hosted instances

**Note**: Synopsys Security Scan requires appropriate licenses for all Synopsys application used.

Synopsys solution functionality is invoked directly by Synopsys Bridge, and indirectly by the Synopsys Security Scan, which downloads Synopsys Bridge and calls the respective adapters to run corresponding scans.


Documentation - https://sig-product-docs.synopsys.com/bundle/bridge/page/documentation/c_synopsys-security-scan-for-azure-devops.html
