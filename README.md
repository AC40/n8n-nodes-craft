<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

# n8n-nodes-craft

<!-- PROJECT LOGO -->

[![Project Banner][project-banner]](./images/banner.png)
<br />

<div align="center">
  <p align="center">
    The Bridge you where looking for between two awesome tools
    <br />
    <a href="./CONTRIBUTING.md"><strong>Want to contribute? »</strong></a>
    <br />
    <br />
    <a href="https://github.com/ac40/n8n-nodes-craft/issues/new?labels=bug&template=bug-report.md">Report Bug</a>
    &middot;
    <a href="https://github.com/ac40/n8n-nodes-craft/issues/new?labels=enhancement&template=feature-request.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#installation">Installation</a></li>
    <li>
      <a href="#operations">Operations</a>
      <ul>
        <li><a href="#blocks">Blocks</a></li>
        <li><a href="#collections">Collections</a></li>
      </ul>
    </li>
    <li><a href="#credentials">Credentials</a></li>
    <li><a href="#compatibility">Compatibility</a></li>
    <li><a href="#resources">Resources</a></li>
    <li><a href="#version-history">Version history</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This is an n8n community node. It lets you use [Craft](https://craft.do) Docs in your n8n workflows.

[Craft](https://craft.do) is an app that helps you _craft_ the best Docs in the world (that's their claim, and it is absolutely true!).

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

### Community Node (soon to be released)

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

> This node is not published as a community node yet, currently only the self-installation is available

### Private Node

To run this node as a private node, follow [this](https://docs.n8n.io/integrations/creating-nodes/deploy/install-private-nodes/) guide by n8n. I also have a [prepared Dockerfile](https://github.com/AC40/custom-n8n-image) with a blank n8n installation + this craft node.

Either run my custom image or build your own if you want to install additional private node.

## Operations

Currently we support the following Operations

### Blocks

- Fetch & Serach
- Insert
- Delete
- Update & Move

### Collections

- List items
- Insert items (including creating new fields)
- Modify items
- Remove items

## Credentials

If you want to interact with protected Documents, you will need to create a BearerAuth Credential for your respective Document with API Keys and document ids.

## Compatibility

1.0 (Node.js 18)

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Some more information about this project](https://ac-rich.craft.me/n8n-nodes-craft)

## Version history

N/A

<!-- Images -->

[project-banner]: ./images/banner.png
