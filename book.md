> You can read the book online at [ReactGuide](https://reactguide.netlify.com/)

# The Book

This book is not supposed to ever serve as a teaching mechanism for React but more of a way to see React from the eyes of someone who has been using it for years and got sick of the "it depends".
All I will show you here are things that either I use(d) or things developers I trust have used.

Also, opinions will be shared that you may agree or not but to show the options and point of view is my objective with this book.

## What will you learn?

Probably not how to use React from the basics but a clearer picture of how bigger React apps work, a bit of the tools they use, the ups and downs, their structure and also some knowledge on how to use these tools yourself.
We will start with some things like folder and name structure and then go into packages, starter kits and many more.

# Folder/ File Structuring

In this chapter, we will be talking about how I usually structure applications in terms of folder position, file exports, and some other small tidbits.

## Folder

In apps and websites I have built with React, I tend to have a similar structure that seems to work and that looks like so:

```
.
├── src
| ├── index.js
| ├── components/
| ├──── button/
| ├────── index.js
| ├────── elements.(js/css)
| ├── pages/
| ├──── homepage/
| ├──── screens/
| ├────── hero/
| ├────── index.js
| ├────── elements.(js/css)
| ├──── index.js
| ├──── elements.(js/css)
| ├── index.js
| ├── utils/
| ├──── date.js
| ├── assets/
| ├──── icons/
| └──── images/

```

In the core I have 4 main folders:

- `components` - This is where components used by more than one page or module get placed. These things usually don't quite belong in a design system. One example can be a `SaveButton` this will be an extension of the `Button` with some differences that will be used in a lot of places and unlike the `Button` doesn't quite belong in a design system.
  If no design system is in place, basically anything that's used by more than one page or component like an `Alert`.

- `pages`- This is where your main pages will stay, this will have an `index.js` the place from which your routes file will import all the pages in your app. Usually, within a page you can have multiple sections like a hero, this won't be used anywhere else, but it's a crucial part and should have both an `index.js` and a styles file so we can put this in a folder as well to minimize the size of our files, while also making it easier to find things.

- `assets` - This folder will contain all images and icons. I usually have both, so I find it easier to divide the folders since most of the time my icons will be in SVG and these will be translated into `JSX` and end up being also `JavaScript` files at their core.

- `utils` - This is where your overly complicated functions go to. This is kind of like hiding the shame but in a calculated way. Let's say you need to transform dates in a component and it's a pretty heavy function. In my opinion, this should be its own file may be generalized to dates so it can export several functions for date manipulation - trust me, there will always be date manipulation.

## File naming

I always try to name my files `index.js` and let the folder name do the talking. This will allow me to have more freedom in the composition of that component or page, as more files may be added, and that way they all stay concise in that folder. So I may have something like:

```
src/components/Alert/index.js
```

Even though it's the index file, the way module resolution works in JavaScript is that you don't need to specify `index.js` so you can just import like you would a file:

```js
import Alert from "./components/Alert";
```

This will look for the file, and then if it doesn’t find any, it will look for the folder and the `index` file inside. So don’t worry about more typing.

## Exporting Components

For many years, I used the good old `export default` even though React always yelled at me, I would export a component like so:

```jsx
import React from "react";

export default ({ onClick }) => (
  <>
    <h1>Sup?</h1>
    <button onClick={onClick}>I am a button</button>
  </>
);
```

One of the drawbacks of this is how more INCREDIBLY hard it becomes to find anything in the DevTools. For VSCode users, it also removes the autocomplete because you never named the component.

In recent years, I have always exported the same component like so:

```jsx
import React from "react";

const ButtonWrapper = ({ onClick }) => (
  <>
    <h1>Sup?</h1>
    <button onClick={onClick}>I am a button</button>
  </>
);

export default ButtonWrapper;
```

This has two main advantages over default:

- You can now see in the React DevTools what the component name is making it for easier debugging and just overall cleaning of the DevTools.
- Autocompletion in VSCode. Even without TypeScript, VSCode is pretty smart and can do a rundown of your folders and see the component's name and see what is what you want. It's not bulletproof without TypeScript but honestly, it's pretty impressive and more than enough for me to be productive

## TypeScript

Let's talk about the elephant in the room _TypeScript_.

#### Do you need it to build a React app?

Oh god no, even less in the start, I think TypeScript is one of those "pluck it in when you need it" type of tool. At the start it's definitely not needed, maybe your app will start feeling very prone to errors and it's a good idea but not at the start. Never at the start unless you know the app you are building will have the need for a complicated state.

#### Should I use it for my marketing page?

Honestly...why? It will add way more complexity without improving gains a lot, you don't have state, you don't have complicated things, it's a website and not an app, so in all honesty, there is no need for something as heavy as that.

#### Fine, when do I need it?

When honestly you can't manage state and you have no idea wtf is what anymore, and how many `isLoggedIn` states you have in your store, you need TypeScript when you would rather cry than manage state.

#### What things should have TypeScript?

In my opinion, state and design systems are things where TypeScript is quite handy because you use them all the time and you need to know what props you want to use, their types, and all of those fancy things.

#### But what does a TypeScript React component look like?

Let's do one with state and props, let's take this simple component and make it all TypeScript compatible:

```jsx
import React from "react";
import { AlertWrapper, Message, CloseButton } from "./elements";

const Alert = ({ onClose, type, children, neverClose }) => {
  const [open, setOpen] = useState(true);

  return open ? (
    <AlertWrapper type={type}>
      {!neverClose ? (
        <CloseButton
          onClick={e => {
            setOpen(false);
            onClose && onClose(e);
          }}
        >
          x
        </CloseButton>
      ) : null}
      <Message>{children}</Message>
    </AlertWrapper>
  ) : null;
};
```

In this case, we have some props we may want to type, and looking at them we have:

- `onClose` - An optional function that returns nothing and takes the event to the parent component.
- `type` - The type of alert this is and in our case, it can either be: `success`, `error` or `warning`.
- `children` - Any React nodes we want to pass as the message
- `neverClose` - An optional boolean attribute to check if we want to show the close button.

So let's transfer this into an interface in TypeScript:

```ts
interface Props {
  onClick?: (event: React.MouseEvent) => void;
  type: "success" | "error" | "warning";
  children: React.ReactNode;
  neverClose?: boolean;
}
```

To apply this to the React component we do as such:

```tsx
import React from "react";
import { AlertWrapper, Message, CloseButton } from "./elements";

interface Props {
  onClick?: (event: React.MouseEvent) => void;
  type: "success" | "error" | "warning";
  children: React.ReactNode;
  neverClose?: boolean;
}

const Alert = ({ onClose, type, children, neverClose }: Props) => {
  const [open, setOpen] = useState(true);

  return open ? (
    <AlertWrapper type={type}>
      {!neverClose ? (
        <CloseButton
          onClick={e => {
            setOpen(false);
            onClose && onClose(e);
          }}
        >
          x
        </CloseButton>
      ) : null}
      <Message>{children}</Message>
    </AlertWrapper>
  ) : null;
};
```

There are many other types, but in general, typing React components like these is not a tough thing to do, but sometimes doing this will lead to more work like transpiling or debugging edge cases that are not always worth it.

I have very strong opinions on TypeScript as I think it creates a barrier for people to get into web development in a way as to open and accessible as I did and most of the time for no reason. I would say 50% or more of apps don't need TypeScript at all, more than 80% don't need TypeScript all over their pages and 100% don't need TypeScript in a marketing page with no state management.

If you want your designer to make changes, add JSX, fix CSS and overall do some code, please avoid using TypeScript and it's not something that they need to learn and consider if you yourself need it when making an open-source project or if it's creating a barrier of entry for people who want to help.

# Project Starters

One of the main issues that existed in the first days of React was that it was incredibly hard to get started, you had to mess with webpack and do a lot of really hard things just to get a hello world up and running.
In the last couple of years that has gotten better, we now have a lot of tools to help us get started writing React projects in no time, but on the other hand, we have so many that are so good that sometimes it's harder to know what starter to use.
I will go through the three most popular starters used right now to create different types of projects in React.

## Create React App

**Link: [https://create-react-app.dev/](https://create-react-app.dev/)**

Create React App is the first and most famous one, it's made and maintained by the React team themselves so you know it will be maintained and updated.

Without a doubt, Create React App, or CRA for short is the fastest way to get started and have some React code show up on your page. However, its main issue is that CRA is not very extensible, because you don't have access to the webpack or even babel config. It's a tradeoff you should be aware of from the start, as sometimes the only way to add something is to `eject` and that will leave you with a complex webpack config you need to manage by hand, including updating everything yourself, rather than upgrading the react-scripts package that CRA uses to hide that complexity.

Let's look at the pros and cons:

Pros:

- Quick to get started
- Supports most CSS preprocessors
- Supports PWA
- Easily updatable with new features
- Support for SVG as React Components

Cons:

- Not a lot of flexibility when it comes to changing the way it handles file types
- No Server Side Rendering (SRR) Support
- No decisions from the React team in terms of app building, so all the router, state management, and other choices will be up to you.

In my opinion, Create React App is a good starting point, but if your application grows big enough it will also get out of hand anyways and you will end up with a lot of webpack to handle regardless.

## Next

**Link: [https://nextjs.org/](https://nextjs.org/)**

Next is great, it comes prepared for a lot of things in your application, more than a starting point, it's a guide to making server-side rendered applications in React as that is supported out of the box and one of the biggest selling points of Next.

It also makes some decisions for you like routing and styling but gives you the room to decide to use other options if you want so you are not stuck with their decisions. You can even change the babel configuration to support more things you may need.

Let's say you don't want to use their styling options but prefer to use styled-components, in that case, you can extend the babel config by adding the plugin like in a new `.babelrc` file

```json
{
  "presets": ["next/babel"],
  "plugins": ["babel-plugin-styled-components"]
}
```

Make sure to leave the `next/babel` plugin as that adds a lot of functionality and a lot of babel presets and plugins. You can read more about it [here](https://nextjs.org/docs#customizing-babel-config).

A big advantage of Next is also that it has a simple way to get started with the CLI. To make a new project you can run:

```bash
npx create-next-app
```

So let's look at the pros and cons of Next in my opinion:

Pros:

- Server Side Rendering support
- Amazing docs with lessons to follow
- Production grade
- Customization options

Cons:

- A steep learning curve, mostly for being SSR things are just harder.
- Harder to leave if `next` is not the best fit for your project

## Gatsby

**Link: [https://www.gatsbyjs.org/](https://www.gatsbyjs.org/)**

I'll be honest, Gatsby is basically my Create React App, it's what I use for basically everything. Even the [website for this book](https://reactguide.netlify.com/) is made in Gatsby, just because.

Gatsby started a project by Kyle Mathews to create blogs but it grew into so much more and now it's a VC-backed company and the product is way more than a blog creator – you can pull data from anywhere to make static sites.

You may ask what is so good about static sites? One of the main benefits is without a doubt the SEO: the app is pre-rendered HTML so everything gets read by Google to better rank your site. Another big benefit is the deployment, static HTML sites are waaaaay easier to deploy than server-side applications.

Getting started is also quite easy as Gatsby also has a CLI:

```bash
npx gatsby new gatsby-site
```

This will give you a new site inside a directory called “gatsby-site”, with the [default template](https://github.com/gatsbyjs/gatsby-starter-default). This one comes with some plugins and also two pages so you can get an idea of how the routing works inside of Gatsby.

The main strength of Gatsby is to be able to pull data from basically anywhere and create HTML files from it with GraphQL so it is needed to know some GraphQL in order to get a full grasp of it's potential.

Let's start with a simple example using a plugin that will get data from [https://randomuser.me/](https://randomuser.me/) and display it on our page.

First installing the plugin:

```bash
yarn add gatsby-source-randomuser
```

Now that we’ve installed the plugin, we have to add it to our list of plugins located in our `gatsby-config.js`, in there we can add the plugin and tell it to get 25 people:

```json
{
 resolve: "gatsby-source-randomuser",
 options: {
 results: 25,
 },
},
```

Now that we have this, our site can be fed this data from GraphQL and to do this we need to add a query to our index page:

```js
export const Query = graphql`
  query Users {
    allRandomUser {
      edges {
        node {
          id
          name {
            first
            last
          }
          picture {
            thumbnail
          }
        }
      }
    }
  }
`;
```

If you want to test this query, or pretty much anything you want to achieve with GraphQL, open `http://localhost:8000/___graphql`. That will give you a GraphQL playground to test your queries.

After this is done, we can now pass this data to our component and render our humans:

```jsx
const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" />
    <h1>Hi peeps :wave:</h1>
    <ul>
      {data.allRandomUser.edges.map(({ node }) => (
        <li>
          <img src={node.picture.thumbnail} alt={node.name.first} />
          {node.name.first} {node.name.last}
        </li>
      ))}
    </ul>
  </Layout>
);
```

There is waaay more you can do with this example, including creating a page for every user, but as an example of the power, I feel we leave it in a good spot.
For the code and preview, you can go to [CodeSandbox](https://codesandbox.io/s/gatsby-random-people-m7woc).

Now that you have an idea how much I like Gatsby, let's go over some pros and cons of using it.

Pros:

- Amazing documentation
- Flexibility to tweak Gatsby internals to your needs
- Export to HTML
- Amazing community and team behind it
- Focus on performance and accessibility

Cons:

- The steep learning curve for any advanced things
- Knowledge of GraphQL required to get started
- Not everything can be static
- Some errors only show up on build or deploy

# Packages

If you want something there is almost certainly a React package for that and in my opinion that this is both a strength and a downfall when combined with the fact that React itself only provides you with a view layer and the rest is supposed to be figured out by yourself.

You may ask how I can see this as a downfall, since the fact that there are so many packages and people out there making tools should only be an advantage? It is an advantage when there is a direction and recommended ways, something React refuses to create, so to anyone getting started it all looks like a sea of sameness. This part is a bit for people who feel the same way, like searching for a router is like going into a voyage.
Here I will go through the packages I use for some parts of an app, as well as how to use the basics of each, That way, you can take everything I say and then make an informed decision about whether you will use the same thing or continue on the quest.

Let's start.

## Routing

**Winner: [Reach Router](https://reach.tech/router)**

For years I used React Router, the syntax, and some API choices weren't really my cup of tea, but it was the most-used and supported, so I kept using it until Reach Router came around. Reach Router took all the little things I didn't really like about React Router and made them go away.

First thing I like is how you define routes, it gets rid of the `Route` component replacing it with the actual component handling that like so:

```jsx
import { render } from "react-dom";
import React from "react";
import { Router, Link } from "@reach/router";

let Home = () => <div>Home</div>;
let User = () => <div>User</div>;

render(
  <Router>
    <Home path="/" />
    <User path="user/:id" />
  </Router>,
  document.getElementById("root")
);
```

Now, let's say you wanna get that user id to fetch from a database or from an API, you can get it from the direct props instead of getting inside objects of objects:

```jsx
import { render } from "react-dom";
import React from "react";
import { Router, Link } from "@reach/router";

let Home = () => <div>Home</div>;
let User = ({ id }) => <div>User: {id}</div>;

render(
  <Router>
    <Home path="/" />
    <User path="user/:id" />
  </Router>,
  document.getElementById("root")
);
```

Adding links also has a pretty good developer experience:

```jsx
import { render } from "react-dom";
import React from "react";
import { Router, Link } from "@reach/router";

const Home = () => (
  <div>
    <Link to="/user/random">Go to Random user</Link>
  </div>
);
const User = ({ id }) => <div>User: {id}</div>;

render(
  <Router>
    <Home path="/" />
    <User path="user/:id" />
  </Router>,
  document.getElementById("root")
);
```

<!--
Nested routes also work like React components, as if you want a route to be the child of the one you can simply place it inside the parent route like so:

```jsx
import { render } from "react-dom";
import React from "react";
import { Router, Link } from "@reach/router";

const Home = () => (
 <div>
 <Link to="user/random">Go to Random user</Link>
 </div>
);
const Users = () => <div>Nothing to see here</div>;
const User = ({ id }) => <div>User: {id}</div>;

render(
 <Router>
 <Home path="/" />
 <Users path="user/">
 <User path="/id/:id" />
 </Users>
 </Router>,
 document.getElementById("root")
);
``` -->

One thing that really took me to Reach Router was the `navigate` function, this simple but powerful function allows you to navigate somewhere in your app without complication or components like so:

```jsx
import { render } from "react-dom";
import React, { useState } from "react";
import { Router, Link, navigate } from "@reach/router";

const Home = () => {
  const [user, setUser] = useState("");
  return (
    <div>
      <Link to="user/random">Go to Random user</Link>
      <input value={user} onChange={e => setUser(e.target.value)} />
      <button disabled={!user} onClick={() => navigate(`/user/${user}`)}>
        Go to that user
      </button>
    </div>
  );
};
const User = ({ id }) => <div>User: {id}</div>;

render(
  <Router>
    <Home path="/" />
    <User path="user/:id" />
  </Router>,
  document.getElementById("root")
);
```

As soon as you fill in the input and click the button, you will be redirected to the new page with the value typed with no fuss.

Let's finish our "app" by adding a 404 page so that our user can know they got lost:

```jsx
import { render } from "react-dom";
import React, { useState } from "react";
import { Router, Link, navigate } from "@reach/router";

const Home = () => {
  const [user, setUser] = useState("");
  return (
    <div>
      <Link to="user/random">Go to Random user</Link>
      <input value={user} onChange={e => setUser(e.target.value)} />
      <button disabled={!user} onClick={() => navigate(`/user/${user}`)}>
        Go to that user
      </button>
    </div>
  );
};
const User = ({ id }) => <div>User: {id}</div>;
const NotFound = () => <p>Sorry, nothing here</p>;

render(
  <Router>
    <Home path="/" />
    <User path="user/:id" />
    <NotFound default />
  </Router>,
  document.getElementById("root")
);
```

We created a bunch of functionality in 27 lines. I think that's where Reach Router shines: a simple experience for the developer, yet still able to handle more complex requirements down the road.

[Link to CodeSandbox](https://codesandbox.io/s/keen-shadow-4uh2u)

## State Management

**Winner: [Overmind](https://www.overmindjs.org/)**

At [CodeSandbox](https://codesandbox.io) we have been using Overmind for a while and even before that, we were using its predecessor `Cerebral`. It is honestly a breath of fresh air when it comes to state management, it's simple but super powerful and super extensible. You can use Overmind in big applications with minimal boilerplate.

Beware that it is a mutable state management option and if this is a no go for you, I am sorry but you should take a look as it definitely doesn't make your app slower or harder to follow. It also has complete TypeScript support, as in all your state gets typed automatically, and as someone who has her doubts about TypeScript, even I can say it's amazing.

Speaking is easier with code so let's make a simple app to show how overmind works, the first thing we need to do is install `overmind` and `overmind-react`:

```bash
yarn add overmind overmind-react
```

Then we can create an `overmind/index.js` and start our overmind setup:

```js
import { createHook } from "overmind-react";

export const config = {
  state: {
    terms: ["SSR", "PWA"]
  },
  actions: {
    // anything to transform the state
  }
};

export const useOvermind = createHook();
```

Here we first import the create hook from Overmind that will allow us to use Overmind with one simple hook and then we define our config that for now just holds our state with a couple of Front End related terms.

Next we need to pass this config to our React app:

```jsx
import React from "react";
import { render } from "react-dom";
import { createOvermind } from "overmind";
import { Provider } from "overmind-react";
import { config } from "./overmind";
import App from "./components/App";

const overmind = createOvermind(config);

render(
  <Provider value={overmind}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
```

So we create an Overmind instance and pass it to our App. That's it, that is all the boilerplate we need to do in order to get it to work, we can now list our amazing terms in our page, in our `./components/App` you can add:

```jsx
import React from "react";
import { useOvermind } from "../overmind";

const App = () => {
  const { state } = useOvermind();

  return (
    <>
      <ul>
        {state.terms.map((term, i) => (
          <li>{term}</li>
        ))}
      </ul>
    </>
  );
};

export default App;
```

If you now check back on our app, you can see that we can see all our terms on the page and honestly that was pretty painless.

So far we only display data and usually, the hardest is actually changing the state. But remember what I said at the top: Overmind is mutable so changing the state is quite straightforward.

To do this, we create actions. Actions will also get the state as a parameter and have the ability to mutate it, so let's make an action to add a term and one to delete a term:

```js
import { createHook } from "overmind-react";

export const config = {
  state: {
    terms: ["SSR", "PWA"]
  },
  actions: {
    addTerm({ state }, term) {
      state.terms = [term, ...state.terms];
    },
    removeTerm({ state }, indexToDelete) {
      state.terms = state.terms.filter((_, i) => indexToDelete !== i);
    }
  }
};

export const useOvermind = createHook();
```

As you can see, all we do is reassign `state.terms` to a new value and that will update our components that are using Overmind and that part of the state magically.

Looking deeper into those actions, we can see that we get two parameters: the first one always comes from Overmind and it includes `state`, other `actions` (and also a couple more things you may need in the future like [`effects`](https://overmindjs.org/api/effects)) and our second parameter is anything we pass into the action when we call it.

Let's now attach it to our components by also getting the effects out of out `useOvermind` hook:

```jsx
import React, { useState } from "react";
import { useOvermind } from "../overmind";

const App = () => {
  const {
    state,
    actions: { addTerm, removeTerm }
  } = useOvermind();
  const [term, setTerm] = useState("");

  const onSubmit = e => {
    e.preventDefault();
    addTerm(term);
    setTerm("");
  };

  return (
    <>
      <h1>Add a term</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={term}
          onChange={e => setTerm(e.target.value)}
        />
        <button type="submit" disabled={!term}>
          Add
        </button>
      </form>
      <h1>Terms</h1>
      <ul>
        {state.terms.map((term, i) => (
          <li>
            {term} - <button onClick={() => removeTerm(i)}>x</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default App;
```

A fully connected form and it was pretty painless.
I am honestly in love with this way of state management, it's simple to get started, boilerplate clean and has a lot of room to grow, I feel like it ticks all the boxes in something you may want in a state management solution including a [DevTool](https://marketplace.visualstudio.com/items?itemName=christianalfoni.overmind-devtools-vscode) as a VSCode plugin.

I would say give it a try and let me and the creator know how you feel about it.

[Link to CodeSandbox](https://codesandbox.io/s/overmind-example-v6plk)

## Animation

**Winner: [Framer Motion](https://www.framer.com/motion/)**

Animation is hard, actually super hard and I feel like in React it ends up slightly harder because it's two different packages trying to control the DOM. For many years I tried several packages until Framer Motion came out, I find that it fits most of the needs I have when it comes to UI animation in React.

> Beware that for very complex animation you should still use [gsap](https://greensock.com/gsap/) as that allows for things like timelines that help when an animation needs a lot of entrances and exits.

I am going to show a small example that will demonstrate how to animate something to `height: auto` that is something that makes us cry a lot when it comes to doing it in real life so let's get started with installing framer motion:

```bash
yarn add framer-motion
```

First thing you should know is that Framer Motion exports a whole set of components from their package, but today we will be focusing mostly on the `motion` component, this is the component where you can place all your animations and define the transition times and methods for them.

We will have a small app that will open an accordion like so:

```jsx
import React, { useState } from "react";
import Spectrum from "react-spectrum";
import ReactDOM from "react-dom";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div class="wrapper">
      <button class="open" onClick={() => setIsOpen(!isOpen)}>
        {!isOpen ? "Open me" : "Close me"}
      </button>
      {isOpen && (
        <main style={{ overflow: "hidden" }}>
          <Spectrum
            linesPerParagraph={lines > 1 ? lines : 1}
            width={500}
            colors={["#757575", "#999999", "#0871F2", "#BF5AF2"]}
          />
        </main>
      )}
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

> The package [react-spectrum](https://www.npmjs.com/package/react-spectrum) is a simple package that generates colorful text placeholders so we don't have to put ugly lorem text

So far, if you click the button you can see the text shows up but it doesn't animate, for that we need to replace the `main` component with a `motion.main`.
The way to use the motion component is that everything after the `.` must be a valid HTML element, then that will be the element that will be used to wrap and animate your component, so in this case I will be using a main component.

Let's now import motion and define our animations:

```jsx
import React, { useState } from "react";
import Spectrum from "react-spectrum";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div class="wrapper">
      <button class="open" onClick={() => setIsOpen(!isOpen)}>
        {!isOpen ? "Open me" : "Close me"}
      </button>
      {isOpen && (
        <motion.main
          style={{ overflow: "hidden" }}
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
        >
          <Spectrum
            linesPerParagraph={lines > 1 ? lines : 1}
            width={500}
            colors={["#757575", "#999999", "#0871F2", "#BF5AF2"]}
          />
        </motion.main>
      )}
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

Right now we have a motion `motion-main` with 3 props:

- `style` - This is some styles that will be applied in all states of the animation. This can also be a className.
- `initial` - The starting state of our element.
- `animate` - What values to animate to.

If you click the button it works on enter no problem and it looks sweet, but to close no animation is played and this is because how we are doing this React just unmounts the component as soon as the button is clicked so no time for an animation is left.
To solve this there is a Framer Motion element called `AnimatePresence` that will wrap our if statement in, so that we are able to use the `exit` prop on our `motion` component, which can define an animation to use when a component is unmounted.

Let's add that then:

```jsx
import React, { useState } from "react";
import Spectrum from "react-spectrum";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div class="wrapper">
      <button class="open" onClick={() => setIsOpen(!isOpen)}>
        {!isOpen ? "Open me" : "Close me"}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.main
            style={{ overflow: "hidden" }}
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 1 }}
          >
            <Spectrum
              linesPerParagraph={lines > 1 ? lines : 1}
              width={500}
              colors={["#757575", "#999999", "#0871F2", "#BF5AF2"]}
            />
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

If you click the button now, you can see that the exit prop is used and our animation works on enter an exit, this component is actual magic.

More interesting props can also be the `transition` prop and this where you can define things like duration, ease and delay, and for example to set the duration to 1, you can add to our `motion.main` the following prop:

```jsx
  transition={{ duration: 1 }}
```

And now our animation will be 1s long.

I hope this gets you excited about Framer Motion.

[Link to CodeSandbox](https://codesandbox.io/s/framer-motion-9lqy0)

## Styling

**Winner: [Styled Components](https://www.styled-components.com/)**

I have been using `styled-components` basically since it got out, I think it's an amazing approach that addresses all my concerns with CSS in JS, as it has string interpolation, theming, SSR and even global styles that are attached to the theme, in my opinion, it's the almost perfect solution because even if you don't like to use CSS in template strings you can always also use styled-components in the object form leaving the API up to you and your preferences.

All these next points will be using the template strings version merely out of preference.

We will start from the top down starting by creating a theme that we can use in all our components, as any application usually merely uses a set of colors that are specified in this theme so let's start by installing styled-components:

```bash
yarn add styled-components
```

After this let's create a new file called `styles.js` in a `utils` folder and let's start our theme:

```js
export const theme = {
  colors: {
    white: "#F1F2EB",
    grey: "#D8DAD3",
    black: "#4A4A48"
  },
  font:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
};
```

To use this theme let's now go to our `index.js` and import it along with the `ThemeProvider` from styled-components:

```js
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "./utils/styles";

function App() {
  const [counter, setCounter] = useState(0);
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <h1>Click The Button</h1>
        <button
          // checks if number is even
          even={counter % 2 === 0}
          onClick={() => setCounter(counter => counter + 1)}
        >
          I am the button
        </button>
        <h2>{counter}</h2>
      </div>
    </ThemeProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

Awesome! We now have a theme and let's start using it to declare some global styles, by that I mean styles that apply everywhere. It’s kind of like a general `styles.css`, but it also has access to our theme. For that we can use the `createGlobalStyle` function from styled-components and in our `utils/styles.js`. Let's add our base styles:

```js
export const Styles = createGlobalStyle`
  body {
    text-align: center;
    margin: 0;
    background-color: ${props => props.theme.colors.black};
    color: ${props => props.theme.colors.white};
    font-family: ${props => props.theme.font}
  }
`;
```

The name has to start with an uppercase letter as this will be mounted as a component on our DOM.

As you can see we are constantly getting the props in almost all the rules, we can also do something like:

```js
const Styles = createGlobalStyle`
  ${({ theme }) => `
    body {
      text-align: center;
      margin: 0;
      background-color: ${theme.colors.black};
      color: ${theme.colors.white};
      font-family: ${theme.font};
    }
  `}
`;
```

At the end it's up to you how you want to do this and get the values from the props.

Let's now get our global styles and apply them to our body:

```jsx
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { theme, Style } from "./utils/styles";

function App() {
  const [counter, setCounter] = useState(0);
  return (
    <ThemeProvider theme={theme}>
      <>
        <Style />
        <div className="App">
          <h1>Click The Button</h1>
          <button
            // checks if number is even
            even={counter % 2 === 0}
            onClick={() => setCounter(counter => counter + 1)}
          >
            I am the button
          </button>
          <h2>{counter}</h2>
        </div>
      </>
    </ThemeProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

If you check your page you now have the global styles applied to our body. The idea is that now we have a base where we can style singular elements and let's make an example with the button we have there.

The way styled components works is that we have the styled function that like in framer motion gets an HTML element after it in order to return a styled version of that element like so:

```js
const Heading = styled.h1`
  display: block;
`;
```

If you want to style another component you can also do so by passing function to styled like so:

```js
const Heading = styled(MyComponent)`
  display: block;
`;
```

Now that we know the basics we can create our styled button like so:

```jsx
import React, { useState } from "react";
import ReactDOM from "react-dom";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { theme, Style } from "./utils/styles";

const Button = styled.button`
  background: black;
  border: none;
  padding: 8px 12px;
  color: ${props => props.theme.colors.white};
  transition: all 200ms ease;
`;

function App() {
  const [counter, setCounter] = useState(0);
  return (
    <ThemeProvider theme={theme}>
      <>
        <Styles />
        <div className="App">
          <h1>Click The Button</h1>
          <Button
            even={counter % 2 === 0}
            onClick={() => setCounter(counter => counter + 1)}
          >
            I am the button
          </Button>
          <h2>{counter}</h2>
        </div>
      </>
    </ThemeProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

As you can see we create a styled component with the `button` tag and we then can use that element as we would use our button.

So, our button has some styles, but we also want to check that `even` prop we have and make some style changes if we do have an even number in the counter. So for that, we get the props again and do an `if` and our button will look like this:

```js
const Button = styled.button`
  background: black;
  border: none;
  padding: 8px 12px;
  color: ${props => props.theme.colors.white};
  transition: all 200ms ease;

  ${props =>
    props.even &&
    css`
      background: ${props.theme.colors.white};
      color: black;
    `}
`;
```

We can also destructure our props like so:

```js
const Button = styled.button`
  background: black;
  border: none;
  padding: 8px 12px;
  color: ${props => props.theme.colors.white};
  transition: all 200ms ease;

  ${({ even, theme }) =>
    even &&
    css`
      background: ${theme.colors.white};
      color: black;
    `}
`;
```

As you can see we have a new function and that the `css` function and what that does is that it takes strings and makes them into CSS values that styled-components can use to style our page.

I have the idea that styled-components is the perfect combination of the power of CSS and the power of JavaScript to create a very good way to manage our CSS.

## Forms

**Winner: [Formik](https://jaredpalmer.com/formik/)**

Forms! No one likes to write them, not even to fill them, and honestly React does not help us at all with forms so a bunch of packages have sprung out to help us get forms done without crying. That's exactly what Formik promises and it delivers really well.

For this example, to see how formik works, we will be making a registration form with validation.

Let's start by adding formik:

```bash
yarn add formik
```

Now that we have formik, lets see how our JSX looks without any events added:

```jsx
import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";

const App = () => {
  return (
    <main className="App">
      <h1>Sign Up</h1>
      <form>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" />
        <label htmlFor="email">Email</label>
        <input type="email" id="email" />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" />
        <button type="submit">Sign Up</button>
      </form>
    </main>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

As you can see, we will have the standard form with name, email and password fields that we want to hook up to formik. We should start by importing the formik hook and defining our base formik state:

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { useFormik } from "formik";
import "./styles.css";

const App = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: ""
    },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    }
  });
  return (
    <main className="App">
      <h1>Sign Up</h1>
      <form>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" />
        <label htmlFor="email">Email</label>
        <input type="email" id="email" />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" />
        <button type="submit">Sign Up</button>
      </form>
    </main>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

By adding this hook, formik will now give us some functions for normal things like `onChange`, `onBlur` and it will also keep track of our values as these `initialValues` map to values of the same name that formik will track when added to an input.

Better to show with code:

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { useFormik } from "formik";
import "./styles.css";

const App = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: ""
    },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    }
  });

  const { values } = formik;
  return (
    <main className="App">
      <h1>Sign Up</h1>
      <form>
        <label htmlFor="name">Name</label>
        <input
          onChange={formik.handleChange}
          value={values.name}
          onBlur={formik.handleBlur}
          type="text"
          id="name"
        />
        <label htmlFor="email">Email</label>
        <input
          onChange={formik.handleChange}
          value={values.email}
          onBlur={formik.handleBlur}
          type="email"
          id="email"
        />
        <label htmlFor="password">Password</label>
        <input
          onChange={formik.handleChange}
          value={values.password}
          onBlur={formik.handleBlur}
          type="password"
          id="password"
        />
        <button type="submit">Sign Up</button>
      </form>
    </main>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

Our values will be tracked, but that is a lot of boilerplate so we clean it up with the `getFieldProps` functions that formik will also give us. This will make our inputs looks like this:

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { useFormik } from "formik";
import "./styles.css";

const App = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: ""
    },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    }
  });

  const { values, getFieldProps } = formik;
  return (
    <main className="App">
      <h1>Sign Up</h1>
      <form>
        <label htmlFor="name">Name</label>
        <input {...getFieldProps("name")} type="text" id="name" />
        <label htmlFor="email">Email</label>
        <input {...getFieldProps("email")} type="email" id="email" />
        <label htmlFor="password">Password</label>
        <input {...getFieldProps("password")} type="password" id="password" />
        <button type="submit">Sign Up</button>
      </form>
    </main>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

This will attach events like `onBlur`, `onChange`, and all the necessary hooks that formik needs in order to track everything properly. With this done, let's add the submit function to our form and test it with the alert defined up top:

```jsx
      <form onSubmit={formik.handleSubmit}>
```

You will now see the values you typed in the `alert` returned by the `onSubmit` event. You can use this to send your field data to an API.

So far, I think this is a pretty good developer experience for forms while also offering more complex functions, making formik a very complete package.

The final thing I want to add is field validation. This `validate` function must return an `errors` object that has the same values as the fields we have in our form, so if I want to validate our password field, I could add a function like this:

```js
const validate = values => {
  const errors = {};
  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length < 5) {
    errors.password = "Password must be at least 5 characters long";
  }
  return errors;
};
```

Now, let's pass this function to `useFormik` like so:

```js
const formik = useFormik({
  initialValues: {
    name: "",
    email: "",
    password: ""
  },
  validate,
  onSubmit: values => {
    alert(JSON.stringify(values, null, 2));
  }
});
```

You now have validation in your forms. The next step is showing on the page, for that we need to access the `errors` object and get the value we want like this:

```jsx
<label htmlFor="name">Name</label>
<input type="text" id="name" {...formik.getFieldProps("name")} />
{errors.name && touched.name ? <span>{errors.name}</span> : null}
```

Here we check if there is an error and if the input has been touched, if both of these are true we show an error to the user.

I like the fact that the validate function is pure JavaScript. You can also install libraries like [Yup](https://www.npmjs.com/package/yup) to help you in validating these strings.

[Link to CodeSandbox](https://codesandbox.io/s/formik-example-h3iqr)

## Dates

**Winner: [date-fns](https://date-fns.org/)**

Dates are hard, dates are really hard, so a good date library goes a long way. t first, and for a long time, I used [Moment.js](https://momentjs.com/), but the reason I stopped is because moment is [a very big package](https://bundlephobia.com/result?p=moment@2.24.0) and most of the time I just wanted to format some dates and the only way to use it was to import the whole package as it wasn't a package you could just import functions from.

Date-fns is a package with the same formatting and calculation options as moment but one that is completely tree-shakable and able to be imported function by function.

The only thing it doesn't have as part of the core package is timezone support, so if this is something you may need it may be better to stick with moment.

Let's make a very simple example where I format the current date and see how many days there are until a certain date.

Let's start by installing date-fns:

```bash
yarn add fate-fns
```

Then I am gonna create a variable to hold the date for this moment and call it `now`

```js
const now = new Date();
```

This is the date we will be manipulating and showing as we please, so let's now import the `format` function from `date-fns` and use it:

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { format } from "date-fns";

const now = new Date();

function App() {
  return (
    <div className="App">
      <p>Today is {format(now, "dd/MM/yyyy")}</p>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

So what I do here is that I pass two parameters to the `format` function, the first one is the date that is to be formatted and the second one is how we want to format it. Here, `date-fns` uses a series of tokens that you can see [here](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table).

In this case, I format it to look like `07/01/2020`, the two `d` means I want to get the day of the month and if smaller than 10, prepend a zero. Same idea with the month, where I say `MM` because one `M` will return me the month without a prepended zero.
The last part is the year and I want that in four digits. Between these I placed `/` since this is how I want to separate the date parts, so here you could pass something else like `-` and the function would look like:

```js
format(now, "dd-MM-yyyy");
```

It does sound confusing and like a lot to memorize but in all honesty I never memorized these things and resort to the documentation in case of any doubts and they also have pretty good documentation.

Let's now see how many days until it's Christmas, first let's create a new variable called `christmas` and in there we will make a new date that will resolve to christmas day.

```js
const xmas = new Date(2020, 12, 25, 0, 0, 0);
```

Here we pass the year, month, day, hour, minute and second we want the new date object to be set to.

[Link to CodeSandbox](https://codesandbox.io/s/date-fns-example-0uj5y)

## GraphQL

**Winner: [React Apollo](https://www.apollographql.com/docs/react/)**

GraphQL is amazing! It lets you build faster and more responsive UIs, it lets the client side decide which data it wants to get instead of getting everything at once (overfetching).

To implement it on the frontend, I use Apollo because their API is pretty solid to help you get started.

To demonstrate how the fetching of data in Apollo works, we will create a simple application that calls a GraphQL API where I have a list of the worst movies ever and you can see the API on [CodeSandbox](https://codesandbox.io/s/dt0ge).

Let's start by installing all the packages we need, then we'll go over why we need each one:

```bash
yarn add apollo-boost @apollo/react-hooks graphql
```

- `apollo-boost`: Package that contains what you need to initialize and Apollo client and also some utilities.
- `@apollo/react-hooks`: The hooks that are used to do queries and mutations.
- `graphql`: To parse your queries.

Now that we have all this installed, we first need to create a client, this is where we will point to our GraphQL API:

```js
import React from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import App from "./App";

const client = new ApolloClient({
  uri: "https://dt0ge.sse.codesandbox.io/"
});
```

One thing you need to know is that `apollo-boost` is framework agnostic, this creates a standard Apollo client that can be plugged into any framework, so to let Apollo know we are using React, we need to import the `Provider` from `@apollo/react-hooks` and wrap it around our application like this:

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import App from "./App";

const client = new ApolloClient({
  uri: "https://dt0ge.sse.codesandbox.io/"
});

const Main = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<Main />, rootElement);
```

Having this helps all our components know where to make the queries, mutations and any other global configuration we may have for our application.

Let's now move to our `App.js` and write our first query:

```graphql
query AllMovies {
  all {
    id
    title
    rating
    info {
      poster_path
    }
  }
}
```

Here we are getting all the movies, then we cherry pick what we want to show in this case:

- `id` - To link to the IMDB page.
- `title` - To show people the name of the movie.
- `rating` - Since we are showing terrible movies I feel like this is important.
- `poster_path` - To have a visual for the movie.

If you copy this into [here](https://codesandbox.io/s/dt0ge), you will see it will give us some movies but they are not ordered by rating. For that, we can add a filter:

```graphql
query AllMovies {
  all(filter: { sortBy: rating }) {
    id
    title
    rating
    info {
      poster_path
    }
  }
}
```

Now that we have this, we can actually make it in a way where Apollo will understand, for that we need `gql`, which is a parser for GraphQL strings for JavaScript we can use.

```jsx
import React from "react";
import { gql } from "apollo-boost";

const movies = gql`
  query AllMovies {
    all(filter: { sortBy: rating }) {
      id
      title
      rating
      info {
        poster_path
      }
    }
  }
`;
```

This variable is now ready to be used in Apollo with the `useQuery` hook, let's import it and use it:

```jsx
import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const movies = gql`
  query AllMovies {
    all(filter: { sortBy: rating }) {
      id
      title
      rating
      info {
        poster_path
      }
    }
  }
`;

export default function App() {
  const { loading, data, error } = useQuery(movies);
  if (loading) return "loading";
  if (error) return "Oh no :(";
  return JSON.stringify(data, null, 2);
}
```

By looking at the browser, you can see you have a huge mess of objects and arrays, but we can see that our movies are all inside an `all` object and we can map over it to get the info about our movies:

```jsx
import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const movies = gql`
  query AllMovies {
    all(filter: { sortBy: rating }) {
      id
      title
      rating
      info {
        poster_path
      }
    }
  }
`;

export default function App() {
  const { loading, data } = useQuery(movies);
  if (loading) return "loading";
  return (
    <section class="cf ph2-ns">
      <h1 className="tc">The worst movies ever</h1>
      {data.all.map(movie => (
        <div key={movie.id} class="fl w-100 w-50-ns tc pa3 pa5-ns">
          <article class="hide-child relative ba b--black-20 mw5 center">
            <img src={movie.info.poster_path} class="db" alt={movie.title} />
            <div class="pa2 bt b--black-20">
              <a
                href={`https://www.imdb.com/title/${movie.id}`}
                target="_blank"
                rel="noopener noreferrer"
                class="f6 db link dark-blue hover-blue"
              >
                {movie.title}
              </a>
              <p class="f6 gray mv1">{movie.rating}/10</p>
            </div>
          </article>
        </div>
      ))}
    </section>
  );
}
```

> The classes used here are for usage with the library [Tachyons](https://tachyons.io/)

As you can see, getting this information was relatively painless after we dived a bit into the basics of GraphQL.

If you want to learn more, I have a couple of free videos online where I taught GraphQL in a workshop in Kiev on [YouTube](https://www.youtube.com/watch?v=Ql_iiJH0whM), here I go over making the node server and the frontend part.

[Link to CodeSandbox](https://codesandbox.io/s/apollo-example-hbv7u)

## UI Toolkits

UI Toolkits can be useful for various reasons like getting a website up and running faster, to maintain a consistent design or even for some help with accessibility.

For that reason I decided to divide this part into two different categories, one for toolkits that already styled and one for toolkits that don't and are intended to let you put all your styles on top of their components.

### Unstyled

**Winner: [Reakit](https://reakit.io/)**

When it comes to unstyled toolkits, I have been using Reakit for a while as it helps me a lot with getting accessibility right in trickier things like modals and dropdown menus.

As our usual first step, let's start by installing `reakit`:

```
yarn add reakit
```

Because of the simplicity offered by this toolkit by its lack of either styling or global state, there is no need to add a `Provider` component to get full advantage of it. We can start making some accessible components right away.

Let's start with a modal:

```jsx
import React from "react";
import { useDialogState, Dialog, DialogDisclosure } from "reakit/Dialog";

export default function App() {
  const dialog = useDialogState();

  return (
    <>
      <DialogDisclosure {...dialog}>Open dialog</DialogDisclosure>
      <Dialog {...dialog} aria-label="Welcome Modal">
        I am a modal
      </Dialog>
    </>
  );
}
```

You can now see a button that when clicked opens a modal and traps the focus in it as specified by the accessibility guidelines. You can then style it as you please to fit with the design of your project.

Let's do one more example and show how to make some tabs using `reakit`:

```jsx
import React from "react";
import { useTabState, Tab, TabList, TabPanel } from "reakit/Tab";

export default function App() {
  const tab = useTabState();
  return (
    <>
      <TabList {...tab} aria-label="My tabs">
        <Tab {...tab} stopId="tab1">
          Tab 1
        </Tab>
        <Tab {...tab} stopId="tab2">
          Tab 2
        </Tab>
        <Tab {...tab} stopId="tab3">
          Tab 3
        </Tab>
      </TabList>
      <TabPanel {...tab} stopId="tab1">
        Tab 1
      </TabPanel>
      <TabPanel {...tab} stopId="tab2">
        Tab 2
      </TabPanel>
      <TabPanel {...tab} stopId="tab3">
        Tab 3
      </TabPanel>
    </>
  );
}
```

When you check the live version of this in your browser, you can see that you have three tabs but none of them is selected by default, so the panel shows up empty. We can fix this by passing a parameter to the `useTabState` function:

```js
const tab = useTabState({ selectedId: "tab1" });
```

By doing this you can now see that now the first tab shows up as selected by default on load, then you can swap the visible tab more intuitively.

If you are wondering how you can style these elements, `reakit` has a page with all the ways they can be styled in [their documentation](https://reakit.io/docs/styling/)

[Link to CodeSandbox](https://codesandbox.io/s/reakit-example-8hmoz)

### Styled

**Winner: [Atlaskit](https://atlaskit.atlassian.com/)**

When it comes to styled options, I looked at a lot of them and Atlaskit is the one that has EVERYTHING you may need. If you think about it, Atlaskit is used inside of Jira itself after all, and whether you love it or not, it does contain every single UI element you can think of.

There are a couple of things that are very specific about Atlaskit, like the fact that since it's an Atlassian product, it's hosted on Bitbucket. Atlaskit is also split into several packages, as in: every component is a package. In a way, this means your bundle will be smaller, but it is kind of a hassle. Can't have everything, right? That's not the German or Catholic way.

Let's then build the same example, starting with a modal. For this, we need to install two packages: Atlaskit's `button` and `modal-dialog`:

```bash
yarn add @atlaskit/button @atlaskit/modal-dialog
```

After the packages have been installed, the code for our modal will look like this:

```jsx
import React, { useState } from "react";
import Button from "@atlaskit/button";
import Modal, { ModalTransition } from "@atlaskit/modal-dialog";

const ModalComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ModalTransition>
        {isOpen && (
          <Modal
            actions={[{ text: "Close", onClick: close }]}
            onClose={close}
            heading="Hello"
          >
            <h2> I am a modal</h2>
          </Modal>
        )}
      </ModalTransition>
    </>
  );
};

export default ModalComponent;
```

When using Atlaskit we do have to manage the state by ourselves, but it does allow us for a more fine-grained experience.

You may find it weird that there is a component called `ModalTransition`, which is actually a wrapper component that allows components to animate out when they are removed from the React tree, much like the [`AnimatePresence`](https://www.framer.com/api/motion/animate-presence/) element in `framer-motion`.

Something else that may be kind of out of the ordinary is the `actions` array that is passed as a prop, these actions are actually the buttons that you can see at the bottom of the modal. If you want to add another one, you can make a new object and add it to the array like this:

```jsx
import React, { useState } from "react";
import Button from "@atlaskit/button";
import Modal, { ModalTransition } from "@atlaskit/modal-dialog";

const ModalComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ModalTransition>
        {isOpen && (
          <Modal
            actions={[
              { text: "Close", onClick: close },
              { text: "Example", onClick: () => console.log("sup") }
            ]}
            onClose={close}
            heading="Hello"
          >
            <h2> I am a modal</h2>
          </Modal>
        )}
      </ModalTransition>
    </>
  );
};

export default ModalComponent;
```

Moving on to our dropdown element, we need to go back and install on more package, `dropdown-menu`:

```bash
  yarn add @atlaskit/dropdown-menu
```

Then our code will look like this:

```jsx
import React from "react";
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem
} from "@atlaskit/dropdown-menu";

const Dropdown = () => (
  <DropdownMenu
    trigger="Berlin Teams"
    triggerType="button"
    onOpenChange={e => console.log("dropdown opened", e)}
  >
    <DropdownItemGroup>
      <DropdownItem>Union Berlin</DropdownItem>
      <DropdownItem>Hertha Berlin</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);

export default Dropdown;
```

Another amazing thing about Atlaskit is that their documentation is outstanding (Vue level) and all packages have examples that can even be edited on CodeSandbox, so anything you may need is probably there waiting for you.

[Link to CodeSandbox](https://codesandbox.io/s/atlaskit-example-pkhcj)

# The Hooks

Hooks are dope?! Right? RIGHT?

Well yes, but some of them can be quite confusing when starting with them or changing from class to function components. In this chapter, I will go through some of them.

## useEffect

## useContext

## useCallback

## useMemo

## When should I use class components?

# The Lingo Glossary

### SSR

**Server Side Rendering**

I use this term a lot when talking about things like `next`, and it means that your application will be rendered on the server before getting it fully rendered to the client, this helps a lot with both perceived performance and SEO.

### PWA

**Progressive Web App**

In simple terms a PWA is a website/app that can be added to your phone's home screen and that usually works offline by using service workers, they also have a fancy loading screen.

### CRA

**Create React App**

The fastest way to get started with React locally, it clones a project ready to go using `react-scripts`.

### Monorepo

**Basically one repo with folders for projects**

At CodeSandbox we use monorepos with `lerna`, this allows you to have all your mini applications in one repo and in different `packages`. It makes it easier to run things in parallel and to import packages that are meant to be used in the same application.

<!-- ### Hydration

**Get that SSR data to JS**

### JAMSTACK

**Who needs servers ?** -->
