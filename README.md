You-Verify Invoice App
This project is built with:

Next
JavScript
shadcn-ui
Tailwind CSS
All shadcn/ui components have been downloaded under @/components/ui.

File Structure
index.html - HTML entry point
next.config.mjs - Next configuration file
tailwind.config.js - Tailwind CSS configuration file
src/app/layout.js - Root component of the project
src/app/page.js- Project entry point
src/app/global.css - Existing CSS configuration

Components
All shadcn/ui components are pre-downloaded and available at @/components/ui
Styling

Use Tailwind classes for styling components
Development
Import components from @/components/ui in your React components
Customize the UI by modifying the Tailwind configuration
Note
The @/ path alias points to the src/ directory
In your typescript code, don’t re-export types that you’re already importing
Commands
Install Dependencies

npm i
Add Dependencies

**Start Preview**

**Start Development**
`npm run dev`

```shell
pnpm run dev
To build

pnpm run build
```
