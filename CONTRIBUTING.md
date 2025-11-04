<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

# n8n-nodes-craft

<!-- PROJECT LOGO -->

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
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Project Banner][project-banner]](./images/banner.png)

This is an n8n community node that enables you to integrate [Craft](https://craft.do) Docs into your n8n workflows. It provides seamless connectivity between Craft's powerful documentation platform and n8n's workflow automation capabilities, allowing you to automate document management, content creation, and data synchronization.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

To run this project locally you must have n8n installe globally.

```sh
npm install n8n -g
```

> For more Info on local development, check out the [n8n docs](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/)

### Installation

This is a guide on how to set up n8n-nodes-craft for <b>local development</b>. If you are looking for a guide on how to add this community node to your n8n workflow, check out the [README](./README.md#installation).

1. Fork this project
1. Clone the repo
   ```sh
   git clone https://github.com/<your-username>/n8n-nodes-craft.git
   ```
1. Install the dependencies

   npm

   ```sh
   npm install
   ```

   pnpm

   ```
   pnpm install
   ```

### Run Locally

These steps are also detailled [here](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/)

1. Build Project

   In your git directory, run `npm run build`

2. Link Project
   - In your git direcotry, run `npm link`

   - Then, go to `~/.n8n/custom` and run `npm link n8n-nodes-craf`. You may have to create the custom directory for this.

3. Run Project

   ```
   n8n start
   ```

   You made it! 🥳

   You now have a local instance of this node running and can try out all the things you want.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [x] Support Block endpoints
- [x] Support Collection endpoints
- [ ] Improve Document selection (plain ids vs. credentials)
- [ ] Improve block creation (type schema?)

See the [open issues](https://github.com/ac40/n8n-nodes-craft/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

Follow the [installation instructions](#installation) to set this up locally.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Your Name - contact@aaronrichter.tech

Project Link: [github.com/AC40/n8n-nodes-craft](https://github.com/AC40/n8n-nodes-craft)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

Lots of love goes out the awesome people at [Craft](https://www.craft.do/) that build amazing software! Same goes for the n8n team! ❤️

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[project-banner]: ./images/banner.png
