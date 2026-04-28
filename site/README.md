# Astro Starter Kit: Minimal

```sh
bun create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun dev`             | Starts local dev server at `localhost:4321`      |
| `bun build`           | Build your production site to `./dist/`          |
| `bun preview`         | Preview your build locally, before deploying     |
| `bun astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## 🎥 Adding Your Video Link

Each member already has a `video: ""` field in the `members` array at the top of `src/pages/index.astro`. To add your video, open that file and paste your URL between the quotes for **your** entry:

| Member            | Edit this line                                                  |
| :---------------- | :-------------------------------------------------------------- |
| Jace Yarborough   | `video: ""` in the `JaceYar` entry (~line 10)                   |
| Jonathan Deiss    | `video: ""` in the `FireSquid6` entry (~line 17)                |
| Aaron Evans       | `video: ""` in the `aaron-d-e` entry (~line 24)                 |
| Erick Martinez    | `video: ""` in the `emartinez-06` entry (~line 31)              |
| James Bagwell     | `video: ""` in the `jamesdavid0214` entry (~line 38)            |
| Zain Altaf        | `video: ""` in the `zfa2005` entry (~line 45)                   |

For example:

```js
{
  name: "Jonathan Deiss", github: "FireSquid6",
  // ...
  video: "https://youtu.be/your-video-id",
},
```

Save, run `bun dev`, and your row in the `team.videos` table on the home page will turn from "No video yet" into a clickable **Watch video** link.

**Tips for the URL itself:**
- YouTube: use the share link (`https://youtu.be/...`) or the full watch URL.
- Google Drive: open the video, click *Share → Copy link*, and make sure access is set to *Anyone with the link*.
- Keep the link `https://` — bare or relative URLs will resolve against the site domain.
